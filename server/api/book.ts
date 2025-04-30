// server/api/book.ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  // 1) Pull everything we need from the client
  const {
    name,
    email,
    phone,
    service_id,
    stylist_id,
    appointment_datetime,
    slot_id
  } = await readBody<{
    name: string
    email: string
    phone?: string
    service_id: number
    stylist_id: number
    appointment_datetime: string  // e.g. "2025-05-03T09:00:00"
    slot_id: number
  }>(event)

  // 2) Validate
  if (!name || !email || !service_id || !stylist_id || !appointment_datetime || !slot_id) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }

  try {
    // 3) Run everything inside a transaction
    const booking = await sql.begin(async sql => {
      // A) Find or create the client
      const [existing] = await sql`
        SELECT id FROM clients WHERE email = ${email}
      `
      let client_id = existing?.id
      if (!client_id) {
        const [newClient] = await sql`
          INSERT INTO clients (name, email, phone)
          VALUES (${name}, ${email}, ${phone})
          RETURNING id
        `
        client_id = newClient.id
      }

      // B) Create the appointment
      const [appt] = await sql`
        INSERT INTO appointments
          (client_id, service_id, stylist_id, appointment_datetime)
        VALUES
          (${client_id}, ${service_id}, ${stylist_id}, ${appointment_datetime})
        RETURNING id, booking_code, appointment_datetime, status
      `

      // C) Remove that slot from availability
      await sql`
        DELETE FROM availability WHERE id = ${slot_id}
      `

      // D) Return the new appointment
      return appt
    })

    return booking
  } catch (err: any) {
    console.error('Booking error:', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to book appointment' })
  }
})
