import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

function isEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Kenia Navarro API' }))
    }
    if (route === '/root' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Kenia Navarro API' }))
    }

    // Contact form
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      const name = (body.name || '').toString().trim()
      const email = (body.email || '').toString().trim()
      const message = (body.message || '').toString().trim()
      if (!name || !isEmail(email) || !message) {
        return handleCORS(NextResponse.json(
          { error: 'name, valid email and message are required' },
          { status: 400 }
        ))
      }
      const doc = {
        id: uuidv4(),
        name,
        email,
        message,
        locale: (body.locale || 'en').toString(),
        createdAt: new Date().toISOString(),
      }
      await db.collection('contact_messages').insertOne(doc)
      const { _id, ...clean } = doc
      return handleCORS(NextResponse.json({ success: true, message: clean }))
    }

    if (route === '/contact' && method === 'GET') {
      const items = await db.collection('contact_messages').find({}).sort({ createdAt: -1 }).limit(500).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }

    // Newsletter
    if (route === '/newsletter' && method === 'POST') {
      const body = await request.json()
      const email = (body.email || '').toString().trim().toLowerCase()
      if (!isEmail(email)) {
        return handleCORS(NextResponse.json({ error: 'valid email is required' }, { status: 400 }))
      }
      const existing = await db.collection('newsletter').findOne({ email })
      if (existing) {
        return handleCORS(NextResponse.json({ success: true, alreadySubscribed: true }))
      }
      const doc = {
        id: uuidv4(),
        email,
        locale: (body.locale || 'en').toString(),
        createdAt: new Date().toISOString(),
      }
      await db.collection('newsletter').insertOne(doc)
      return handleCORS(NextResponse.json({ success: true, alreadySubscribed: false }))
    }

    if (route === '/newsletter' && method === 'GET') {
      const items = await db.collection('newsletter').find({}).sort({ createdAt: -1 }).limit(1000).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
