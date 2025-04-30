import { defineEventHandler, createError } from 'h3'
import postgres from 'postgres'
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const stylistId = Number(event.context.params?.stylistId)
  if (!stylistId) throw createError({ statusCode:400, statusMessage: 'Missing stylist ID' })
  try {
    const [{ get_stylist_avg_rating }] = await sql`
      SELECT get_stylist_avg_rating(${stylistId}) 
    `
    return { stylistId, avg_rating: get_stylist_avg_rating }
  } catch (err:any) {
    console.error(`GET /api/reports/avg-rating/${stylistId} error:`, err)
    throw createError({ statusCode:500, statusMessage:'Failed to fetch average rating' })
  }
})
