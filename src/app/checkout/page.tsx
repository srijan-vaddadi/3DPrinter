'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

interface CartProduct {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  basePrice: number;
}

interface CartItemData {
  id: string;
  quantity: number;
  color: string | null;
  size: string | null;
  material: string | null;
  engraving: string | null;
  product: CartProduct;
}

const steps = [
  { label: 'Cart', completed: true },
  { label: 'Details', active: true },
  { label: 'Payment', completed: false },
  { label: 'Confirm', completed: false },
];

export default function CheckoutPage() {
  const { status } = useSession();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/cart')
        .then((res) => res.json())
        .then((data) => { setItems(data.items || []); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const subtotal = items.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);
  const shippingCost = items.length > 0 ? 9.99 : 0;
  const tax = parseFloat((subtotal * 0.1).toFixed(2));
  const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

  const handlePlaceOrder = async () => {
    setError('');
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.state || !shipping.zip) {
      setError('Please fill in all required shipping fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipping }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-dark text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🔒</p>
            <h1 className="text-2xl font-bold mb-2">Sign in required</h1>
            <p className="text-gray mb-6">Please sign in to proceed with checkout</p>
            <Link href="/signin" className="inline-block bg-primary hover:bg-primary/80 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Checkout Steps Bar */}
        <div className="flex items-center justify-center gap-0 mb-12 max-w-xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    step.completed
                      ? 'bg-accent border-accent text-dark'
                      : step.active
                      ? 'bg-primary border-primary text-white'
                      : 'bg-dark-light border-white/10 text-gray'
                  }`}
                >
                  {step.completed ? '✓' : index + 1}
                </div>
                <span
                  className={`text-xs mt-1.5 ${
                    step.completed
                      ? 'text-accent'
                      : step.active
                      ? 'text-white font-medium'
                      : 'text-gray'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 ${
                    step.completed ? 'bg-accent' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-white/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-xl text-gray mb-6">Your cart is empty</p>
            <Link href="/browse" className="inline-block bg-primary hover:bg-primary/80 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Shipping Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <section className="bg-dark-light rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold">
                    1
                  </span>
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/70 mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      value={shipping.name}
                      onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1.5 block">Street Address</label>
                    <input
                      type="text"
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      placeholder="123 Main Street"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/70 mb-1.5 block">City</label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        placeholder="New York"
                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/70 mb-1.5 block">State / Province</label>
                      <input
                        type="text"
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        placeholder="NY"
                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/70 mb-1.5 block">ZIP / Postal Code</label>
                      <input
                        type="text"
                        value={shipping.zip}
                        onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                        placeholder="10001"
                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/70 mb-1.5 block">Country</label>
                      <select
                        value={shipping.country}
                        onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors appearance-none"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-opacity flex items-center justify-center gap-2 text-lg cursor-pointer disabled:cursor-not-allowed border-none"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Place Order &mdash; ${total.toFixed(2)}</>
                )}
              </button>

              <p className="text-xs text-gray text-center flex items-center justify-center gap-1.5">
                <span>🔒</span> Secure checkout powered by Stripe
              </p>
            </div>

            {/* Right Column - Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-dark-light rounded-2xl p-6 border border-white/5 sticky top-28">
                <h2 className="text-xl font-bold mb-5">Order Summary</h2>

                {/* Cart Item Cards */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => {
                    const details = [item.color, item.size, item.material].filter(Boolean).join(' / ');
                    return (
                      <div key={item.id} className="flex items-center gap-3 bg-dark/50 rounded-xl p-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.product.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                          {item.product.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          {details && <p className="text-xs text-gray truncate">{details}</p>}
                          {item.engraving && <p className="text-xs text-gray italic truncate">"{item.engraving}"</p>}
                          <p className="text-xs text-gray">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-white/90">${(item.product.basePrice * item.quantity).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-sm text-gray">
        <p>&copy; {new Date().getFullYear()} Print3D. All rights reserved.</p>
      </footer>
    </div>
  );
}
