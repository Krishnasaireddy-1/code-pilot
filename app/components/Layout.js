'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (!user && window.location.pathname !== '/login') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="p-4">Checking authentication...</div>;

  return (
    <div>
      <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/code">Code</Link>
        <Link href="/social">Social</Link>
        <button
          onClick={() => {
            localStorage.removeItem('user');
            router.push('/login');
          }}
          className="ml-auto text-red-400 hover:text-red-600"
        >
          Logout
        </button>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
