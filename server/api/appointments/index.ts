import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/appointments — list all appointments
  if (method === 'GET') {
    try {
      const appts = await sql`
        SELECT
          a.id,
          a.booking_code,
          a.client_id,
          c.name    AS client_name,
          a.service_id,
          srv.name  AS service_name,
          a.stylist_id,
          s.name    AS stylist_name,
          a.appointment_datetime,
          a.status,
          -- include slot_id if still available
          (SELECT id
             FROM availability
            WHERE stylist_id = a.stylist_id
              AND to_char(available_date,'YYYY-MM-DD') = to_char(a.appointment_datetime,'YYYY-MM-DD')
              AND to_char(available_time,'HH24:MI')  = to_char(a.appointment_datetime,'HH24:MI')
            LIMIT 1
          ) AS slot_id
        FROM appointments a
        JOIN clients  c   ON a.client_id  = c.id
        JOIN services srv ON a.service_id = srv.id
        JOIN stylists s   ON a.stylist_id = s.id
        ORDER BY a.appointment_datetime DESC
      `
      return appts
    } catch (err: any) {
      console.error('GET /api/appointments error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch appointments' })
    }
  }

  // POST /api/appointments — create a new appointment
  if (method === 'POST') {
    const {
      client_id,
      service_id,
      stylist_id,
      appointment_datetime,
      slot_id,
    } = await readBody<{
      client_id: number
      service_id: number
      stylist_id: number
      appointment_datetime: string
      slot_id: number
    }>(event)

    if (!client_id || !service_id || !stylist_id || !appointment_datetime || !slot_id) {
      throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
    }

    try {
      const newAppt = await sql.begin(async tx => {
        await tx`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`

        // lock & claim the slot
        const slots = await tx`
          SELECT id
            FROM availability
           WHERE id = ${slot_id} AND stylist_id = ${stylist_id}
           FOR UPDATE
        `
        if (!slots.length) {
          throw createError({ statusCode: 409, statusMessage: 'Slot no longer available' })
        }
        await tx`DELETE FROM availability WHERE id = ${slot_id}`

        // insert appointment
        const [appt] = await tx`
          INSERT INTO appointments
            (client_id, service_id, stylist_id, appointment_datetime)
          VALUES
            (${client_id}, ${service_id}, ${stylist_id}, ${appointment_datetime}::timestamp)
          RETURNING *
        `
        return appt
      })

      return newAppt
    } catch (err: any) {
      console.error('POST /api/appointments error:', err)
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.statusMessage || 'Failed to create appointment',
      })
    }
  }

  // all other methods not allowed here
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
