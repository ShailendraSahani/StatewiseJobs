import Header from '../../components/Header';
import { Suspense } from 'react';
export const dynamic = "force-dynamic";

interface AnswerKey {
  _id: string;
  title: string;
  state: string;
  examDate: string;
  downloadLink: string;
}

async function getAnswerKeys() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/answer-keys?limit=20`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.success ? data.data.answerKeys : [];
  } catch (error) {
    console.error('Error fetching answer keys:', error);
    return [];
  }
}

export default async function AnswerKeysPage() {
  const answerKeys = await getAnswerKeys();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Answer Keys</h1>
          <p className="text-gray-600">Download answer keys for various government exams</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {answerKeys.map((key: AnswerKey) => (
            <div key={key._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{key.title}</h3>
              <p className="text-gray-600 mb-2">State: {key.state}</p>
              <p className="text-gray-600 mb-4">Exam Date: {key.examDate}</p>
              <a
                href={key.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Download Answer Key
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
