'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface StateCardProps {
  state: {
    name: string;
    slug: string;
    jobCount: number;
  };
}

export default function StateCard({ state }: StateCardProps) {
  return (
    <Link href={`/states/${state.slug}`} className="group">
      <motion.div
        whileHover={{ y: -8, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 260 }}
        className="relative rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-2xl cursor-pointer"
      >
        {/* Gradient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition" />

        <div className="relative p-8 text-center">
          {/* ICON / DOT */}
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
            {state.name.charAt(0)}
          </div>

          {/* STATE NAME */}
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {state.name}
          </h3>

          {/* SUBTEXT */}
          <p className="text-sm text-gray-600 mb-4">
            Government Job Notifications
          </p>

          {/* JOB COUNT BADGE */}
          <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1">
            {state.jobCount} Jobs Available
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
