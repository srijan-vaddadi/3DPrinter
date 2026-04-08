'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CartItem {
  id: number;
  name: string;
  emoji: string;
  color: string;
  size: string;
  material: string;
  engraving?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  gradientFrom: string;
  gradientTo: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Dragon Guardian Figurine',
      emoji: '\uD83D\uDC09',
      color: 'Purple',
      size: 'Medium',
      material: 'PLA',
      engraving: 'To my brave knight \u2014 Dad',
      quantity: 1,
      unitPrice: 34.99,
      totalPrice: 34.99,
      gradientFrom: 'from-primary',
      gradientTo: 'to-purple-400',
    },
    {
      id: 2,
      name: 'Geometric Plant Pot',
      emoji: '\uD83C\uDF3F',
      color: 'Green',
      size: 'Large',
      material: 'PETG',
      quantity: 2,
      unitPrice: 41.985,
      totalPrice: 83.97,
      gradientFrom: 'from-accent',
      gradientTo: 'to-emerald-400',
    },
  ]);

  const [removingId, setRemovingId] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState('');

  const handleQuantityChange = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return {
            ...item,
            quantity: newQty,
            totalPrice: parseFloat((item.unitPrice * newQty).toFixed(2)),
          };
        }
        return item;
      })
    );
  };

  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = 9.99;
  const tax = parseFloat((subtotal * 0.1).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-gray mb-10">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-xl text-gray mb-6">Your cart is empty</p>
            <Link
              href="/browse"
              className="inline-block bg-primary hover:bg-primary/80 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-dark-light rounded-2xl p-5 flex flex-col sm:flex-row gap-5 border border-white/5 transition-all duration-300 ${
                    removingId === item.id
                      ? 'opacity-0 scale-95 -translate-x-4'
                      : 'opacity-100 scale-100 translate-x-0'
                  }`}
                >
                  {/* Thumbnail */}
                  <div
                    className={`w-full sm:w-28 h-28 rounded-xl bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} flex items-center justify-center text-4xl flex-shrink-0`}
                  >
                    {item.emoji}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray hover:text-red-400 transition-colors text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
                        aria-label={`Remove ${item.name}`}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full">
                        {item.color}
                      </span>
                      <span className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full">
                        {item.size}
                      </span>
                      <span className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full">
                        {item.material}
                      </span>
                    </div>

                    {item.engraving && (
                      <p className="text-sm text-gray mt-2 italic">
                        Engraving: &ldquo;{item.engraving}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-dark rounded-xl border border-white/10">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-9 h-9 flex items-center justify-center text-gray hover:text-white transition-colors rounded-l-xl hover:bg-white/5"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray hover:text-white transition-colors rounded-r-xl hover:bg-white/5"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-lg font-bold text-primary">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mt-4 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                Continue Shopping
              </Link>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-dark-light rounded-2xl p-6 border border-white/5 sticky top-28">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-6">
                  <label className="text-sm text-white/70 mb-2 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                    <button className="bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors border border-white/10">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="mt-6 w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold py-3.5 rounded-xl transition-opacity flex items-center justify-center gap-2 text-base block text-center"
                >
                  Proceed to Checkout
                  <span>&rarr;</span>
                </Link>

                {/* Security Note */}
                <p className="text-xs text-gray text-center mt-4 flex items-center justify-center gap-1.5">
                  <span>🔒</span>
                  Secure checkout powered by Stripe
                </p>
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
