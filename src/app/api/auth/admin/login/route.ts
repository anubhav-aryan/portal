import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock admin data (in real app, this would come from database)
const admins = [
  {
    id: '1',
    email: 'admin@vitvellore.ac.in',
    password: '$2a$12$LQv3c1yqBwEHXw9M5qzJd.ZQJ8S8Q3QJYF8RX6GqCfZqxQ2xLxbY6', // bcrypt hash of 'admin123'
    name: 'VIT Admin',
    department: 'Academic Affairs',
    role: 'admin'
  },
  {
    id: '2',
    email: 'academic.admin@vitvellore.ac.in',
    password: '$2a$12$LQv3c1yqBwEHXw9M5qzJd.ZQJ8S8Q3QJYF8RX6GqCfZqxQ2xLxbY6', // bcrypt hash of 'admin123'
    name: 'Dr. Priya Sharma',
    department: 'Academic Affairs',
    role: 'department-head'
  },
  {
    id: '3',
    email: 'hostel.admin@vitvellore.ac.in',
    password: '$2a$12$LQv3c1yqBwEHXw9M5qzJd.ZQJ8S8Q3QJYF8RX6GqCfZqxQ2xLxbY6', // bcrypt hash of 'admin123'
    name: 'Mr. Rajesh Kumar',
    department: 'Hostel Management',
    role: 'admin'
  }
]

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find admin by email
    const admin = admins.find(a => a.email === email)
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // For demo purposes, we'll use a simple password check
    // In production, you would use bcrypt.compare(password, admin.password)
    const isValidPassword = password === 'admin123'
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        role: admin.role,
        department: admin.department 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Return success response
    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        department: admin.department,
        role: admin.role
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Admin login endpoint. Use POST to authenticate.' },
    { status: 405 }
  )
}
