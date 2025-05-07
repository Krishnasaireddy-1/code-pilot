'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      router.push('/');
    }
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isRegister ? '/api/register' : '/api/login';
    const payload = isRegister ? { name, email, password } : { email, password };

    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const user = await res.json();
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/');
    } else {
      alert('Something went wrong.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl w-96 space-y-5 border border-[#334155]"
      >
        <h2 className="text-2xl font-bold text-center tracking-wide">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>

        {isRegister && (
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-lg font-semibold tracking-wide"
        >
          {isRegister ? 'Sign Up' : 'Login'}
        </button>

        <p className="text-sm text-center text-gray-300">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </form>
    </div>
  );
}
