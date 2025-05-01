// server/api/book.ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
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
    appointment_datetime: string
    slot_id: number
  }>(event)

  if (!name || !email || !service_id || !stylist_id || !appointment_datetime || !slot_id) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }

  try {
    const booking = await sql.begin(async sql => {
      // 1) Upsert client
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

      // 2) Call your stored procedure to create the appointment
      await sql`
        CALL create_appointment(
          ${client_id},
          ${service_id},
          ${stylist_id},
          ${appointment_datetime}::timestamp
        )
      `

      // 3) Fetch the appointment we just inserted
      const [appt] = await sql`
        SELECT id, booking_code, appointment_datetime, status
          FROM appointments
         WHERE client_id             = ${client_id}
           AND service_id            = ${service_id}
           AND stylist_id            = ${stylist_id}
           AND appointment_datetime  = ${appointment_datetime}::timestamp
      `

      // 4) Remove the now‐booked slot
      await sql`
        DELETE FROM availability WHERE id = ${slot_id}
      `

      return appt
    })

    return booking
  } catch (err: any) {
    console.error('Booking error:', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to book appointment' })
  }
})
