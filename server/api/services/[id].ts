// server/api/services/[id].ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing service id' })

  const method = event.node.req.method

  // GET /api/services/:id  — fetch a single service
  if (method === 'GET') {
    try {
      const [service] = await sql`
        SELECT id, name, description, price
          FROM services
         WHERE id = ${+id}
      `
      if (!service) throw createError({ statusCode: 404, statusMessage: 'Not found' })
      return service
    } catch (err: any) {
      console.error(`GET /api/services/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: err.message })
    }
  }

  // PUT /api/services/:id  — update a service
  if (method === 'PUT') {

    const body = await readBody<{
      name?: string
      description?: string
      price?: number
    }>(event)
    // Build dynamic SET clause
    const updates: string[] = []
    const values: any[] = []

    if (
      body.name        === undefined &&
      body.description === undefined &&
      body.price  === undefined
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Provide at least one of name, description, or price'
      })
    }
    try {
      const [updated] = await sql`
        UPDATE services
           SET 
             name           = COALESCE(${body.name}, name),
             description = COALESCE(${body.description}, description),
             price      = COALESCE(${body.price}, price)
         WHERE id = ${+id}
        RETURNING id, name, description, price
      `
      return updated
    } catch (err: any) {
      console.error(`PUT /api/services/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: err.message })
    }
  }

  // DELETE /api/services/:id  — remove a service
  if (method === 'DELETE') {
    try {
      await sql`DELETE FROM services WHERE id = ${+id}`
      return { success: true }
    } catch (err: any) {
      console.error(`DELETE /api/services/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: err.message })
    }
  }

  // All other methods are not supported
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
