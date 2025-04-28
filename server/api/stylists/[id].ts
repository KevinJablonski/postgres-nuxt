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
    const { name, specialization, photo_url } =
      await readBody<Partial<{ name: string; specialization: string; photo_url: string }>>(event)

    const updates: string[] = []
    const values: any[] = []
    if (name !== undefined)          { updates.push(`name = $${updates.length+1}`);          values.push(name) }
    if (specialization !== undefined){ updates.push(`specialization = $${updates.length+1}`);values.push(specialization) }
    if (photo_url !== undefined)     { updates.push(`photo_url = $${updates.length+1}`);     values.push(photo_url) }

    if (!updates.length) {
      throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
    }

    try {
      const [updated] = await sql`
        UPDATE stylists
           SET ${sql(updates.join(', '), ...values)}
         WHERE id = ${+id}
        RETURNING id, name, specialization, photo_url
      `
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
