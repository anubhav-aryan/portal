'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  LogOut, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle, 
  Eye, 
  AlertCircle,
  Users,
  FileText,
  TrendingUp,
  Calendar
} from 'lucide-react'

interface Grievance {
  id: string
  trackingId?: string
  name?: string
  email?: string
  problemSubject: string
  description: string
  status: 'pending' | 'in-progress' | 'resolved' | 'closed'
  submittedAt: string
  isAnonymous: boolean
  assignedTo?: string
}

const statusConfig = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    label: 'Pending'
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

export default function AdminDashboard() {
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [filteredGrievances, setFilteredGrievances] = useState<Grievance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null)

  useEffect(() => {
    // Mock data for demonstration
    const mockGrievances: Grievance[] = [
      {
        id: '1',
        trackingId: 'VIT-ABC123DEF',
        name: 'Anonymous',
        problemSubject: 'Academic Counselling',
        description: 'I am facing issues with course registration and need guidance from my academic counselor.',
        status: 'in-progress',
        submittedAt: '2025-01-15T10:30:00Z',
        isAnonymous: true,
        assignedTo: 'Academic Affairs Department'
      },
      {
        id: '2',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@vitstudent.ac.in',
        problemSubject: 'Hostel',
        description: 'Issues with room allocation and maintenance in the hostel.',
        status: 'pending',
        submittedAt: '2025-01-18T14:20:00Z',
        isAnonymous: false
      },
      {
        id: '3',
        trackingId: 'VIT-XYZ789GHI',
        name: 'Anonymous',
        problemSubject: 'Canteen / Eating Places',
        description: 'Food quality and hygiene concerns in the main canteen.',
        status: 'resolved',
        submittedAt: '2025-01-10T09:15:00Z',
        isAnonymous: true,
        assignedTo: 'Food Services Department'
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setGrievances(mockGrievances)
      setFilteredGrievances(mockGrievances)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = grievances

    if (searchTerm) {
      filtered = filtered.filter(g => 
        g.problemSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.name && g.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(g => g.status === statusFilter)
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(g => g.problemSubject === subjectFilter)
    }

    setFilteredGrievances(filtered)
  }, [searchTerm, statusFilter, subjectFilter, grievances])

  const getStatusCounts = () => {
    return {
      total: grievances.length,
      pending: grievances.filter(g => g.status === 'pending').length,
      inProgress: grievances.filter(g => g.status === 'in-progress').length,
      resolved: grievances.filter(g => g.status === 'resolved').length,
    }
  }

  const statusCounts = getStatusCounts()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-indigo-600 text-white p-2 rounded-lg mr-3">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">VIT Vellore Grievances Portal</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 px-3 py-2 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <FileText className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Grievances</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                <Clock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Grievances</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search grievances..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Subjects</option>
                {problemSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grievances List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Grievances ({filteredGrievances.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredGrievances.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No grievances found matching your filters.
              </div>
            ) : (
              filteredGrievances.map((grievance) => {
                const StatusIcon = statusConfig[grievance.status].icon
                return (
                  <div
                    key={grievance.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedGrievance(grievance)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">
                            {grievance.problemSubject}
                          </h3>
                          <div className={`px-2 py-1 rounded-full border text-xs font-medium ${statusConfig[grievance.status].color}`}>
                            {statusConfig[grievance.status].label}
                          </div>
                          {grievance.isAnonymous && (
                            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              Anonymous
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-2 line-clamp-2">
                          {grievance.description}
                        </p>
                        
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>Submitted: {formatDate(grievance.submittedAt)}</span>
                          {grievance.name && !grievance.isAnonymous && (
                            <span>By: {grievance.name}</span>
                          )}
                          {grievance.trackingId && (
                            <span>ID: {grievance.trackingId}</span>
                          )}
                          {grievance.assignedTo && (
                            <span>Assigned: {grievance.assignedTo}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <StatusIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Grievance Detail Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Grievance Details</h2>
                <button
                  onClick={() => setSelectedGrievance(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="text-gray-900">{selectedGrievance.problemSubject}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedGrievance.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 rounded-full border text-sm ${statusConfig[selectedGrievance.status].color}`}>
                      {statusConfig[selectedGrievance.status].label}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-gray-900">{formatDate(selectedGrievance.submittedAt)}</p>
                  </div>
                </div>
                
                {!selectedGrievance.isAnonymous && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Student Name</label>
                      <p className="text-gray-900">{selectedGrievance.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedGrievance.email}</p>
                    </div>
                  </div>
                )}
                
                {selectedGrievance.trackingId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tracking ID</label>
                    <p className="text-gray-900 font-mono">{selectedGrievance.trackingId}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Update Status
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Assign to Department
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
