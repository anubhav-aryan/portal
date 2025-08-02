'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield, ArrowLeft, Search, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react'

const trackingSchema = z.object({
  trackingId: z.string().min(8, 'Please enter a valid tracking ID'),
})

type TrackingFormData = z.infer<typeof trackingSchema>

interface GrievanceStatus {
  trackingId: string
  problemSubject: string
  description: string
  status: 'pending' | 'in-progress' | 'resolved' | 'closed'
  submittedAt: string
  lastUpdated: string
  assignedTo?: string
  resolution?: string
  updates: Array<{
    date: string
    status: string
    message: string
  }>
}

const statusConfig = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    label: 'Pending Review'
  },
  'in-progress': {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Eye,
    label: 'In Progress'
  },
  resolved: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    label: 'Resolved'
  },
  closed: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: CheckCircle,
    label: 'Closed'
  }
}

export default function TrackGrievancePage() {
  const [isSearching, setIsSearching] = useState(false)
  const [grievanceData, setGrievanceData] = useState<GrievanceStatus | null>(null)
  const [searchError, setSearchError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingFormData>({
    resolver: zodResolver(trackingSchema),
  })

  const onSubmit = async (data: TrackingFormData) => {
    setIsSearching(true)
    setSearchError('')
    setGrievanceData(null)

    try {
      const response = await fetch(`/api/grievances/track/${data.trackingId}`)
      
      if (response.ok) {
        const result = await response.json()
        setGrievanceData(result)
      } else if (response.status === 404) {
        setSearchError('Tracking ID not found. Please check your ID and try again.')
      } else {
        throw new Error('Failed to fetch grievance status')
      }
    } catch (error) {
      setSearchError('Failed to fetch grievance status. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Track Grievance</h1>
                <p className="text-sm text-gray-600">Check your grievance status</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Grievance</h2>
              <p className="text-gray-600">
                Enter your tracking ID to check the current status and updates on your grievance.
              </p>
            </div>

            {searchError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-700">{searchError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking ID *
                </label>
                <input
                  {...register('trackingId')}
                  type="text"
                  placeholder="e.g., VIT-ABC123DEF"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
                />
                {errors.trackingId && (
                  <p className="text-red-600 text-sm mt-1">{errors.trackingId.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Search className="w-5 h-5 mr-2" />
                )}
                {isSearching ? 'Searching...' : 'Track Grievance'}
              </button>
            </form>

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Tracking ID Format</p>
                  <p>
                    Your tracking ID was provided when you submitted your anonymous grievance. 
                    It follows the format: VIT-XXXXXXXXX (e.g., VIT-ABC123DEF)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grievance Details */}
          {grievanceData && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Grievance Details</h3>
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium ${statusConfig[grievanceData.status].color}`}>
                    {statusConfig[grievanceData.status].label}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tracking ID:</span>
                    <span className="ml-2 font-mono font-medium">{grievanceData.trackingId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Submitted:</span>
                    <span className="ml-2">{formatDate(grievanceData.submittedAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2">{grievanceData.problemSubject}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="ml-2">{formatDate(grievanceData.lastUpdated)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{grievanceData.description}</p>
                </div>
              </div>

              {grievanceData.assignedTo && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Assigned To</h4>
                  <p className="text-gray-700">{grievanceData.assignedTo}</p>
                </div>
              )}

              {grievanceData.resolution && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Resolution</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">{grievanceData.resolution}</p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Timeline</h4>
                <div className="space-y-4">
                  {grievanceData.updates.map((update, index) => {
                    const StatusIcon = statusConfig[update.status as keyof typeof statusConfig]?.icon || Clock
                    return (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{update.message}</p>
                            <span className="text-sm text-gray-500">{formatDate(update.date)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
