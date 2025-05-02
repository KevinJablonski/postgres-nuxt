// server/api/availability/[id].ts
import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slot id' })
  }

  const method = event.node.req.method

  // EDIT a slot
  if (method === 'PUT') {
    const body = await readBody<{
      stylist_id?: number
      available_date?: string
      available_time?: string
    }>(event)

    // require at least one field
    if (
      body.stylist_id     === undefined &&
      body.available_date  === undefined &&
      body.available_time  === undefined
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Provide at least one of stylist_id, available_date or available_time'
      })
    }

    try {
      const [updated] = await sql`
        UPDATE availability a
           SET
             stylist_id     = COALESCE(${body.stylist_id}, a.stylist_id),
             available_date = COALESCE(${body.available_date}, a.available_date),
             available_time = COALESCE(${body.available_time}, a.available_time)
         WHERE a.id = ${+id}
        RETURNING
          a.id,
          a.stylist_id,
          (SELECT name FROM stylists WHERE id = a.stylist_id) AS stylist_name,
          a.available_date,
          a.available_time
      `
      if (!updated) {
        throw createError({ statusCode: 404, statusMessage: 'Slot not found' })
      }
      return updated
    } catch (err: any) {
      console.error(`PUT /api/availability/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to update slot' })
    }
  }

  // DELETE a slot
  if (method === 'DELETE') {
    try {
      await sql`DELETE FROM availability WHERE id = ${+id}`
      return { success: true }
    } catch (err: any) {
      console.error(`DELETE /api/availability/${id} error:`, err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete slot' })
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
