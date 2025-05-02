// server/api/clients/[id].ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing client id' })

  const method = event.node.req.method

  // GET /api/clients/:id — fetch one client
  if (method === 'GET') {
    try {
      const [client] = await sql`
        SELECT id, name, email, phone
          FROM clients
         WHERE id = ${+id}
      `
      if (!client) throw createError({ statusCode: 404, statusMessage: 'Client not found' })
      return client
    } catch (err: any) {
      console.error(`GET /api/clients/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: err.message })
    }
  }

  // PUT /api/clients/:id — update a client (only provided fields)
  if (method === 'PUT') {
    const body = await readBody<{
      name?: string
      email?: string
      phone?: string | null
    }>(event)

    // require at least one field
    if (
      body.name  === undefined &&
      body.email === undefined &&
      body.phone === undefined
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Provide at least one of name, email, or phone'
      })
    }

    try {
      const [updated] = await sql`
        UPDATE clients
           SET
             name  = COALESCE(${body.name}, name),
             email = COALESCE(${body.email}, email),
             phone = COALESCE(${body.phone}, phone)
         WHERE id = ${+id}
        RETURNING id, name, email, phone
      `
      if (!updated) {
        throw createError({ statusCode: 404, statusMessage: 'Client not found' })
      }
      return updated
    } catch (err: any) {
      console.error(`PUT /api/clients/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: err.message })
    }
  }

  // DELETE /api/clients/:id — remove a client
  if (method === 'DELETE') {
    try {
      await sql`DELETE FROM clients WHERE id = ${+id}`
      return { success: true }
    } catch (err: any) {
      console.error(`DELETE /api/clients/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: err.message })
    }
  }

  // All other methods not supported
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
