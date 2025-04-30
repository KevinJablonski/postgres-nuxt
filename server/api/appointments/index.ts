// server/api/appointments/index.ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/appointments — list all appointments with joins
  if (method === 'GET') {
    try {
      const appointments = await sql`
        SELECT
          a.id,
          a.booking_code,
          a.appointment_datetime,
          a.status,
          c.id   AS client_id,
          c.name AS client_name,
          s.id   AS service_id,
          s.name AS service_name,
          t.id   AS stylist_id,
          t.name AS stylist_name
        FROM appointments a
        JOIN clients c   ON a.client_id  = c.id
        JOIN services s  ON a.service_id = s.id
        JOIN stylists t  ON a.stylist_id = t.id
        ORDER BY a.appointment_datetime
      `
      return appointments
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
      status = 'Scheduled',
    } = await readBody<{
      client_id: number
      service_id: number
      stylist_id: number
      appointment_datetime: string
      status?: string
    }>(event)

    if (!client_id || !service_id || !stylist_id || !appointment_datetime) {
      throw createError({
        statusCode: 400,
        statusMessage: 'client_id, service_id, stylist_id and appointment_datetime are required',
      })
    }

    try {
      const [newAppt] = await sql`
        INSERT INTO appointments (client_id, service_id, stylist_id, appointment_datetime, status)
        VALUES (${client_id}, ${service_id}, ${stylist_id}, ${appointment_datetime}, ${status})
        RETURNING id
      `
      // Fetch the joined record to return full info:
      const [full] = await sql`
        SELECT
          a.id,
          a.booking_code,
          a.appointment_datetime,
          a.status,
          c.id   AS client_id,
          c.name AS client_name,
          s.id   AS service_id,
          s.name AS service_name,
          t.id   AS stylist_id,
          t.name AS stylist_name
        FROM appointments a
        JOIN clients c   ON a.client_id  = c.id
        JOIN services s  ON a.service_id = s.id
        JOIN stylists t  ON a.stylist_id = t.id
        WHERE a.id = ${newAppt.id}
      `
      return full
    } catch (err: any) {
      console.error('POST /api/appointments error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create appointment' })
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
