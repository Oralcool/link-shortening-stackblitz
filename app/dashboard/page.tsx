'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchLinks();
    }
  }, [status, router]);

  const fetchLinks = async () => {
    try {
      const response = await axios.get('/api/links');
      setLinks(response.data.links);
    } catch (error) {
      console.error('Error fetching links', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/links', { originalUrl, customSlug });
      setOriginalUrl('');
      setCustomSlug('');
      fetchLinks();
    } catch (error) {
      console.error('Error creating link', error);
    }
  };

  const chartData = {
    labels: links.map((link: any) => link.slug),
    datasets: [
      {
        label: 'Clicks',
        data: links.map((link: any) => link.clicks),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-5">Dashboard</h1>
          <form onSubmit={handleSubmit} className="mb-5">
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Enter URL to shorten"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="Custom slug (optional)"
              className="w-full px-3 py-2 border rounded-md mt-2"
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md mt-2">
              Shorten URL
            </button>
          </form>
          <div className="mt-5">
            <h2 className="text-xl font-semibold mb-3">Your Links</h2>
            <ul>
              {links.map((link: any) => (
                <li key={link._id} className="mb-2">
                  <a href={`/api/links/${link.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {link.slug}
                  </a>
                  <span className="ml-2 text-gray-500">({link.clicks} clicks)</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Click Statistics</h2>
            <Bar data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}