import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock super admin data (in real app, this would come from database)
const superAdmins = [
  {
    id: 'super-1',
    email: 'superadmin@vitvellore.ac.in',
    password: '$2a$12$LQv3c1yqBwEHXw9M5qzJd.ZQJ8S8Q3QJYF8RX6GqCfZqxQ2xLxbY6', // bcrypt hash of 'superadmin123'
    name: 'Super Administrator',
    role: 'super-admin',
    lastLogin: null,
    isActive: true
  },
  {
    id: 'super-2',
    email: 'chancellor@vitvellore.ac.in',
    password: '$2a$12$LQv3c1yqBwEHXw9M5qzJd.ZQJ8S8Q3QJYF8RX6GqCfZqxQ2xLxbY6', // bcrypt hash of 'superadmin123'
    name: 'Dr. Chancellor',
    role: 'super-admin',
    lastLogin: null,
    isActive: true
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

    // Find super admin by email
    const superAdmin = superAdmins.find(sa => sa.email === email)
    
    if (!superAdmin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if account is active
    if (!superAdmin.isActive) {
      return NextResponse.json(
        { error: 'Account has been deactivated' },
        { status: 403 }
      )
    }

    // For demo purposes, we'll use a simple password check
    // In production, you would use bcrypt.compare(password, superAdmin.password)
    const isValidPassword = password === 'superadmin123'
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login time (in real app, you'd update this in database)
    superAdmin.lastLogin = new Date().toISOString()

    // Generate JWT token with enhanced claims for super admin
    const token = jwt.sign(
      { 
        id: superAdmin.id, 
        email: superAdmin.email, 
        role: superAdmin.role,
        name: superAdmin.name,
        permissions: [
          'view_all_grievances',
          'manage_users',
          'export_data',
          'system_analytics',
          'assign_roles'
        ]
      },
      JWT_SECRET,
      { expiresIn: '8h' } // Shorter session for super admin
    )

    // Return success response
    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: superAdmin.id,
        email: superAdmin.email,
        name: superAdmin.name,
        role: superAdmin.role,
        lastLogin: superAdmin.lastLogin
      },
      message: 'Super admin authentication successful'
    })

  } catch (error) {
    console.error('Super admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Super admin login endpoint. Use POST to authenticate.' },
    { status: 405 }
  )
}
