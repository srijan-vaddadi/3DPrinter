import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ConfirmationPage() {
  return (
    <>
      <Navbar />
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
          <p className="text-lg font-semibold text-primary mb-6">#P3D-2026-04078</p>

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
                <span className="font-medium text-dark">April 15-18, 2026</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray">Shipping Method</span>
                <span className="font-medium text-dark">Standard Tracked</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray">Items</span>
                <span className="font-medium text-dark">3 items</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray">Total</span>
                <span className="font-bold text-primary text-lg">$140.85</span>
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
            <button className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-3 rounded-xl transition-colors">
              Track Order
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
