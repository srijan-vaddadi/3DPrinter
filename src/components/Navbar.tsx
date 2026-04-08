'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse' },
  { href: '/custom', label: 'Custom Order' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[70px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-2xl font-extrabold text-white">
          <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
            <path d="M16 2L2 10v12l14 8 14-8V10L16 2z" fill="#00cec9" opacity="0.3"/>
            <path d="M16 2L2 10l14 8 14-8L16 2z" fill="#6c5ce7"/>
            <path d="M16 18L2 10v12l14 8V18z" fill="#00cec9"/>
            <path d="M16 18l14-8v12l-14 8V18z" fill="#a29bfe"/>
          </svg>
          Print<span className="text-accent">3D</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium text-[0.95rem] transition-colors relative ${
                pathname === item.href
                  ? 'text-white after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {status === 'loading' && (
            <div className="w-20 h-4 bg-white/10 rounded animate-pulse" />
          )}

          {status === 'unauthenticated' && (
            <Link href="/signin" className="text-white/70 hover:text-white transition-colors text-sm">
              Sign In
            </Link>
          )}

          {status === 'authenticated' && session?.user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm cursor-pointer bg-transparent border-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[120px] truncate">{session.user.name || session.user.email}</span>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 bg-white rounded-xl shadow-lg py-2 w-48 border border-gray/10">
                    <div className="px-4 py-2 border-b border-gray/10">
                      <p className="text-sm font-semibold text-dark truncate">{session.user.name}</p>
                      <p className="text-xs text-gray truncate">{session.user.email}</p>
                    </div>
                    <Link href="#" className="block px-4 py-2 text-sm text-dark hover:bg-light transition-colors" onClick={() => setDropdownOpen(false)}>
                      My Orders
                    </Link>
                    <Link href="#" className="block px-4 py-2 text-sm text-dark hover:bg-light transition-colors" onClick={() => setDropdownOpen(false)}>
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-light transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <Link href="/cart" className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
            <span>🛒</span>
            <span className="bg-accent text-dark text-[0.7rem] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
              2
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden bg-transparent border-none text-white text-2xl cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark px-6 pb-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium ${pathname === item.href ? 'text-white' : 'text-white/70'}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {status === 'authenticated' ? (
            <>
              <div className="text-white/50 text-sm border-t border-white/10 pt-4">
                Signed in as {session?.user?.name || session?.user?.email}
              </div>
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false); }}
                className="text-red-400 text-left bg-transparent border-none cursor-pointer font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/signin" className="text-white/70" onClick={() => setMobileOpen(false)}>Sign In</Link>
          )}
          <Link href="/cart" className="text-white/70" onClick={() => setMobileOpen(false)}>🛒 Cart</Link>
        </div>
      )}
    </nav>
  );
}
