// server/api/clients/index.ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/clients — list all clients
  if (method === 'GET') {
    try {
      const clients = await sql`
        SELECT id, name, email, phone
          FROM clients
        ORDER BY id
      `
      return clients
    } catch (err: any) {
      console.error('GET /api/clients error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch clients' })
    }
  }

  // POST /api/clients — create a new client
  if (method === 'POST') {
    const { name, email, phone = null } =
      await readBody<{ name: string; email: string; phone?: string | null }>(event)

    if (!name || !email) {
      throw createError({ statusCode: 400, statusMessage: 'Name and email are required' })
    }

    try {
      const [newClient] = await sql`
        INSERT INTO clients (name, email, phone)
        VALUES (${name}, ${email}, ${phone})
        RETURNING id, name, email, phone
      `
      return newClient
    } catch (err: any) {
      console.error('POST /api/clients error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create client' })
    }
  }

  // Other methods not allowed here
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
