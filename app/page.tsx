
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import StateCard from '../components/StateCard';
import JobCard from '../components/JobCard';

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
}

const states = [
  { name: 'Uttar Pradesh', slug: 'uttar-pradesh', jobCount: 0},
  { name: 'Bihar', slug: 'bihar', jobCount: 0},
  { name: 'Maharashtra', slug: 'maharashtra', jobCount: 0},
  { name: 'West Bengal', slug: 'west-bengal', jobCount: 0},
  { name: 'Madhya Pradesh', slug: 'madhya-pradesh', jobCount: 0},
  { name: 'Tamil Nadu', slug: 'tamil-nadu', jobCount: 0},
  { name: 'Rajasthan', slug: 'rajasthan', jobCount: 0},
  { name: 'Karnataka', slug: 'karnataka', jobCount: 0},
  { name: 'Gujarat', slug: 'gujarat', jobCount: 0},
  { name: 'Delhi', slug: 'delhi', jobCount: 0},
];

async function getLatestJobs() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/jobs?limit=6`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.success ? data.data.jobs : [];
  } catch {
    return [];
  }
}

async function getStateCounts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/jobs/state-counts`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    if (data.success) {
      return states.map(state => ({
        ...state,
        jobCount: data.data[state.name] || 0
      }));
    }
  } catch (error) {
    console.error('Error fetching state counts:', error);
  }
  return states;
}

export default async function Page() {
  const latestJobs = await getLatestJobs();
  const dynamicStates = await getStateCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50">
      <Header />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Find Government Jobs State-Wise 🇮🇳
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl">
            Latest central & state government job notifications, admit cards,
            results and updates — all in one place.
          </p>

          <div className="mt-8 max-w-3xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-14">
        {/* STATES SECTION */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Browse Jobs by State
            </h2>
            <span className="text-sm text-gray-500">
              Updated Daily
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dynamicStates.map((state) => (
              <StateCard key={state.slug} state={state} />
            ))}
          </div>
        </section>

        {/* LATEST JOBS */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Government Jobs
            </h2>
            <span className="text-sm text-gray-500">
              Fresh Notifications
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestJobs.map((job: Job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
