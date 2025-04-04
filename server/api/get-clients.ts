import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

// Function to retrieve all clients from the database
async function getAllClients() {
  const clients = await sql`
    SELECT * FROM clients;
  `
  return clients;
}

export default defineEventHandler(async () => {
  try {
    // Get all clients from the database
    const clients = await getAllClients()

    return {
      clients,
    }
  } catch (error) {
    console.error('Error while retrieving clients:', error)
    return {
      statusCode: 500,
      message: 'An error occurred while retrieving clients.',
    }
  }
})
