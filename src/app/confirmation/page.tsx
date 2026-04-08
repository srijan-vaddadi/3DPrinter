'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface OrderData {
  id: string;
  total: number;
  createdAt: string;
  items: { id: string; product: { name: string } }[];
}

function formatDeliveryRange(createdAt: string): string {
  const created = new Date(createdAt);
  const start = new Date(created);
  start.setDate(start.getDate() + 7);
  const end = new Date(created);
  end.setDate(end.getDate() + 10);

  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', opts);
  const endStr = end.toLocaleDateString('en-US', opts);

  // If same month & year, abbreviate
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
  }
  return `${startStr} - ${endStr}`;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(!!orderId);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-light flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-16 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray">Loading order details...</p>
        </div>
      </main>
    );
  }

  const orderNumber = order ? `#P3D-${order.id.substring(0, 8).toUpperCase()}` : '#P3D-XXXXXXXX';
  const totalDisplay = order ? `$${order.total.toFixed(2)}` : '--';
  const itemCount = order ? `${order.items.length} item${order.items.length !== 1 ? 's' : ''}` : '--';
  const deliveryRange = order ? formatDeliveryRange(order.createdAt) : '--';

  return (
    <main className="min-h-screen bg-light flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-16 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-dark mb-2">Order Confirmed!</h1>
        <p className="text-gray mb-2">Order Number</p>
        <p className="text-lg font-semibold text-primary mb-6">{orderNumber}</p>

        {/* Thank You */}
        <p className="text-gray mb-8">
          Thank you for your order! We&apos;ve received your request and our team is already
          preparing your 3D prints. You&apos;ll receive an email confirmation shortly with
          tracking details.
        </p>

        {/* Details Box */}
        <div className="bg-light rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-dark mb-4 text-center">Order Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray">Estimated Print Time</span>
              <span className="font-medium text-dark">3-5 Business Days</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between">
              <span className="text-gray">Estimated Delivery</span>
              <span className="font-medium text-dark">{deliveryRange}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between">
              <span className="text-gray">Shipping Method</span>
              <span className="font-medium text-dark">Standard Tracked</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between">
              <span className="text-gray">Items</span>
              <span className="font-medium text-dark">{itemCount}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between">
              <span className="text-gray">Total</span>
              <span className="font-bold text-primary text-lg">{totalDisplay}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors text-center"
          >
            Continue Shopping
          </Link>
          {!error && (
            <button className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-3 rounded-xl transition-colors">
              Track Order
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className="min-h-screen bg-light flex items-center justify-center px-4 py-20">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-16 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray">Loading...</p>
            </div>
          </main>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </>
  );
}
