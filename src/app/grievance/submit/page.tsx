'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, ArrowLeft, Send, AlertCircle, CheckCircle } from 'lucide-react'

const grievanceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  registrationNumber: z.string().min(6, 'Please enter a valid registration number'),
  email: z.string().email('Please enter a valid email address'),
  yearOfGraduation: z.string().min(4, 'Please select year of graduation'),
  problemSubject: z.string().min(1, 'Please select a problem subject'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

type GrievanceFormData = z.infer<typeof grievanceSchema>

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

export default function SubmitGrievancePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GrievanceFormData>({
    resolver: zodResolver(grievanceSchema),
  })

  const onSubmit = async (data: GrievanceFormData) => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          isAnonymous: false,
          submittedAt: new Date().toISOString(),
          status: 'pending',
        }),
      })

      if (response.ok) {
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
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Grievance Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your grievance has been received and will be reviewed by the appropriate authorities. 
            You will receive updates via email.
          </p>
          <div className="space-y-3">
            <Link
              href="/grievance/submit"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              onClick={() => setSubmitSuccess(false)}
            >
              Submit Another Grievance
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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
                <h1 className="text-xl font-bold text-gray-900">Submit Grievance</h1>
                <p className="text-sm text-gray-600">With Your Details</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Your Grievance</h2>
              <p className="text-gray-600">
                Please provide your details and describe your concern. This information will help us 
                address your grievance more effectively and keep you updated on the progress.
              </p>
            </div>

            {submitError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-700">{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number *
                  </label>
                  <input
                    {...register('registrationNumber')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., 21BCE1234"
                  />
                  {errors.registrationNumber && (
                    <p className="text-red-600 text-sm mt-1">{errors.registrationNumber.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your.email@vitstudent.ac.in"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

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
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Please provide a detailed description of your grievance. Include relevant dates, names, and any supporting information."
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Privacy & Security</p>
                    <p>
                      Your personal information will be kept confidential and used only for processing 
                      your grievance. Only authorized personnel will have access to your details.
                    </p>
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
                  {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
                </button>
                <Link
                  href="/grievance/anonymous"
                  className="flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Submit Anonymously
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
