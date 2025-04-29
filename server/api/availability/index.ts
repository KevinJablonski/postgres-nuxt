// server/api/availability/index.ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/availability[?stylist_id=...]
  if (method === 'GET') {
    // parse stylist_id from querystring
    const url = new URL(event.node.req.url!, `http://${event.node.req.headers.host}`)
    const stylistId = url.searchParams.get('stylist_id')

    try {
      const rows = await sql`
        SELECT
          a.id,
          a.stylist_id,
          s.name       AS stylist_name,
          a.available_date,
          a.available_time
        FROM availability a
        JOIN stylists s ON a.stylist_id = s.id
        ${stylistId ? sql`WHERE a.stylist_id = ${+stylistId}` : sql``}
        ORDER BY a.available_date, a.available_time
      `
      return rows
    } catch (err: any) {
      console.error('GET /api/availability error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch availability' })
    }
  }

  // POST /api/availability
  if (method === 'POST') {
    const { stylist_id, available_date, available_time } =
      await readBody<{ stylist_id: number; available_date: string; available_time: string }>(event)

    if (!stylist_id || !available_date || !available_time) {
      throw createError({ statusCode: 400, statusMessage: 'stylist_id, date and time are required' })
    }

    try {
      const [newSlot] = await sql`
        INSERT INTO availability (stylist_id, available_date, available_time)
        VALUES (${stylist_id}, ${available_date}, ${available_time})
        RETURNING
          id,
          stylist_id,
          ${sql`(SELECT name FROM stylists WHERE id = ${stylist_id})`} AS stylist_name,
          available_date,
          available_time
      `
      return newSlot
    } catch (err: any) {
      console.error('POST /api/availability error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create slot' })
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
