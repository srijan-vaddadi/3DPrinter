'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const steps = [
  { label: 'Cart', completed: true },
  { label: 'Details', active: true },
  { label: 'Payment', completed: false },
  { label: 'Confirm', completed: false },
];

type PaymentMethod = 'credit-card' | 'paypal' | 'apple-pay';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <section className="bg-dark-light rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold">
                  1
                </span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1.5 block">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-dark-light rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold">
                  2
                </span>
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/70 mb-1.5 block">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1.5 block">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1.5 block">Street Address</label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1.5 block">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Apt 4B"
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/70 mb-1.5 block">City</label>
                    <input
                      type="text"
                      placeholder="New York"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1.5 block">State / Province</label>
                    <input
                      type="text"
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
                      placeholder="10001"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1.5 block">Country</label>
                    <select className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors appearance-none">
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

            {/* Payment Method */}
            <section className="bg-dark-light rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold">
                  3
                </span>
                Payment Method
              </h2>

              {/* Payment Method Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('credit-card')}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                    paymentMethod === 'credit-card'
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-white/10 bg-dark text-gray hover:border-white/20'
                  }`}
                >
                  💳 Credit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-white/10 bg-dark text-gray hover:border-white/20'
                  }`}
                >
                  🅿️ PayPal
                </button>
                <button
                  onClick={() => setPaymentMethod('apple-pay')}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                    paymentMethod === 'apple-pay'
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-white/10 bg-dark text-gray hover:border-white/20'
                  }`}
                >
                   Apple Pay
                </button>
              </div>

              {/* Credit Card Fields */}
              {paymentMethod === 'credit-card' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/70 mb-1.5 block">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/70 mb-1.5 block">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/70 mb-1.5 block">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1.5 block">Name on Card</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="text-center py-8 text-gray">
                  <p className="text-3xl mb-3">🅿️</p>
                  <p className="text-sm">You will be redirected to PayPal to complete your payment.</p>
                </div>
              )}

              {paymentMethod === 'apple-pay' && (
                <div className="text-center py-8 text-gray">
                  <p className="text-3xl mb-3"></p>
                  <p className="text-sm">Complete your payment using Apple Pay.</p>
                </div>
              )}
            </section>

            {/* Place Order Button */}
            <Link
              href="/confirmation"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-4 rounded-xl transition-opacity flex items-center justify-center gap-2 text-lg block text-center"
            >
              Place Order &mdash; $140.85
            </Link>
          </div>

          {/* Right Column - Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-light rounded-2xl p-6 border border-white/5 sticky top-28">
              <h2 className="text-xl font-bold mb-5">Order Summary</h2>

              {/* Mini Item Cards */}
              <div className="space-y-3 mb-6">
                {/* Dragon Figurine */}
                <div className="flex items-center gap-3 bg-dark/50 rounded-xl p-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center text-xl flex-shrink-0">
                    🐉
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Dragon Guardian Figurine</p>
                    <p className="text-xs text-gray">Qty: 1</p>
                  </div>
                  <p className="text-sm font-bold text-white/90">$34.99</p>
                </div>

                {/* Plant Pot */}
                <div className="flex items-center gap-3 bg-dark/50 rounded-xl p-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center text-xl flex-shrink-0">
                    🌿
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Geometric Plant Pot</p>
                    <p className="text-xs text-gray">Qty: 2</p>
                  </div>
                  <p className="text-sm font-bold text-white/90">$83.97</p>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>$118.96</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span>$9.99</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tax</span>
                  <span>$11.90</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">$140.85</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-sm text-gray">
        <p>&copy; {new Date().getFullYear()} Print3D. All rights reserved.</p>
      </footer>
    </div>
  );
}
