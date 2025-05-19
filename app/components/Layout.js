
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user && window.location.pathname !== '/login') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="p-8 text-white bg-gray-900 min-h-screen flex items-center justify-center text-xl">
        Checking authentication...
      </div>
    );
  }

  const linkClass = (path) =>
    `transition ${
      pathname === path
        ? 'text-blue-400 font-semibold'
        : 'hover:text-teal-400'
    }`;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 px-6 py-4 flex items-center justify-between shadow-md relative">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <img
            src="/logo2.png"
            alt="Logo"
            className="w-14 h-14 object-contain"
          />
          <span className="text-2xl font-italic font-serif tracking-tight">
            CodePilot
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <Link href="/code" className={linkClass('/code')}>Code</Link>
          <Link href="/social" className={linkClass('/social')}>Social</Link>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-800 flex flex-col items-start gap-4 p-4 md:hidden z-10 border-t border-gray-700">
            <Link href="/" className={linkClass('/')} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/code" className={linkClass('/code')} onClick={() => setMenuOpen(false)}>Code</Link>
            <Link href="/social" className={linkClass('/social')} onClick={() => setMenuOpen(false)}>Social</Link>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                router.push('/login');
              }}
              className="w-full mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function Layout({ children }) {
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const user = localStorage.getItem('user');

//     if (!user && window.location.pathname !== '/login') {
//       router.push('/login');
//     } else {
//       setLoading(false);
//     }
//   }, [router]);

//   if (loading) return <div className="p-4">Checking authentication...</div>;

//   return (
//     <div>
//       <nav className="p-4 bg-gray-800 text-white flex gap-4">
//         <Link href="/">Home</Link>
//         <Link href="/code">Code</Link>
//         <Link href="/social">Social</Link>
//         <button
//           onClick={() => {
//             localStorage.removeItem('user');
//             router.push('/login');
//           }}
//           className="ml-auto text-red-400 hover:text-red-600"
//         >
//           Logout
//         </button>
//       </nav>
//       <main className="p-4">{children}</main>
//     </div>
//   );
// }
