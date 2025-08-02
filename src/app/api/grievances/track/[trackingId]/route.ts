import { NextRequest, NextResponse } from 'next/server'

async function connectToDatabase() {
  // Mock database connection - will be replaced with actual MongoDB
  return {
    collection: (name: string) => ({
      findOne: async (filter: any) => {
        // Mock data for demonstration
        if (filter.trackingId === 'VIT-ABC123DEF') {
          return {
            trackingId: 'VIT-ABC123DEF',
            problemSubject: 'Academic Counselling',
            description: 'I am facing issues with course registration and need guidance from my academic counselor. The system shows errors when I try to register for certain courses.',
            status: 'in-progress',
            submittedAt: '2025-01-15T10:30:00Z',
            lastUpdated: '2025-01-20T14:45:00Z',
            assignedTo: 'Academic Affairs Department',
            updates: [
              {
                date: '2025-01-15T10:30:00Z',
                status: 'pending',
                message: 'Grievance submitted and awaiting review'
              },
              {
                date: '2025-01-18T09:15:00Z',
                status: 'in-progress',
                message: 'Assigned to Academic Affairs Department for investigation'
              },
              {
                date: '2025-01-20T14:45:00Z',
                status: 'in-progress',
                message: 'Issue identified with course registration system. Working on resolution.'
              }
            ]
          }
        }
        return null
      }
    })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { trackingId } = await params
    
    if (!trackingId) {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const grievance = await db.collection('grievances').findOne({ trackingId })

    if (!grievance) {
      return NextResponse.json(
        { error: 'Grievance not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(grievance)
  } catch (error) {
    console.error('Error fetching grievance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch grievance' },
      { status: 500 }
    )
  }
}
