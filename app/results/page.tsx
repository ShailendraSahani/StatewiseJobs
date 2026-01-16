import Header from '../../components/Header';
import { Suspense } from 'react';
export const dynamic = "force-dynamic";

interface Result {
  _id: string;
  title: string;
  state: string;
  resultDate: string;
  downloadLink: string;
}

async function getResults() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/results?limit=20`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.success ? data.data.results : [];
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
}

export default async function ResultsPage() {
  const results = await getResults();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Results</h1>
          <p className="text-gray-600">Check results for various government exams</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result: Result) => (
            <div key={result._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.title}</h3>
              <p className="text-gray-600 mb-2">State: {result.state}</p>
              <p className="text-gray-600 mb-4">Result Date: {result.resultDate}</p>
              <a
                href={result.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                View Result
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
