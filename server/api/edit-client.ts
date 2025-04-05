import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

// Function to update a client by client_id
async function updateClient(clientId: number, clientData: { name?: string, email?: string, phone?: string }) {
  const result = await sql`
    UPDATE clients
    SET 
      name = COALESCE(${clientData.name}, name),
      email = COALESCE(${clientData.email}, email),
      phone = COALESCE(${clientData.phone}, phone)
    WHERE client_id = ${clientId}
    RETURNING client_id, name, email, phone;
  `
  return result;
}

export default defineEventHandler(async (event) => {
  try {
    // Get the clientId and client data from the request body
    const { clientId, clientData } = await readBody(event);

    if (!clientId || !clientData) {
      return {
        statusCode: 400,
        message: 'Client ID and client data are required',
      }
    }

    // Update the client in the database
    const result = await updateClient(clientId, clientData);
    console.log("Result: ", result);

    // Check if the client was updated
    if (result.length > 0) {
      return {
        message: 'Client updated successfully',
        client: result[0],
      }
    } else {
      return {
        statusCode: 404,
        message: 'Client not found',
      }
    }
  } catch (error) {
    console.error('Error while updating client:', error);
    return {
      statusCode: 500,
      message: 'An error occurred while updating the client.',
    }
  }
})
