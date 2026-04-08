'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  color: string | null;
  size: string | null;
  material: string | null;
  engraving: string | null;
  product: { id: string; name: string; emoji: string; gradient: string };
}

interface Order {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  printing: 'bg-purple-500/20 text-purple-400',
  shipped: 'bg-orange-500/20 text-orange-400',
  delivered: 'bg-green-500/20 text-green-400',
};

export default function OrdersPage() {
  const { status: authStatus } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetch('/api/orders')
        .then((r) => r.json())
        .then((d) => { setOrders(d.orders || []); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (authStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [authStatus]);

  if (authStatus === 'unauthenticated') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-light flex items-center justify-center pt-[70px]">
          <div className="text-center">
            <p className="text-5xl mb-4">📦</p>
            <h1 className="text-2xl font-bold mb-2">Sign in to view your orders</h1>
            <p className="text-gray mb-6">Track your 3D prints and order history</p>
            <Link href="/signin" className="inline-block bg-primary hover:bg-primary/80 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
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
      <main className="min-h-screen bg-light pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray mb-8">{loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}</p>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">📦</p>
              <p className="text-xl text-gray mb-6">No orders yet</p>
              <Link href="/browse" className="inline-block bg-primary hover:bg-primary/80 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Order Header */}
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full p-6 flex items-center justify-between cursor-pointer bg-transparent border-none text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.product.gradient} flex items-center justify-center text-lg border-2 border-white`}>
                            {item.product.emoji}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold border-2 border-white">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-dark">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-gray">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-200 text-gray'}`}>
                        {order.status}
                      </span>
                      <span className="font-bold text-primary text-lg">${order.total.toFixed(2)}</span>
                      <span className="text-gray text-xl">{expandedOrder === order.id ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-100 p-6">
                      <div className="space-y-3 mb-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.product.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                              {item.product.emoji}
                            </div>
                            <div className="flex-1">
                              <Link href={`/product/${item.product.id}`} className="font-semibold hover:text-primary transition-colors">
                                {item.product.name}
                              </Link>
                              <div className="flex gap-2 mt-1">
                                {item.color && <span className="text-xs bg-light text-gray px-2 py-0.5 rounded-full">{item.color}</span>}
                                {item.size && <span className="text-xs bg-light text-gray px-2 py-0.5 rounded-full">{item.size}</span>}
                                {item.material && <span className="text-xs bg-light text-gray px-2 py-0.5 rounded-full">{item.material}</span>}
                              </div>
                              {item.engraving && <p className="text-xs text-gray mt-1 italic">&ldquo;{item.engraving}&rdquo;</p>}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                              <p className="text-xs text-gray">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-light rounded-xl p-4">
                        <div className="flex justify-between text-sm text-gray"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm text-gray mt-1"><span>Shipping</span><span>${order.shipping.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm text-gray mt-1"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                          <span>Total</span><span className="text-primary">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
