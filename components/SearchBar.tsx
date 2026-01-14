'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const states = [
  'All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
];

const categories = [
  'All Categories', 'Police', 'Defence', 'Teaching', 'Banking', 'Health',
  'SSC', 'UPSC', 'Railway', 'Engineering', 'Agriculture', 'Finance'
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (query) params.set('q', query);
    if (selectedState !== 'All States') params.set('state', selectedState);
    if (selectedCategory !== 'All Categories') params.set('category', selectedCategory);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl"
    >
      {/* Gradient Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10" />

      <form
        onSubmit={handleSearch}
        className="relative p-6 md:p-8 space-y-6"
      >
        {/* SEARCH INPUT */}
        <div>
          <input
            type="text"
            placeholder="Search job title, exam, department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="rounded-2xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-2xl border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* SEARCH BUTTON */}
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-md hover:opacity-90 hover:shadow-lg transition"
          >
            Search Jobs 🔍
          </button>
        </div>
      </form>
    </motion.div>
  );
}
