'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    department: string;
    state: string;
    category: string;
    vacancy: number;
    lastDate: string;
    salary: string;
    qualification: string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  const [saved, setSaved] = useState(false);

  const lastDate = new Date(job.lastDate);
  const daysLeft = Math.ceil(
    (lastDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSaved(savedJobs.includes(job._id));
  }, [job._id]);

  const toggleSave = () => {
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');

    if (savedJobs.includes(job._id)) {
      savedJobs = savedJobs.filter((id: string) => id !== job._id);
      setSaved(false);
    } else {
      savedJobs.push(job._id);
      setSaved(true);
    }

    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260 }}
      className="relative rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-md hover:shadow-xl"
    >
      {/* Gradient Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition" />

      <div className="relative p-6">
        {/* TOP BADGES */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
              {job.category}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
              {job.state}
            </span>

            {daysLeft <= 7 && daysLeft >= 0 && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 animate-pulse">
                Closing in {daysLeft} days
              </span>
            )}
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={toggleSave}
            className={`text-xl transition ${
              saved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            title="Save Job"
          >
            {saved ? '❤️' : '🤍'}
          </button>
        </div>

        {/* TITLE */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          <Link
            href={`/jobs/${job._id}`}
            className="hover:text-indigo-600 transition"
          >
            {job.title}
          </Link>
        </h3>

        <p className="mt-1 text-sm text-gray-600">
          {job.department}
        </p>

        {/* INFO */}
        <div className="mt-5 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500">Vacancy</span>
            <span className="font-medium">
              {job.vacancy?.toLocaleString() || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Last Date</span>
            <span className="font-medium">
              {lastDate.toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Salary</span>
            <span className="font-medium">{job.salary}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Qualification</span>
            <span className="font-medium line-clamp-1">
              {job.qualification}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/jobs/${job._id}`}
          className="mt-6 block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-center text-sm font-semibold text-white hover:opacity-90 transition"
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
}
