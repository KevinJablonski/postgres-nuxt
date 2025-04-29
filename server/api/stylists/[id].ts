// server/api/stylists/[id].ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing stylist id' })

  const method = event.node.req.method

  // GET /api/stylists/:id — fetch one stylist
  if (method === 'GET') {
    try {
      const [stylist] = await sql`
        SELECT id, name, specialization, photo_url
          FROM stylists
         WHERE id = ${+id}
      `
      if (!stylist) throw createError({ statusCode: 404, statusMessage: 'Not found' })
      return stylist
    } catch (err: any) {
      console.error(`GET /api/stylists/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: err.message })
    }
  }

  // PUT /api/stylists/:id — update a stylist
  if (method === 'PUT') {
    // 1) Read the request body exactly once
    const body = await readBody<{
      name?: string
      specialization?: string
      photo_url?: string
    }>(event)
  
    // 2) Ensure at least one field was provided
    if (
      body.name        === undefined &&
      body.specialization === undefined &&
      body.photo_url   === undefined
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Provide at least one of name, specialization, or photo_url'
      })
    }
  
    try {
      // 3) Use COALESCE to keep existing values when undefined
      const [updated] = await sql`
        UPDATE stylists
           SET
             name           = COALESCE(${body.name}, name),
             specialization = COALESCE(${body.specialization}, specialization),
             photo_url      = COALESCE(${body.photo_url}, photo_url)
         WHERE id = ${+id}
        RETURNING id, name, specialization, photo_url
      `
      if (!updated) {
        throw createError({ statusCode: 404, statusMessage: 'Stylist not found' })
      }
      return updated
    } catch (err: any) {
      console.error(`PUT /api/stylists/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: err.message })
    }
  }

  // DELETE /api/stylists/:id — remove a stylist
  if (method === 'DELETE') {
    try {
      await sql`DELETE FROM stylists WHERE id = ${+id}`
      return { success: true }
    } catch (err: any) {
      console.error(`DELETE /api/stylists/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: err.message })
    }
  }

  // All other methods are not supported
  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
