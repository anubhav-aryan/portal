'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Shield, Users, AlertCircle, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VIT Vellore</h1>
                <p className="text-sm text-gray-600">Student Grievances Portal</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Staff Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Voice
            <span className="text-blue-600"> Matters</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A secure and transparent platform for VIT Vellore students to report grievances 
            and for administration to address them efficiently.
          </p>
          
          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {/* Student Portal */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Submit Grievance</h3>
              <p className="text-gray-600 mb-6">
                Report your concerns anonymously or with your details. Your privacy and security are our priority.
              </p>
              <div className="space-y-3">
                <Link
                  href="/grievance/submit"
                  className="flex items-center justify-center w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit with Details
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/grievance/anonymous"
                  className="flex items-center justify-center w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Submit Anonymously
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>

            {/* Admin Portal */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Administration Panel</h3>
              <p className="text-gray-600 mb-6">
                Access the admin dashboard to manage grievances, track progress, and ensure timely resolution.
              </p>
              <div className="space-y-3">
                <Link
                  href="/admin/login"
                  className="flex items-center justify-center w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Admin Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/super-admin/login"
                  className="flex items-center justify-center w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Super Admin
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Portal?</h2>
            <p className="text-lg text-gray-600">Built with student privacy and administrative efficiency in mind</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Anonymous</h3>
              <p className="text-gray-600">
                Submit grievances anonymously with complete confidentiality and data protection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track the status of your grievances and receive updates on resolution progress.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Efficient Management</h3>
              <p className="text-gray-600">
                Advanced admin tools for categorizing, assigning, and resolving grievances quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold">VIT Vellore Grievances Portal</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 VIT Vellore. All rights reserved. | Empowering student voices through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
