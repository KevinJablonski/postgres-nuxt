import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

// Function to delete a client by client_id
async function deleteClient(clientId: number) {
  const result = await sql`
    DELETE FROM clients
    WHERE client_id = ${clientId}
    RETURNING client_id;
  `
  return result;
}

export default defineEventHandler(async (event) => {
  try {
    // Get the client_id from the request params (or body if using POST)
    const {clientId} = await readBody(event);

    if (!clientId) {
      return {
        statusCode: 400,
        message: 'Client ID is required',
      }
    }

    // Delete the client from the database
    const result = await deleteClient(clientId)
    console.log("Result: ",result)
    // Check if a client was deleted
    if (result.length > 0) {
      return {
        message: 'Client deleted successfully',
        clientId: result[0].client_id,
      }
    } else {
      return {
        statusCode: 404,
        message: 'Client not found',
      }
    }
  } catch (error) {
    console.error('Error while deleting client:', error)
    return {
      statusCode: 500,
      message: 'An error occurred while deleting the client.',
    }
  }
})
