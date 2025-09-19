export async function GET() {
  try {
    console.log('=== TESTE SIMPLES ===')
    
    return Response.json({
      status: 'SUCCESS',
      message: 'API funcionando',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro no teste simples:', error)
    return Response.json({
      error: error.message
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    console.log('=== TESTE POST SIMPLES ===')
    
    const body = await request.json()
    console.log('Body recebido:', body)
    
    return Response.json({
      status: 'SUCCESS',
      message: 'POST funcionando',
      received: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro no POST simples:', error)
    return Response.json({
      error: error.message
    }, { status: 500 })
  }
}
