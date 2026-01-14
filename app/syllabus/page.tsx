import Header from '../../components/Header';
import { Suspense } from 'react';

interface Syllabus {
  _id: string;
  title: string;
  state: string;
  downloadLink: string;
}

async function getSyllabi() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/syllabus?limit=20`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.success ? data.data.syllabi : [];
  } catch (error) {
    console.error('Error fetching syllabi:', error);
    return [];
  }
}

export default async function SyllabusPage() {
  const syllabi = await getSyllabi();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Syllabus</h1>
          <p className="text-gray-600">Download syllabus for various government exams</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {syllabi.map((syllabus: Syllabus) => (
            <div key={syllabus._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{syllabus.title}</h3>
              <p className="text-gray-600 mb-4">State: {syllabus.state}</p>
              <a
                href={syllabus.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Download Syllabus
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
