'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, ArrowLeft, Send, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

const anonymousGrievanceSchema = z.object({
  yearOfGraduation: z.string().min(4, 'Please select year of graduation'),
  problemSubject: z.string().min(1, 'Please select a problem subject'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

type AnonymousGrievanceFormData = z.infer<typeof anonymousGrievanceSchema>

const problemSubjects = [
  'General Grievance',
  'Proctor Grievance',
  'Academic Counselling',
  'NRI/Foreign Students Issues',
  'Clubs and Chapters',
  'ECA Course',
  'Student Achievements',
  'Day Scholars',
  'Day Boarders',
  'Other',
  'Disciplinary Issues',
  'Hostel',
  'Canteen / Eating Places',
  'Health Center',
  'Campus Shops',
]

const graduationYears = [
  '2024', '2025', '2026', '2027', '2028', '2029', '2030'
]

export default function AnonymousGrievancePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [trackingId, setTrackingId] = useState('')
  const [showTrackingId, setShowTrackingId] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AnonymousGrievanceFormData>({
    resolver: zodResolver(anonymousGrievanceSchema),
  })

  const generateTrackingId = () => {
    return 'VIT-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const onSubmit = async (data: AnonymousGrievanceFormData) => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const generatedTrackingId = generateTrackingId()
      
      const response = await fetch('/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          isAnonymous: true,
          trackingId: generatedTrackingId,
          submittedAt: new Date().toISOString(),
          status: 'pending',
        }),
      })

      if (response.ok) {
        setTrackingId(generatedTrackingId)
        setSubmitSuccess(true)
        reset()
      } else {
        throw new Error('Failed to submit grievance')
      }
    } catch (error) {
      setSubmitError('Failed to submit grievance. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Anonymous Grievance Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your grievance has been received. Use the tracking ID below to check the status.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Important: Save Your Tracking ID</h3>
            <div className="flex items-center justify-between bg-white rounded border p-3">
              <span className="font-mono text-lg text-gray-900">
                {showTrackingId ? trackingId : '••••••••••'}
              </span>
              <button
                onClick={() => setShowTrackingId(!showTrackingId)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showTrackingId ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-yellow-700 text-sm mt-2">
              This is your only way to track your anonymous grievance. Please save it securely.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigator.clipboard.writeText(trackingId)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Copy Tracking ID
            </button>
            <Link
              href="/grievance/track"
              className="block w-full text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Track Grievance Status
            </Link>
            <Link
              href="/"
              className="block w-full text-center text-gray-600 px-6 py-3 rounded-lg font-medium hover:text-gray-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
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
                <h1 className="text-xl font-bold text-gray-900">Anonymous Grievance</h1>
                <p className="text-sm text-gray-600">Complete Privacy & Confidentiality</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Anonymous Grievance</h2>
              <p className="text-gray-600">
                Submit your grievance completely anonymously. You will receive a tracking ID 
                to monitor the progress without revealing your identity.
              </p>
            </div>

            {/* Privacy Assurance */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">100% Anonymous</p>
                  <p>
                    No personal information is collected. Your IP address is not logged, 
                    and the grievance cannot be traced back to you.
                  </p>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-700">{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="yearOfGraduation" className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Graduation *
                </label>
                <select
                  {...register('yearOfGraduation')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select graduation year</option>
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.yearOfGraduation && (
                  <p className="text-red-600 text-sm mt-1">{errors.yearOfGraduation.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="problemSubject" className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Subject *
                </label>
                <select
                  {...register('problemSubject')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select problem category</option>
                  {problemSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                {errors.problemSubject && (
                  <p className="text-red-600 text-sm mt-1">{errors.problemSubject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe Your Issue *
                </label>
                <textarea
                  {...register('description')}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Please provide a detailed description of your grievance. Since this is anonymous, include as much relevant information as possible to help us understand and address the issue effectively."
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Anonymous Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Anonymous Submission Notice</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>You will receive a tracking ID to monitor progress</li>
                      <li>We cannot contact you directly for clarifications</li>
                      <li>Provide detailed information to help us investigate</li>
                      <li>Resolution updates will be available via tracking ID</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? 'Submitting...' : 'Submit Anonymously'}
                </button>
                <Link
                  href="/grievance/submit"
                  className="flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Submit with Details
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
