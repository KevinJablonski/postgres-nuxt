// server/api/appointments/[id].ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing appointment id' })

  const method = event.node.req.method

  // GET /api/appointments/:id — fetch one
  if (method === 'GET') {
    try {
      const [appt] = await sql`
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
        WHERE a.id = ${+id}
      `
      if (!appt) throw createError({ statusCode: 404, statusMessage: 'Appointment not found' })
      return appt
    } catch (err: any) {
      console.error(`GET /api/appointments/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch appointment' })
    }
  }

  // PUT /api/appointments/:id — update fields
  if (method === 'PUT') {
    const body = await readBody<{
      client_id?: number
      service_id?: number
      stylist_id?: number
      appointment_datetime?: string
      status?: string
    }>(event)

    if (
      body.client_id           === undefined &&
      body.service_id          === undefined &&
      body.stylist_id          === undefined &&
      body.appointment_datetime === undefined &&
      body.status              === undefined
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Provide at least one field to update'
      })
    }

    try {
      const [updated] = await sql`
        UPDATE appointments a
           SET client_id            = COALESCE(${body.client_id},            a.client_id),
               service_id           = COALESCE(${body.service_id},           a.service_id),
               stylist_id           = COALESCE(${body.stylist_id},           a.stylist_id),
               appointment_datetime = COALESCE(${body.appointment_datetime}, a.appointment_datetime),
               status               = COALESCE(${body.status},               a.status)
         WHERE a.id = ${+id}
        RETURNING a.id
      `
      if (!updated) throw createError({ statusCode: 404, statusMessage: 'Appointment not found' })

      // Return the full joined row again:
      const [appt] = await sql`
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
        WHERE a.id = ${+id}
      `
      return appt
    } catch (err: any) {
      console.error(`PUT /api/appointments/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update appointment' })
    }
  }

  // DELETE /api/appointments/:id — remove
  if (method === 'DELETE') {
    try {
      await sql`DELETE FROM appointments WHERE id = ${+id}`
      return { success: true }
    } catch (err: any) {
      console.error(`DELETE /api/appointments/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete appointment' })
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
