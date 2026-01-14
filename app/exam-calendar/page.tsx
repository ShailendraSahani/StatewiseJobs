import Header from '../../components/Header';
import { Suspense } from 'react';

interface ExamCalendar {
  _id: string;
  title: string;
  examName: string;
  examDate: Date;
  applicationStartDate: Date;
  applicationEndDate: Date;
  resultDate?: Date;
  status: 'upcoming' | 'ongoing' | 'completed';
  description?: string;
  organization: string;
  category: string;
  state?: string;
  notificationLink?: string;
  applicationLink?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

async function getExamCalendar() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/exam-calendar?limit=20`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.success ? data.data.exams : [];
  } catch (error) {
    console.error('Error fetching exam calendar:', error);
    return [];
  }
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'ongoing':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default async function ExamCalendarPage() {
  const exams = await getExamCalendar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Exam Calendar</h1>
          <p className="text-gray-600">Stay updated with upcoming government exam schedules</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam: ExamCalendar) => (
            <div key={exam._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exam.status)}`}>
                  {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Exam:</span> {exam.examName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {formatDate(exam.examDate)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Organization:</span> {exam.organization}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Category:</span> {exam.category}
                </p>
                {exam.state && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">State:</span> {exam.state}
                  </p>
                )}
                {exam.description && (
                  <p className="text-sm text-gray-600 mt-2">{exam.description}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                {exam.notificationLink && (
                  <a
                    href={exam.notificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center text-sm"
                  >
                    View Notification
                  </a>
                )}
                {exam.applicationLink && (
                  <a
                    href={exam.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center text-sm"
                  >
                    Apply Now
                  </a>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Application: {formatDate(exam.applicationStartDate)} - {formatDate(exam.applicationEndDate)}</p>
                  {exam.resultDate && <p>Result: {formatDate(exam.resultDate)}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {exams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No exams found. Please check back later.</p>
          </div>
        )}
      </main>
    </div>
  );
}
