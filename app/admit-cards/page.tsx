import Header from '../../components/Header';
import { Suspense } from 'react';
export const dynamic = "force-dynamic";

interface AdmitCard {
  _id: string;
  title: string;
  state: string;
  examDate: string;
  downloadLink: string;
}

async function getAdmitCards() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admit-cards?limit=20`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.success ? data.data.admitCards : [];
  } catch (error) {
    console.error('Error fetching admit cards:', error);
    return [];
  }
}

export default async function AdmitCardsPage() {
  const admitCards = await getAdmitCards();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admit Cards</h1>
          <p className="text-gray-600">Download admit cards for various government exams</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admitCards.map((card: AdmitCard) => (
            <div key={card._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-2">State: {card.state}</p>
              <p className="text-gray-600 mb-4">Exam Date: {card.examDate}</p>
              <a
                href={card.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Download Admit Card
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
