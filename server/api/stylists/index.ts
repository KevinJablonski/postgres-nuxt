// server/api/stylists/index.ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/stylists — list all stylists
  if (method === 'GET') {
    try {
      const stylists = await sql`
      SELECT
        s.id,
        s.name,
        s.specialization,
        s.photo_url,
        get_stylist_avg_rating(s.id) AS avg_rating,
        (
          SELECT COUNT(*) 
            FROM stylist_schedule ss
           WHERE ss.stylist_id = s.id
             AND ss.appointment_datetime > NOW()
        ) AS upcoming_count
      FROM stylists s
      ORDER BY s.id
    `
    return stylists
    } catch (err: any) {
      console.error('GET /api/stylists error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch stylists' })
    }
  }

  // POST /api/stylists — create a new stylist
  if (method === 'POST') {
    const { name, specialization = '', photo_url = '' } =
      await readBody<{ name: string; specialization?: string; photo_url?: string }>(event)

    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'Name is required' })
    }

    try {
      const [newStylist] = await sql`
        INSERT INTO stylists (name, specialization, photo_url)
        VALUES (${name}, ${specialization}, ${photo_url})
        RETURNING id, name, specialization, photo_url
      `
      return newStylist
    } catch (err: any) {
      console.error('POST /api/stylists error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create stylist' })
    }
  }

  // Other methods not allowed
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
