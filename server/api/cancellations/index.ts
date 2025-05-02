import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/cancellations — list all cancellations
  if (method === 'GET') {
    try {
      const rows = await sql`
        SELECT
          ac.appointment_id,
          a.booking_code,
          ac.reason_text,
          ac.cancelled_at
        FROM appointment_cancellations ac
        JOIN appointments a ON ac.appointment_id = a.id
        ORDER BY ac.cancelled_at DESC
      `
      return rows
    } catch (err: any) {
      console.error('GET /api/cancellations error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch cancellations' })
    }
  }

  // POST /api/cancellations — record a new cancellation
  if (method === 'POST') {
    const { appointment_id, reason_text } =
      await readBody<{ appointment_id: number; reason_text: string }>(event)

    if (!appointment_id || !reason_text) {
      throw createError({
        statusCode: 400,
        statusMessage: 'appointment_id and reason_text are required'
      })
    }

    try {
      const [newCancel] = await sql`
        INSERT INTO appointment_cancellations (appointment_id, reason_text)
        VALUES (${appointment_id}, ${reason_text})
        RETURNING appointment_id, reason_text, cancelled_at
      `
      return newCancel
    } catch (err: any) {
      console.error('POST /api/cancellations error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to record cancellation' })
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
