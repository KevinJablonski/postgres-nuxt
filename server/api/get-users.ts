import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

async function seed() {
  const createTable = await sql`
    CREATE TABLE IF NOT EXISTS stylists (
    stylist_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL
    );
    `

  console.log(`Created "profiles" table`)

  const stylists = await Promise.all([
    sql`
          INSERT INTO stylists (name, specialization, email, phone)
          VALUES ('Guillermo Rauch','color', 'rauchg@vercel.com', '973testnum')
          ON CONFLICT (email) DO NOTHING;
      `
  ])
  console.log(`Seeded ${stylists.length} profiles`)

  return {
    createTable,
    stylists,
  }
}
export default defineEventHandler(async () => {
  const startTime = Date.now()
  try {
    const stylists = await sql`SELECT * FROM stylists`
    const duration = Date.now() - startTime
    return {
      stylists,
      duration: duration,
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error?.message === `relation "stylists" does not exist`
    ) {
      console.log(
        'Table does not exist, creating and seeding it with dummy data now...'
      )
      // Table is not created yet
      await seed()
      const stylists = await sql`SELECT * FROM stylists`
      const duration = Date.now() - startTime
      return {
        stylists,
        duration: duration,
      }
    } else {
      throw error
    }
  }
})
