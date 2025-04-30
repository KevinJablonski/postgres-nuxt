import { defineEventHandler, createError } from 'h3'
import postgres from 'postgres'
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async () => {
  try {
    return await sql`SELECT * FROM monthly_revenue_by_service`
  } catch (err:any) {
    console.error('GET /api/reports/monthly-revenue error:', err)
    throw createError({ statusCode:500, statusMessage:'Failed to fetch revenue report' })
  }
})
