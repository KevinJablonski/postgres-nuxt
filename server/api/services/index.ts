// server/api/services/index.ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/services — list all services
  if (method === 'GET') {
    try {
      const services = await sql`
        SELECT id, name, description, price
          FROM services
        ORDER BY id
      `
      return services
    } catch (err: any) {
      console.error('GET /api/services error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch services' })
    }
  }

  // POST /api/services — create a new service
  if (method === 'POST') {
    const body = await readBody<{ name: string; description?: string; price: number }>(event)
    const { name, description = '', price } = body

    // Basic validation
    if (!name || typeof price !== 'number') {
      throw createError({ statusCode: 400, statusMessage: 'Name and numeric price are required' })
    }

    try {
      const [newService] = await sql`
        INSERT INTO services (name, description, price)
        VALUES (${name}, ${description}, ${price})
        RETURNING id, name, description, price
      `
      return newService
    } catch (err: any) {
      console.error('POST /api/services error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create service' })
    }
  }

  // Other methods not allowed
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
