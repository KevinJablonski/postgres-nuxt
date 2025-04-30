import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const m = event.node.req.method

  if (m === 'GET') {
    // List all reviews with appointment, client, stylist context
    const rows = await sql`
      SELECT
        r.id,
        r.appointment_id,
        a.booking_code    AS booking_code,
        c.name            AS client_name,
        t.name            AS stylist_name,
        r.rating,
        r.comment,
        r.review_date
      FROM reviews r
      JOIN appointments a ON r.appointment_id = a.id
      JOIN clients c      ON a.client_id      = c.id
      JOIN stylists t     ON a.stylist_id     = t.id
      ORDER BY r.review_date DESC
    `
    return rows
  }

  if (m === 'POST') {
    const { appointment_id, rating, comment } =
      await readBody<{ appointment_id: number; rating: number; comment?: string }>(event)
    if (!appointment_id || !rating) {
      throw createError({ statusCode:400, statusMessage:'appointment_id and rating are required' })
    }
    const [r] = await sql`
      INSERT INTO reviews (appointment_id, rating, comment)
      VALUES (${appointment_id}, ${rating}, ${comment})
      RETURNING id, appointment_id, rating, comment, review_date
    `
    return r
  }

  throw createError({ statusCode:405, statusMessage:'Method Not Allowed' })
})
