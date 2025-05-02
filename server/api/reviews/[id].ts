import { defineEventHandler, readBody, createError } from 'h3'
import postgres from 'postgres'
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export default defineEventHandler(async (event) => {
  const id      = +(event.context.params?.id || 0)
  const method  = event.node.req.method
  if (!id) throw createError({ statusCode:400, statusMessage:'Missing review id' })

  if (method === 'PUT') {
    const { rating, comment } =
      await readBody<{ rating?: number; comment?: string }>(event)
    await sql`
      UPDATE reviews
         SET rating = COALESCE(${rating}, rating),
             comment = COALESCE(${comment}, comment)
       WHERE id = ${id}
    `
    const [r] = await sql`SELECT * FROM reviews WHERE id = ${id}`
    return r
  }

  if (method === 'DELETE') {
    await sql`DELETE FROM reviews WHERE id = ${id}`
    return { success: true }
  }

  throw createError({ statusCode:405, statusMessage:'Method Not Allowed' })
})
