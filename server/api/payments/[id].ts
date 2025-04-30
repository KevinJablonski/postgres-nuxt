// server/api/payments/[id].ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const idStr = event.context.params?.id
  if (!idStr) {
    throw createError({ statusCode: 400, statusMessage: 'Missing payment id' })
  }
  const id = parseInt(idStr, 10)
  const method = event.node.req.method

  // PUT /api/payments/:id — update a payment
  if (method === 'PUT') {
    const body = await readBody<{
      appointment_id?: number
      amount?: number
      paid_at?: string
      payment_method?: 'Cash' | 'Card' | 'Online'
    }>(event)

    // require at least one field
    if (
      body.appointment_id === undefined &&
      body.amount         === undefined &&
      body.paid_at        === undefined &&
      body.payment_method === undefined
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Provide at least one of appointment_id, amount, paid_at or payment_method'
      })
    }

    // coerce undefined → null so COALESCE works
    const apptId    = body.appointment_id ?? null
    const amt       = body.amount         ?? null
    const paidAt    = body.paid_at        ?? null
    const methodVal = body.payment_method ?? null

    try {
      // 1) update only the provided columns
      await sql`
        UPDATE payments p
           SET
             appointment_id = COALESCE(${apptId}, p.appointment_id),
             amount         = COALESCE(${amt},     p.amount),
             paid_at        = COALESCE(${paidAt},  p.paid_at),
             method         = COALESCE(${methodVal}, p.method)
         WHERE p.id = ${id}
      `

      // 2) fetch the joined row to return full info
      const [payment] = await sql`
        SELECT
          p.id,
          p.appointment_id,
          a.booking_code   AS booking_code,
          c.name           AS client_name,
          t.name           AS stylist_name,
          p.amount,
          p.paid_at,
          p.method         AS payment_method
        FROM payments p
        JOIN appointments a ON p.appointment_id = a.id
        JOIN clients c      ON a.client_id      = c.id
        JOIN stylists t     ON a.stylist_id     = t.id
        WHERE p.id = ${id}
      `
      if (!payment) {
        throw createError({ statusCode: 404, statusMessage: 'Payment not found after update' })
      }
      return payment
    } catch (err: any) {
      console.error(`PUT /api/payments/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update payment' })
    }
  }

  // DELETE /api/payments/:id — remove a payment
  if (method === 'DELETE') {
    try {
      await sql`DELETE FROM payments WHERE id = ${id}`
      return { success: true }
    } catch (err: any) {
      console.error(`DELETE /api/payments/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete payment' })
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
