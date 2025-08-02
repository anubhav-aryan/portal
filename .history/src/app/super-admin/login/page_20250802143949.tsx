'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogIn, AlertCircle, Eye, EyeOff, Crown } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function SuperAdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

    const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setLoginError('')

    try {
      const response = await fetch('/api/auth/super-admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Store token in localStorage
        localStorage.setItem('superAdminToken', result.token)
        
        // Redirect to super admin dashboard
        window.location.href = '/super-admin/dashboard'
      } else {
        setLoginError(result.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full w-fit mx-auto mb-4">
            <Crown className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin</h1>
          <p className="text-gray-600">
            Highest level access to manage the entire grievance system
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-100">
          {loginError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-700">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Super Admin Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="superadmin@vitvellore.ac.in"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors pr-12"
                  placeholder="Enter your secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Authenticating...' : 'Access System'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">Demo Credentials:</h3>
            <div className="text-sm text-purple-700 space-y-1">
              <p><strong>Email:</strong> superadmin@vitvellore.ac.in</p>
              <p><strong>Password:</strong> superadmin123</p>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              href="/admin/login"
              className="block text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Regular Admin Login
            </Link>
          </div>
        </div>

        {/* Security Warning */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">High Security Zone</p>
              <p>
                Super Admin access grants full control over the grievance system. 
                All actions are logged and monitored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
