'use client';

import Header from '../../components/Header';
import StateCard from '../../components/StateCard';
import { useState, useEffect } from 'react';

const states = [
  { name: 'Uttar Pradesh', slug: 'uttar-pradesh', jobCount: 0 },
  { name: 'Bihar', slug: 'bihar', jobCount: 0 },
  { name: 'Maharashtra', slug: 'maharashtra', jobCount: 0 },
  { name: 'West Bengal', slug: 'west-bengal', jobCount: 0 },
  { name: 'Madhya Pradesh', slug: 'madhya-pradesh', jobCount: 0 },
  { name: 'Tamil Nadu', slug: 'tamil-nadu', jobCount: 0 },
  { name: 'Rajasthan', slug: 'rajasthan', jobCount: 0 },
  { name: 'Karnataka', slug: 'karnataka', jobCount: 0 },
  { name: 'Gujarat', slug: 'gujarat', jobCount: 0 },
  { name: 'Andhra Pradesh', slug: 'andhra-pradesh', jobCount: 0 },
  { name: 'Odisha', slug: 'odisha', jobCount: 0 },
  { name: 'Telangana', slug: 'telangana', jobCount: 0 },
  { name: 'Kerala', slug: 'kerala', jobCount: 0 },
  { name: 'Jharkhand', slug: 'jharkhand', jobCount: 0 },
  { name: 'Assam', slug: 'assam', jobCount: 0 },
  { name: 'Punjab', slug: 'punjab', jobCount: 0 },
  { name: 'Chhattisgarh', slug: 'chhattisgarh', jobCount: 0 },
  { name: 'Haryana', slug: 'haryana', jobCount: 0 },
  { name: 'Delhi', slug: 'delhi', jobCount: 0 },
  { name: 'Jammu and Kashmir', slug: 'jammu-and-kashmir', jobCount: 0 },
];

async function getStateJobCounts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/jobs/state-counts`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success) {
      return states.map(state => ({
        ...state,
        jobCount: data.data[state.name] || 0
      }));
    }
  } catch (error) {
    console.error('Error fetching state job counts:', error);
  }
  return states;
}

export default function StatesPage() {
  const [dynamicStates, setDynamicStates] = useState(states);

  useEffect(() => {
    const fetchJobCounts = async () => {
      const updatedStates = await getStateJobCounts();
      setDynamicStates(updatedStates);
    };

    fetchJobCounts();

    const interval = setInterval(fetchJobCounts, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Jobs by State</h1>
          <p className="text-gray-600">Find government jobs in your preferred state</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dynamicStates.map((state) => (
            <StateCard key={state.slug} state={state} />
          ))}
        </div>
      </main>
    </div>
  );
}
