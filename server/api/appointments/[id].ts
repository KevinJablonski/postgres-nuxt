import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const id     = +event.context.params!.id!
  const method = event.node.req.method

  // GET /api/appointments/:id — fetch one appointment
  if (method === 'GET') {
    try {
      const [a] = await sql`
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
          a.status
        FROM appointments a
        JOIN clients  c   ON a.client_id  = c.id
        JOIN services srv ON a.service_id = srv.id
        JOIN stylists s   ON a.stylist_id = s.id
        WHERE a.id = ${id}
      `
      if (!a) throw createError({ statusCode: 404, statusMessage: 'Not found' })
      return a
    } catch (err: any) {
      console.error(`GET /api/appointments/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch appointment' })
    }
  }

  // PUT /api/appointments/:id — update service/status or reschedule
  if (method === 'PUT') {
    const {
      service_id,
      status,
      appointment_datetime,
      slot_id,
    } = await readBody<Partial<{
      service_id: number
      status: string
      appointment_datetime: string
      slot_id: number
    }>>(event)

    if (
      service_id       === undefined &&
      status           === undefined &&
      appointment_datetime === undefined
    ) {
      throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
    }

    try {
      const updated = await sql.begin(async tx => {
        await tx`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`

        // if rescheduling, lock & delete the new slot
        if (appointment_datetime && slot_id) {
          const slots = await tx`
            SELECT id
              FROM availability
             WHERE id = ${slot_id}
             FOR UPDATE
          `
          if (!slots.length) {
            throw createError({ statusCode: 409, statusMessage: 'Slot no longer available' })
          }
          await tx`DELETE FROM availability WHERE id = ${slot_id}`
        }

        // perform the update
        const [appt] = await tx`
          UPDATE appointments
             SET
               ${service_id         !== undefined ? tx`service_id           = ${service_id},`         : tx``}
               ${status             !== undefined ? tx`status               = ${status},`             : tx``}
               ${appointment_datetime !== undefined ? tx`appointment_datetime = ${appointment_datetime}::timestamp,` : tx``}
               id = id  -- no-op to handle trailing comma
           WHERE id = ${id}
          RETURNING *
        `
        return appt
      })

      if (!updated) {
        throw createError({ statusCode: 404, statusMessage: 'Appointment not found' })
      }
      return updated
    } catch (err: any) {
      console.error(`PUT /api/appointments/${id} error:`, err)
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.statusMessage || 'Failed to update appointment',
      })
    }
  }

  // DELETE /api/appointments/:id — remove appointment
  if (method === 'DELETE') {
    try {
      await sql`DELETE FROM appointments WHERE id = ${id}`
      return { success: true }
    } catch (err: any) {
      console.error(`DELETE /api/appointments/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete appointment' })
    }
  }

  // other methods not supported
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
