'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Profile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  total: number;
}

export default function ProfilePage() {
  const { status: authStatus } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    Promise.all([
      fetch('/api/profile').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
    ])
      .then(([profileData, ordersData]) => {
        if (profileData.user) {
          setProfile(profileData.user);
          setEditName(profileData.user.name || '');
        }
        if (ordersData.orders) {
          setTotalOrders(ordersData.orders.length);
          setTotalSpent(
            ordersData.orders.reduce((sum: number, o: Order) => sum + o.total, 0)
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authStatus]);

  const handleSave = async () => {
    if (!editName.trim() || saving) return;
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json();
      if (data.user) {
        setProfile(data.user);
        setSaveMessage('Name updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch {
      setSaveMessage('Failed to update name.');
    } finally {
      setSaving(false);
    }
  };

  if (authStatus === 'loading' || (authStatus === 'authenticated' && loading)) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#1e1e2e] pt-[90px] flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#6c5ce7] border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#1e1e2e] pt-[90px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">🔒</p>
            <h2 className="text-2xl font-bold text-white mb-2">Sign in required</h2>
            <p className="text-white/60 mb-6">Please sign in to view your profile.</p>
            <Link
              href="/signin"
              className="inline-block px-6 py-3 bg-[#6c5ce7] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#1e1e2e] pt-[90px] pb-20">
        <div className="max-w-[700px] mx-auto px-6">
          <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

          {/* Profile Card */}
          {profile && (
            <div className="bg-[#2d2d44] rounded-2xl p-8 mb-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-3xl font-bold shrink-0">
                  {(profile.name?.[0] || profile.email[0]).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-white truncate">
                    {profile.name || 'Unnamed User'}
                  </h2>
                  <p className="text-white/50 text-sm truncate">{profile.email}</p>
                  <p className="text-white/40 text-xs mt-1">
                    Member since{' '}
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Edit Name */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Display Name
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#1e1e2e] border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#6c5ce7]/50 transition-colors"
                    placeholder="Your name"
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving || editName.trim() === (profile.name || '')}
                    className="px-6 py-2.5 bg-[#6c5ce7] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
                {saveMessage && (
                  <p
                    className={`mt-2 text-sm ${
                      saveMessage.includes('success') ? 'text-[#00cec9]' : 'text-red-400'
                    }`}
                  >
                    {saveMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#2d2d44] rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-white mb-1">{totalOrders}</p>
              <p className="text-white/50 text-sm">Total Orders</p>
            </div>
            <div className="bg-[#2d2d44] rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-[#00cec9] mb-1">
                ${totalSpent.toFixed(2)}
              </p>
              <p className="text-white/50 text-sm">Total Spent</p>
            </div>
          </div>

          {/* Links */}
          <div className="bg-[#2d2d44] rounded-2xl overflow-hidden">
            <Link
              href="/orders"
              className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📦</span>
                <span className="text-white font-medium">My Orders</span>
              </div>
              <span className="text-white/40">&rarr;</span>
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">❤️</span>
                <span className="text-white font-medium">Wishlist</span>
              </div>
              <span className="text-white/40">&rarr;</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🚪</span>
                <span className="text-red-400 font-medium">Sign Out</span>
              </div>
              <span className="text-white/40">&rarr;</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
