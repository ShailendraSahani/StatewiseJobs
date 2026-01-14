'use client';

import { useState } from 'react';

interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  suggestions: string[];
}

export default function EligibilityChecker() {
  const [formData, setFormData] = useState({
    age: '',
    category: '',
    qualification: '',
    state: '',
    jobCategory: ''
  });

  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const checkEligibility = async () => {
    setLoading(true);

    // Simulate API call - in real implementation, this would call an API
    setTimeout(() => {
      const eligibilityResult: EligibilityResult = {
        eligible: true,
        reasons: [
          'Age requirement met',
          'Qualification matches',
          'Category reservation applicable'
        ],
        suggestions: [
          'Apply within 7 days to avoid last-minute rush',
          'Keep all documents ready',
          'Check official notification for exact requirements'
        ]
      };

      // Basic eligibility logic
      const age = parseInt(formData.age);
      const reasons: string[] = [];
      const suggestions: string[] = [];

      if (age < 18) {
        eligibilityResult.eligible = false;
        reasons.push('Minimum age requirement is 18 years');
      } else if (age > 35 && formData.category === 'General') {
        eligibilityResult.eligible = false;
        reasons.push('Maximum age limit exceeded for General category');
      } else {
        reasons.push('Age requirement met');
      }

      // Qualification check
      if (formData.qualification === '10th' && ['Police', 'Railway'].includes(formData.jobCategory)) {
        reasons.push('Qualification matches');
      } else if (formData.qualification === '12th' && ['Banking', 'SSC'].includes(formData.jobCategory)) {
        reasons.push('Qualification matches');
      } else if (formData.qualification === 'Graduate' && ['UPSC', 'Teaching'].includes(formData.jobCategory)) {
        reasons.push('Qualification matches');
      } else {
        eligibilityResult.eligible = false;
        reasons.push('Qualification may not match requirements');
        suggestions.push('Check specific qualification requirements for this job');
      }

      // Category benefits
      if (formData.category !== 'General') {
        reasons.push('Category reservation applicable');
        suggestions.push('Additional age relaxation available');
      }

      // General suggestions
      suggestions.push(
        'Apply within 7 days to avoid last-minute rush',
        'Keep all documents ready',
        'Check official notification for exact requirements'
      );

      setResult(eligibilityResult);
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkEligibility();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Eligibility Checker</h3>
      <p className="text-gray-600 mb-6">
        Check your eligibility for government jobs based on basic criteria
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              required
              min="18"
              max="60"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification
            </label>
            <select
              required
              value={formData.qualification}
              onChange={(e) => setFormData({...formData, qualification: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Qualification</option>
              <option value="10th">10th Pass</option>
              <option value="12th">12th Pass</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Category
            </label>
            <select
              required
              value={formData.jobCategory}
              onChange={(e) => setFormData({...formData, jobCategory: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Job Category</option>
              <option value="Police">Police</option>
              <option value="Railway">Railway</option>
              <option value="Banking">Banking</option>
              <option value="SSC">SSC</option>
              <option value="UPSC">UPSC</option>
              <option value="Teaching">Teaching</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Eligibility'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 rounded-md border">
          <div className={`text-lg font-semibold mb-3 ${
            result.eligible ? 'text-green-600' : 'text-red-600'
          }`}>
            {result.eligible ? '✅ You may be eligible' : '❌ You may not be eligible'}
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Reasons:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {result.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Suggestions:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            * This is a basic eligibility check. Please refer to official job notification for exact requirements.
          </div>
        </div>
      )}
    </div>
  );
}
