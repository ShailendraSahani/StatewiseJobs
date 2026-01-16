import Header from '../../../components/Header';
import JobCard from '../../../components/JobCard';
import { Suspense } from 'react';
export const dynamic = "force-dynamic";

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

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function getJobsByState(slug: string) {
  try {
    const state = slugToTitle(slug);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/jobs?state=${encodeURIComponent(state)}&limit=100`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success) {
      return data.data.jobs;
    }
  } catch (error) {
    console.error('Error fetching jobs by state:', error);
  }
  return [];
}

export default async function StateJobsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const jobs = await getJobsByState(slug);
  const stateName = slugToTitle(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Government Jobs in {stateName}
          </h1>
          <p className="text-gray-600">
            {jobs.length} jobs available in {stateName}
          </p>
        </div>
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: Job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs available in {stateName} at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}
