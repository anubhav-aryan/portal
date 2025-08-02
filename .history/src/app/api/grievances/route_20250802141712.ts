import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

// This will be replaced with proper environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DATABASE_NAME = 'vit_grievances_portal'

declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGODB_URI)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

async function connectToDatabase() {
  const client = await clientPromise
  return client.db(DATABASE_NAME)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await connectToDatabase()
    
    const grievance = {
      ...body,
      _id: new ObjectId(),
      submittedAt: new Date(),
      lastUpdated: new Date(),
      status: 'pending',
      updates: [
        {
          date: new Date().toISOString(),
          status: 'pending',
          message: 'Grievance submitted and awaiting review'
        }
      ]
    }

    const result = await db.collection('grievances').insertOne(grievance)
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      trackingId: body.trackingId 
    })
  } catch (error) {
    console.error('Error submitting grievance:', error)
    return NextResponse.json(
      { error: 'Failed to submit grievance' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const subject = searchParams.get('subject')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const db = await connectToDatabase()
    
    const filter: any = {}
    if (status) filter.status = status
    if (subject) filter.problemSubject = subject

    const grievances = await db.collection('grievances')
      .find(filter)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection('grievances').countDocuments(filter)

    return NextResponse.json({
      grievances,
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching grievances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch grievances' },
      { status: 500 }
    )
  }
}
