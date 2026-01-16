'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FooterData {
  title: string;
  description: string;
  links: {
    text: string;
    url: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  newsletterSignup: {
    title: string;
    description: string;
    placeholder: string;
  };
  copyright: string;
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch('/api/footer');
        const result = await response.json();
        if (result.success) {
          setFooterData(result.data);
        }
      } catch (error) {
        console.error('Error fetching footer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, []);

  if (loading) {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </footer>
    );
  }

  if (!footerData) {
    return null;
  }

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{footerData.title}</h3>
            <p className="text-gray-300 mb-4">{footerData.description}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerData.links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {footerData.socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>{footerData.contactInfo?.address || '123 Main Street, New Delhi, India'}</p>
              <p>{footerData.contactInfo?.phone || '+91-7388711487'}</p>
              <p>{footerData.contactInfo?.email || 'info@statewisejobs.com'}</p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerData.newsletterSignup?.title || 'Stay Updated'}</h4>
            <p className="text-gray-300 mb-4">{footerData.newsletterSignup?.description || 'Subscribe to our newsletter for the latest job updates'}</p>
            <div className="flex">
              <input
                type="email"
                placeholder={footerData.newsletterSignup?.placeholder || 'Enter your email address'}
                className="flex-1 px-3 py-2 text-gray-800 rounded-l-md focus:outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
