import Header from '../../../components/Header';
import { notFound } from 'next/navigation';

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
  description?: string;
  applicationLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function calculateDaysLeft(lastDate: string): number {
  const last = new Date(lastDate);
  const now = new Date();
  return Math.ceil((last.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

async function getJob(id: string): Promise<Job | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/jobs/${id}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching job:', error);
  }
  return null;
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  const daysLeft = calculateDaysLeft(job.lastDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20">
                {job.category}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20">
                {job.state}
              </span>
              {daysLeft <= 7 && daysLeft >= 0 && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-500/80 animate-pulse">
                  Closing in {daysLeft} days
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <p className="text-indigo-100 text-lg">{job.department}</p>
          </div>

          {/* Content Section */}
          <div className="px-8 py-6">
            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Vacancy</span>
                  <span className="font-semibold text-gray-900">
                    {job.vacancy?.toLocaleString() || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Last Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(job.lastDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Salary</span>
                  <span className="font-semibold text-gray-900">{job.salary}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">State</span>
                  <span className="font-semibold text-gray-900">{job.state}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Category</span>
                  <span className="font-semibold text-gray-900">{job.category}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Department</span>
                  <span className="font-semibold text-gray-900">{job.department}</span>
                </div>
              </div>
            </div>

            {/* Qualification */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Qualification Required</h3>
              <p className="text-gray-700 bg-gray-50 rounded-lg px-4 py-3">{job.qualification}</p>
            </div>

            {/* Description */}
            {job.description && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h3>
                <div className="text-gray-700 bg-gray-50 rounded-lg px-4 py-3 whitespace-pre-line">
                  {job.description}
                </div>
              </div>
            )}

            {/* Apply Button */}
            {job.applicationLink && (
              <div className="flex justify-center">
                <a
                  href={job.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition duration-200 shadow-lg hover:shadow-xl"
                >
                  Apply Now →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
