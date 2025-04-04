import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

// Function to create the clients table
async function createClientsTable() {
  const createTable = await sql`
    CREATE TABLE IF NOT EXISTS clients (
      client_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(15) UNIQUE NOT NULL
    );
  `
  console.log('Created "clients" table')
  return createTable;
}

// Function to add a new client
async function addClient(name: string, email: string, phone: string) {
  const client = await sql`
    INSERT INTO clients (name, email, phone)
    VALUES (${name}, ${email}, ${phone})
    ON CONFLICT (email) DO NOTHING;  -- Prevent inserting duplicate emails
  `
  return client;
}

export default defineEventHandler(async (event) => {

  try {
    // Get client data from the request body
    const { name, email, phone } = await readBody(event)

    // Check if the required fields are present
    if (!name || !email || !phone) {
      return {
        statusCode: 400,
        message: 'Name, email, and phone are required fields.',
      }
    }

    // Create the clients table if it doesn't exist
    await createClientsTable()

    // Add the client to the database
    const result = await addClient(name, email, phone)

  
    return {
      message: 'Client added successfully',
      result,
    }
  } catch (error) {
    console.error('Error while adding client:', error)
    return {
      statusCode: 500,
      message: 'An error occurred while adding the client.',
    }
  }
})
