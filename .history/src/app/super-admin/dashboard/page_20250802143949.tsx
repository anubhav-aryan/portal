'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Crown, 
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
  Calendar,
  Settings,
  UserPlus,
  Mail,
  Shield,
  Building,
  Download,
  Plus,
  Edit3,
  Trash2
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
  department?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface AdminRole {
  id: string
  email: string
  name: string
  department: string
  role: 'admin' | 'department-head' | 'faculty'
  isActive: boolean
  createdAt: string
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

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-800', label: 'Low' },
  medium: { color: 'bg-blue-100 text-blue-800', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
  urgent: { color: 'bg-red-100 text-red-800', label: 'Urgent' }
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

const departments = [
  'Academic Affairs',
  'Student Affairs',
  'Hostel Management',
  'Food Services',
  'Health Center',
  'Campus Security',
  'IT Services',
  'Finance',
  'Sports & Recreation',
  'Clubs & Chapters'
]

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'grievances' | 'users' | 'analytics'>('grievances')
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([])
  const [filteredGrievances, setFilteredGrievances] = useState<Grievance[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')
  
  // Modal states
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    department: '',
    role: 'admin' as 'admin' | 'department-head' | 'faculty'
  })

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
        assignedTo: 'Dr. Priya Sharma',
        department: 'Academic Affairs',
        priority: 'medium'
      },
      {
        id: '2',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@vitstudent.ac.in',
        problemSubject: 'Hostel',
        description: 'Issues with room allocation and maintenance in the hostel.',
        status: 'pending',
        submittedAt: '2025-01-18T14:20:00Z',
        isAnonymous: false,
        department: 'Hostel Management',
        priority: 'high'
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
        assignedTo: 'Food Services Team',
        department: 'Food Services',
        priority: 'urgent'
      },
      {
        id: '4',
        name: 'Priya Reddy',
        email: 'priya.reddy@vitstudent.ac.in',
        problemSubject: 'Health Center',
        description: 'Long waiting times and inadequate medical facilities.',
        status: 'in-progress',
        submittedAt: '2025-01-16T11:45:00Z',
        isAnonymous: false,
        assignedTo: 'Dr. Kumar',
        department: 'Health Center',
        priority: 'high'
      }
    ]

    const mockAdminRoles: AdminRole[] = [
      {
        id: '1',
        email: 'academic.admin@vitvellore.ac.in',
        name: 'Dr. Priya Sharma',
        department: 'Academic Affairs',
        role: 'department-head',
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z'
      },
      {
        id: '2',
        email: 'hostel.admin@vitvellore.ac.in',
        name: 'Mr. Rajesh Kumar',
        department: 'Hostel Management',
        role: 'admin',
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z'
      },
      {
        id: '3',
        email: 'food.admin@vitvellore.ac.in',
        name: 'Ms. Anita Singh',
        department: 'Food Services',
        role: 'admin',
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z'
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setGrievances(mockGrievances)
      setAdminRoles(mockAdminRoles)
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
        (g.name && g.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (g.department && g.department.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(g => g.status === statusFilter)
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(g => g.problemSubject === subjectFilter)
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(g => g.department === departmentFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(g => g.priority === priorityFilter)
    }

    if (dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateRange) {
        case 'today':
          filterDate.setDate(now.getDate())
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
      }
      
      filtered = filtered.filter(g => new Date(g.submittedAt) >= filterDate)
    }

    setFilteredGrievances(filtered)
  }, [searchTerm, statusFilter, subjectFilter, departmentFilter, priorityFilter, dateRange, grievances])

  const getStatusCounts = () => {
    return {
      total: grievances.length,
      pending: grievances.filter(g => g.status === 'pending').length,
      inProgress: grievances.filter(g => g.status === 'in-progress').length,
      resolved: grievances.filter(g => g.status === 'resolved').length,
      urgent: grievances.filter(g => g.priority === 'urgent').length,
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
    localStorage.removeItem('superAdminToken')
    window.location.href = '/super-admin/login'
  }

  const handleAddUser = () => {
    const newAdminRole: AdminRole = {
      id: Date.now().toString(),
      ...newUser,
      isActive: true,
      createdAt: new Date().toISOString()
    }
    setAdminRoles([...adminRoles, newAdminRole])
    setNewUser({ email: '', name: '', department: '', role: 'admin' })
    setShowAddUser(false)
  }

  const exportData = () => {
    const data = filteredGrievances.map(g => ({
      'Tracking ID': g.trackingId || 'N/A',
      'Subject': g.problemSubject,
      'Status': g.status,
      'Priority': g.priority,
      'Department': g.department || 'Unassigned',
      'Submitted Date': formatDate(g.submittedAt),
      'Student Name': g.isAnonymous ? 'Anonymous' : g.name,
      'Description': g.description
    }))
    
    console.log('Exporting data:', data)
    // In a real app, this would generate and download a CSV/Excel file
    alert('Export functionality would be implemented here')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading super admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-white/20 text-white p-2 rounded-lg mr-3">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Super Admin Dashboard</h1>
                <p className="text-purple-100">VIT Vellore Grievances Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportData}
                className="flex items-center text-white hover:text-purple-200 px-3 py-2 rounded-md transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-red-200 px-3 py-2 rounded-md transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('grievances')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'grievances'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Grievances Management
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                User Management
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-5 h-5 inline mr-2" />
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'grievances' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
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

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 text-red-600 p-3 rounded-full">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Urgent</p>
                    <p className="text-2xl font-bold text-gray-900">{statusCounts.urgent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Subjects</option>
                    {problemSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grievances List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Grievances ({filteredGrievances.length})
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
                            <div className="flex items-center mb-2 flex-wrap gap-2">
                              <h3 className="text-lg font-medium text-gray-900">
                                {grievance.problemSubject}
                              </h3>
                              <div className={`px-2 py-1 rounded-full border text-xs font-medium ${statusConfig[grievance.status].color}`}>
                                {statusConfig[grievance.status].label}
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[grievance.priority].color}`}>
                                {priorityConfig[grievance.priority].label}
                              </div>
                              {grievance.isAnonymous && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  Anonymous
                                </span>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-2 line-clamp-2">
                              {grievance.description}
                            </p>
                            
                            <div className="flex items-center text-sm text-gray-500 space-x-4 flex-wrap">
                              <span>Submitted: {formatDate(grievance.submittedAt)}</span>
                              {grievance.name && !grievance.isAnonymous && (
                                <span>By: {grievance.name}</span>
                              )}
                              {grievance.trackingId && (
                                <span>ID: {grievance.trackingId}</span>
                              )}
                              {grievance.department && (
                                <span>Dept: {grievance.department}</span>
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
          </>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            {/* Add User Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Admin
              </button>
            </div>

            {/* Admin Roles List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Admin Users ({adminRoles.length})</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {adminRoles.map((admin) => (
                  <div key={admin.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-purple-100 text-purple-600 p-3 rounded-full mr-4">
                          <Shield className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{admin.name}</h4>
                          <p className="text-gray-600">{admin.email}</p>
                          <div className="flex items-center mt-1 space-x-3">
                            <span className="text-sm text-gray-500">{admin.department}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              admin.role === 'department-head' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {admin.role.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              admin.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {admin.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-blue-600">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grievance Trends</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Performance metrics would go here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Admin</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'department-head' | 'faculty'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="department-head">Department Head</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add User
                </button>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grievance Detail Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-96 overflow-y-auto">
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <p className="text-gray-900">{selectedGrievance.problemSubject}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <span className={`inline-flex px-2 py-1 rounded-full text-sm ${priorityConfig[selectedGrievance.priority].color}`}>
                      {priorityConfig[selectedGrievance.priority].label}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedGrievance.description}</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedGrievance.status}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      value={selectedGrievance.department || ''}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-gray-900 mt-1">{formatDate(selectedGrievance.submittedAt)}</p>
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
                <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Update Grievance
                </button>
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
