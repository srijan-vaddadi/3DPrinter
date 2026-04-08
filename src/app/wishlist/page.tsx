'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  emoji: string;
  gradient: string;
  category: string;
  badge: string | null;
  rating: number;
  reviewCount: number;
}

interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch('/api/wishlist');
        if (!res.ok) throw new Error('Failed to fetch wishlist');
        const data = await res.json();

        if (Array.isArray(data) && data.length === 0) {
          const sessionRes = await fetch('/api/auth/session');
          const session = await sessionRes.json();
          if (!session?.user) {
            setAuthenticated(false);
          }
        }

        setItems(data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error('Failed to update wishlist');
      const data = await res.json();

      if (!data.added) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <section className="py-16 bg-[#f5f6fa] min-h-screen">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-3xl font-bold text-[#1e1e2e] mb-8">My Wishlist</h1>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#6c5ce7]/30 border-t-[#6c5ce7] rounded-full animate-spin" />
                <p className="text-[#636e72] text-sm font-medium">Loading wishlist...</p>
              </div>
            </div>
          )}

          {/* Sign-in Required State */}
          {!loading && !authenticated && (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="text-6xl mb-2">🔒</div>
                <h2 className="text-xl font-bold text-[#1e1e2e]">Sign in required</h2>
                <p className="text-[#636e72] mb-4">
                  Please sign in to view your wishlist.
                </p>
                <Link
                  href="/signin"
                  className="px-8 py-3 rounded-xl font-semibold bg-[#6c5ce7] text-white hover:bg-[#6c5ce7]/90 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && authenticated && items.length === 0 && (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="text-6xl mb-2">💜</div>
                <h2 className="text-xl font-bold text-[#1e1e2e]">Your wishlist is empty</h2>
                <p className="text-[#636e72] mb-4">
                  Browse our collection and save your favorite models.
                </p>
                <Link
                  href="/browse"
                  className="px-8 py-3 rounded-xl font-semibold bg-[#6c5ce7] text-white hover:bg-[#6c5ce7]/90 transition-colors"
                >
                  Browse Models
                </Link>
              </div>
            </div>
          )}

          {/* Wishlist Grid */}
          {!loading && authenticated && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-lg transition-all group"
                >
                  <Link href={`/product/${item.product.id}`}>
                    <div
                      className={`h-[240px] bg-gradient-to-br ${item.product.gradient} flex items-center justify-center text-7xl relative`}
                    >
                      <span className="group-hover:scale-110 transition-transform">
                        {item.product.emoji}
                      </span>
                      {item.product.badge && (
                        <span className="absolute top-3 left-3 bg-[#00cec9] text-[#1e1e2e] px-3 py-1 rounded-full text-xs font-bold">
                          {item.product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#1e1e2e] mb-1.5">{item.product.name}</h3>
                      <div className="flex items-center gap-2 mb-3 text-sm">
                        <span className="text-yellow-400">
                          {renderStars(item.product.rating)}
                        </span>
                        <span className="text-[#636e72]">
                          ({item.product.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="text-xl font-bold text-[#6c5ce7]">
                        <span className="text-sm font-normal text-[#636e72]">from </span>$
                        {item.product.basePrice}
                      </div>
                    </div>
                  </Link>
                  <div className="px-5 pb-5">
                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={removingId === item.productId}
                      className="w-full py-2.5 rounded-lg bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removingId === item.productId ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
