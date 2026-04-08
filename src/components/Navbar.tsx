'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse' },
  { href: '/custom', label: 'Custom Order' },
  { href: '/about', label: 'About' },
];

interface SearchResult {
  id: string;
  name: string;
  emoji: string;
  basePrice: number;
  category: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/cart').then(r => r.json()).then(d => setCartCount(d.count || 0)).catch(() => {});
    }
  }, [status]);

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(r => r.json())
        .then(d => setSearchResults(d))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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

        {/* Search */}
        <div className="hidden md:block relative" ref={searchRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search models..."
            className="w-48 lg:w-64 px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/15 transition-all"
          />
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray/10 overflow-hidden z-50">
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { router.push(`/product/${p.id}`); setSearchOpen(false); setSearchQuery(''); }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-light transition-colors text-left bg-transparent border-none cursor-pointer"
                >
                  <span className="text-xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{p.name}</p>
                    <p className="text-xs text-gray capitalize">{p.category}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">${p.basePrice}</span>
                </button>
              ))}
            </div>
          )}
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
                    <Link href="/orders" className="block px-4 py-2 text-sm text-dark hover:bg-light transition-colors" onClick={() => setDropdownOpen(false)}>
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
            {cartCount > 0 && (
              <span className="bg-accent text-dark text-[0.7rem] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
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
