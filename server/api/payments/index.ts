// server/api/payments/index.ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/payments — list all payments
  if (method === 'GET') {
    try {
      const payments = await sql`
        SELECT
          p.id              AS id,
          p.appointment_id,
          a.booking_code    AS booking_code,
          c.name            AS client_name,
          t.name            AS stylist_name,
          p.amount,
          p.paid_at         AS paid_at,
          p.method          AS payment_method
        FROM payments p
        JOIN appointments a ON p.appointment_id = a.id
        JOIN clients c      ON a.client_id      = c.id
        JOIN stylists t     ON a.stylist_id     = t.id
        ORDER BY p.paid_at DESC
      `
      return payments
    } catch (err: any) {
      console.error('GET /api/payments error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch payments' })
    }
  }


  if (method === 'POST') {
    // Only pick up the fields we care about
    const {
      appointment_id,
      amount,
      payment_method,    // must be 'Cash' | 'Card' | 'Online'
      paid_at            // optional
    } = await readBody<{
      appointment_id: number
      amount: number
      payment_method: 'Cash'|'Card'|'Online'
      paid_at?: string
    }>(event)

    if (!appointment_id || amount == null || !payment_method) {
      throw createError({
        statusCode: 400,
        statusMessage: 'appointment_id, amount and payment_method are required'
      })
    }

    try {
      // Build two variants of the insert:
      let newPay
      if (paid_at) {
        // Custom timestamp supplied
        [newPay] = await sql`
          INSERT INTO payments (appointment_id, amount, paid_at, method)
          VALUES (${appointment_id}, ${amount}, ${paid_at}, ${payment_method})
          RETURNING 
            id,
            appointment_id,
            (SELECT booking_code FROM appointments WHERE id = ${appointment_id}) AS booking_code,
            (SELECT name        FROM clients      WHERE id = (SELECT client_id  FROM appointments WHERE id = ${appointment_id})) AS client_name,
            (SELECT name        FROM stylists     WHERE id = (SELECT stylist_id FROM appointments WHERE id = ${appointment_id})) AS stylist_name,
            amount,
            paid_at,
            method       AS payment_method
        `
      } else {
        // No paid_at: let DB default to NOW()
        [newPay] = await sql`
          INSERT INTO payments (appointment_id, amount, method)
          VALUES (${appointment_id}, ${amount}, ${payment_method})
          RETURNING 
            id,
            appointment_id,
            (SELECT booking_code FROM appointments WHERE id = ${appointment_id}) AS booking_code,
            (SELECT name        FROM clients      WHERE id = (SELECT client_id  FROM appointments WHERE id = ${appointment_id})) AS client_name,
            (SELECT name        FROM stylists     WHERE id = (SELECT stylist_id FROM appointments WHERE id = ${appointment_id})) AS stylist_name,
            amount,
            paid_at,
            method       AS payment_method
        `
      }
      return newPay
    } catch (err: any) {
      console.error('POST /api/payments error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create payment' })
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
