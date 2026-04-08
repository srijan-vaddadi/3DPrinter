'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  color: string | null;
  size: string | null;
  material: string | null;
  engraving: string | null;
  product: {
    id: string;
    name: string;
    emoji: string;
  };
}

interface Order {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingName: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingZip: string | null;
  shippingCountry: string | null;
  createdAt: string;
  items: OrderItem[];
}

const STEPS = ['pending', 'confirmed', 'printing', 'shipped', 'delivered'];
const STEP_LABELS = ['Pending', 'Confirmed', 'Printing', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { status: authStatus } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authStatus !== 'authenticated' || !id) return;
    fetch(`/api/orders/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Order not found');
        return r.json();
      })
      .then((data) => setOrder(data.items ? data : data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, authStatus]);

  const currentStepIndex = order ? STEPS.indexOf(order.status) : -1;

  if (authStatus === 'loading') {
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
            <p className="text-white/60 mb-6">Please sign in to view your order details.</p>
            <Link
              href="/signin"
              className="inline-block px-6 py-3 bg-[#6c5ce7] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#1e1e2e] pt-[90px] pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          {/* Back link */}
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm"
          >
            <span>&larr;</span> Back to Orders
          </Link>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-3 border-[#6c5ce7] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">😕</p>
              <h2 className="text-xl font-bold text-white mb-2">Order not found</h2>
              <p className="text-white/60">{error}</p>
            </div>
          )}

          {order && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">
                  Order #{order.id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-white/50 text-sm">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Progress Tracker */}
              <div className="bg-[#2d2d44] rounded-2xl p-8 mb-8">
                <h2 className="text-lg font-semibold text-white mb-6">Order Status</h2>
                <div className="flex items-center justify-between relative">
                  {/* Connecting line (background) */}
                  <div className="absolute top-5 left-[10%] right-[10%] h-[3px] bg-white/10 rounded" />
                  {/* Connecting line (progress) */}
                  <div
                    className="absolute top-5 left-[10%] h-[3px] bg-[#00cec9] rounded transition-all duration-500"
                    style={{
                      width: currentStepIndex <= 0
                        ? '0%'
                        : `${(currentStepIndex / (STEPS.length - 1)) * 80}%`,
                    }}
                  />

                  {STEP_LABELS.map((label, i) => {
                    const isCompleted = i < currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    const isFuture = i > currentStepIndex;

                    return (
                      <div key={label} className="flex flex-col items-center z-10 relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            isCompleted
                              ? 'bg-[#00cec9] text-[#1e1e2e]'
                              : isCurrent
                              ? 'bg-[#6c5ce7] text-white ring-4 ring-[#6c5ce7]/30'
                              : 'bg-[#636e72]/30 text-[#636e72]'
                          }`}
                        >
                          {isCompleted ? '✓' : i + 1}
                        </div>
                        <span
                          className={`mt-3 text-xs font-medium ${
                            isCompleted
                              ? 'text-[#00cec9]'
                              : isCurrent
                              ? 'text-white'
                              : isFuture
                              ? 'text-[#636e72]'
                              : 'text-[#636e72]'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-[#2d2d44] rounded-2xl p-8 mb-8">
                <h2 className="text-lg font-semibold text-white mb-6">Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const customizations = [item.color, item.size, item.material, item.engraving]
                      .filter(Boolean)
                      .join(' / ');

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-[#1e1e2e] rounded-xl"
                      >
                        <span className="text-3xl">{item.product.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium">{item.product.name}</p>
                          {customizations && (
                            <p className="text-white/50 text-sm mt-0.5">{customizations}</p>
                          )}
                          <p className="text-white/40 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-white font-semibold">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="bg-[#2d2d44] rounded-2xl p-8 mb-8">
                  <h2 className="text-lg font-semibold text-white mb-4">Shipping Address</h2>
                  <div className="text-white/70 text-sm leading-relaxed">
                    {order.shippingName && <p className="text-white font-medium">{order.shippingName}</p>}
                    <p>{order.shippingAddress}</p>
                    <p>
                      {[order.shippingCity, order.shippingState, order.shippingZip]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {order.shippingCountry && <p>{order.shippingCountry}</p>}
                  </div>
                </div>
              )}

              {/* Order Total */}
              <div className="bg-[#2d2d44] rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-base">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
