import Header from '../../components/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Statewise Jobs</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Statewise Jobs is your comprehensive platform for finding government job opportunities across all states in India.
              We provide the latest job notifications, admit cards, results, and important updates from various government departments.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              To make government job searching easier and more accessible for job seekers across India by providing
              accurate, timely, and comprehensive information about government job opportunities.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Latest government job notifications from all states</li>
              <li>Admit card downloads and exam information</li>
              <li>Exam results and answer keys</li>
              <li>Syllabus and exam calendar updates</li>
              <li>State-wise job categorization</li>
              <li>Real-time job search and filtering</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-700 mb-6">
              We are committed to providing reliable and up-to-date information to help you achieve your career goals
              in the government sector. Our platform is designed to be user-friendly and accessible to everyone.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              Have questions or need assistance? Feel free to reach out to us through our contact page.
              We&apos;re here to help you navigate your government job search journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
