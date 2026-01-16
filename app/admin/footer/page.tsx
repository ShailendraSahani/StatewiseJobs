'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FooterData {
  _id?: string;
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
  isActive: boolean;
}

export default function AdminFooterPage() {
  const [footerData, setFooterData] = useState<FooterData>({
    title: '',
    description: '',
    links: [{ text: '', url: '' }],
    socialLinks: [{ platform: '', url: '' }],
    contactInfo: {
      address: '',
      phone: '',
      email: '',
    },
    newsletterSignup: {
      title: '',
      description: '',
      placeholder: '',
    },
    copyright: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchFooter();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const fetchFooter = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch('/api/footer');
      const result = await response.json();

      if (result.success && result.data) {
        setFooterData(result.data);
      } else {
        // No footer exists, use default empty state
        setFooterData({
          title: 'Statewise Jobs',
          description: 'Find government jobs across all states in India',
          links: [
            { text: 'Home', url: '/' },
            { text: 'About', url: '/about' },
            { text: 'Jobs', url: '/jobs' },
            { text: 'States', url: '/states' },
            { text: 'Privacy', url: '/privacy' },
            { text: 'Contact', url: '/contact' },
          ],
          socialLinks: [
            { platform: 'Facebook', url: 'https://facebook.com' },
            { platform: 'Twitter', url: 'https://twitter.com' },
            { platform: 'LinkedIn', url: 'https://linkedin.com' },
          ],
          contactInfo: {
            address: '123 Main Street, New Delhi, India',
            phone: '+91-1234567890',
            email: 'info@statewisejobs.com',
          },
          newsletterSignup: {
            title: 'Stay Updated',
            description: 'Subscribe to our newsletter for the latest job updates',
            placeholder: 'Enter your email address',
          },
          copyright: '© 2024 Statewise Jobs. All rights reserved.',
          isActive: true,
        });
      }
    } catch (error) {
      console.error('Error fetching footer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const method = footerData._id ? 'PUT' : 'POST';
      const body = footerData._id ? { id: footerData._id, ...footerData } : footerData;

      const response = await fetch('/api/footer', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        alert('Footer saved successfully!');
        fetchFooter(); // Refresh data
      } else {
        alert('Error saving footer: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving footer:', error);
      alert('Error saving footer');
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    setFooterData({
      ...footerData,
      links: [...footerData.links, { text: '', url: '' }],
    });
  };

  const removeLink = (index: number) => {
    setFooterData({
      ...footerData,
      links: footerData.links.filter((_, i) => i !== index),
    });
  };

  const updateLink = (index: number, field: 'text' | 'url', value: string) => {
    const updatedLinks = footerData.links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setFooterData({ ...footerData, links: updatedLinks });
  };

  const addSocialLink = () => {
    setFooterData({
      ...footerData,
      socialLinks: [...footerData.socialLinks, { platform: '', url: '' }],
    });
  };

  const removeSocialLink = (index: number) => {
    setFooterData({
      ...footerData,
      socialLinks: footerData.socialLinks.filter((_, i) => i !== index),
    });
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedSocialLinks = footerData.socialLinks.map((social, i) =>
      i === index ? { ...social, [field]: value } : social
    );
    setFooterData({ ...footerData, socialLinks: updatedSocialLinks });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading footer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Footer Management</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={footerData.title}
                onChange={(e) => setFooterData({ ...footerData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Footer title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={footerData.description}
                onChange={(e) => setFooterData({ ...footerData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Footer description"
              />
            </div>

            {/* Links */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quick Links
                </label>
                <button
                  onClick={addLink}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                >
                  Add Link
                </button>
              </div>
              {footerData.links.map((link, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={link.text}
                    onChange={(e) => updateLink(index, 'text', e.target.value)}
                    placeholder="Link text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    placeholder="URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeLink(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Social Links
                </label>
                <button
                  onClick={addSocialLink}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                >
                  Add Social Link
                </button>
              </div>
              {footerData.socialLinks.map((social, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={social.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                    placeholder="Platform (e.g., Facebook)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Contact Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={footerData.contactInfo.address}
                    onChange={(e) => setFooterData({
                      ...footerData,
                      contactInfo: { ...footerData.contactInfo, address: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={footerData.contactInfo.phone}
                    onChange={(e) => setFooterData({
                      ...footerData,
                      contactInfo: { ...footerData.contactInfo, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={footerData.contactInfo.email}
                    onChange={(e) => setFooterData({
                      ...footerData,
                      contactInfo: { ...footerData.contactInfo, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email address"
                  />
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Newsletter Signup</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={footerData.newsletterSignup.title}
                    onChange={(e) => setFooterData({
                      ...footerData,
                      newsletterSignup: { ...footerData.newsletterSignup, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Newsletter title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={footerData.newsletterSignup.description}
                    onChange={(e) => setFooterData({
                      ...footerData,
                      newsletterSignup: { ...footerData.newsletterSignup, description: e.target.value }
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Newsletter description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={footerData.newsletterSignup.placeholder}
                    onChange={(e) => setFooterData({
                      ...footerData,
                      newsletterSignup: { ...footerData.newsletterSignup, placeholder: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email input placeholder"
                  />
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copyright Text
              </label>
              <input
                type="text"
                value={footerData.copyright}
                onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Copyright text"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={footerData.isActive}
                onChange={(e) => setFooterData({ ...footerData, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Active (visible on website)
              </label>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Footer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
