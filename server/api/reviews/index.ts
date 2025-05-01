import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // (unchanged) list all reviews...
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

  if (method === 'POST') {
    // read everything upfront
    const {
      appointment_id,
      booking_code,
      name,
      email,
      rating,
      comment = ''
    } = await readBody<{
      appointment_id?: number
      booking_code?:   string
      name?:           string
      email?:          string
      rating?:         number
      comment?:        string
    }>(event)

    let apptId: number

    // 1) If they passed appointment_id, use it directly:
    if (appointment_id) {
      apptId = appointment_id

    // 2) Otherwise, if they passed booking_code + name + email, verify and look it up:
    } else if (booking_code && name && email) {
      // find the appointment & client
      const [row] = await sql`
        SELECT a.id AS appointment_id, c.name AS client_name, c.email AS client_email
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        WHERE a.booking_code = ${booking_code}
      `
      if (!row) {
        throw createError({ statusCode: 404, statusMessage: 'Booking code not found' })
      }
      if (row.client_name !== name || row.client_email !== email) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Name or email does not match booking'
        })
      }
      apptId = row.appointment_id

    } else {
      // neither appointment_id nor valid booking_code flow
      throw createError({
        statusCode: 400,
        statusMessage: 'Must provide appointment_id or (booking_code + name + email)'
      })
    }

    // 3) rating is always required
    if (rating == null) {
      throw createError({ statusCode: 400, statusMessage: 'rating is required' })
    }

    // 4) finally, insert the review
    const [newReview] = await sql`
      INSERT INTO reviews (appointment_id, rating, comment)
      VALUES (${apptId}, ${rating}, ${comment})
      RETURNING id, appointment_id, rating, comment, review_date
    `
    return newReview
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
