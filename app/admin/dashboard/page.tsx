'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  Users,
  FileText,
  ChevronRight,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Job {
  _id: string;
  title: string;
  department: string;
  state: string;
  category: string;
  vacancy: number;
  lastDate: string;
  salary: string;
  qualification: string;
  isActive: boolean;
  createdAt: string;
}

interface ExamCalendarItem {
  _id: string;
  title: string;
  examName: string;
  examDate: string;
  applicationStartDate: string;
  applicationEndDate: string;
  resultDate?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  description?: string;
  organization: string;
  category: string;
  state?: string;
  notificationLink?: string;
  applicationLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsData {
  stateCounts: { state: string; count: number }[];
  jobsOverTime: { date: string; count: number }[];
  examStatusCounts: { status: string; count: number }[];
  totals: { jobs: number; exams: number };
}

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [exams, setExams] = useState<ExamCalendarItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      // Fetch jobs
      const jobsResponse = await fetch('/api/admin/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const jobsData = await jobsResponse.json();
      if (jobsData.success) {
        setJobs(jobsData.data.slice(0, 5)); // Get recent 5 jobs
      }

      // Fetch exams
      const examsResponse = await fetch('/api/exam-calendar');
      const examsData = await examsResponse.json();
      if (examsData.success) {
        setExams(examsData.data.exams.slice(0, 5)); // Get recent 5 exams
      }

      // Fetch analytics
      const analyticsResponse = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const analyticsData = await analyticsResponse.json();
      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Job Management Card */}
          <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Management</h3>
            <p className="text-gray-600 text-sm mb-4">Manage job postings, add new jobs, edit existing ones.</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{jobs.length}+</div>
                <p className="text-xs text-gray-500">Active Jobs</p>
              </div>
              <button
                onClick={() => router.push('/admin/jobs')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <span className="text-sm">Manage</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Exam Calendar Card */}
          <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <Clock className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Exam Calendar</h3>
            <p className="text-gray-600 text-sm mb-4">Manage exam schedules and notifications.</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{exams.length}+</div>
                <p className="text-xs text-gray-500">Scheduled Exams</p>
              </div>
              <button
                onClick={() => router.push('/admin/exam-calendar')}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <span className="text-sm">Manage</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">View job statistics and user engagement metrics.</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">--</div>
                <p className="text-xs text-gray-500">Total Views</p>
              </div>
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl cursor-not-allowed opacity-60"
                disabled
              >
                <span className="text-sm">Coming Soon</span>
                <AlertCircle className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Footer Management Card */}
          <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <FileText className="h-5 w-5 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Footer Management</h3>
            <p className="text-gray-600 text-sm mb-4">Manage website footer content, links, and social media.</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-indigo-600">1</div>
                <p className="text-xs text-gray-500">Active Footer</p>
              </div>
              <button
                onClick={() => router.push('/admin/footer')}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <span className="text-sm">Manage</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Jobs</h2>
              </div>
              <button
                onClick={() => router.push('/admin/jobs')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job._id} className="group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{job.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{job.department} • {job.state}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.vacancy} vacancies
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(job.lastDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No jobs found.</p>
              </div>
            )}
          </div>

          {/* Recent Exams */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Exams</h2>
              </div>
              <button
                onClick={() => router.push('/admin/exam-calendar')}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {exams.length > 0 ? (
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div key={exam._id} className="group p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{exam.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{exam.organization} • {exam.category}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(exam.examDate).toLocaleDateString()}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            exam.status === 'upcoming'
                              ? 'bg-blue-100 text-blue-800'
                              : exam.status === 'ongoing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {exam.status === 'upcoming' && <Clock className="h-3 w-3 mr-1" />}
                            {exam.status === 'ongoing' && <Activity className="h-3 w-3 mr-1" />}
                            {exam.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {exam.status}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className={`w-2 h-2 rounded-full ${
                          exam.status === 'upcoming' ? 'bg-blue-500' :
                          exam.status === 'ongoing' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No exams found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
