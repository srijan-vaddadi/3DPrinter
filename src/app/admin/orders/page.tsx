'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  color: string | null;
  size: string | null;
  material: string | null;
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
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  items: OrderItem[];
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'printing', 'shipped', 'delivered'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  printing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  shipped: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = filterStatus
        ? `/api/admin/orders?status=${filterStatus}`
        : '/api/admin/orders';
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? updated : o))
        );
      }
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e2e] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2d2d44] border-r border-white/10 p-6 flex flex-col gap-2">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Print3D</h1>
          <p className="text-sm text-[#636e72]">Admin Panel</p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2.5 rounded-lg text-[#636e72] hover:text-white hover:bg-white/5 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/orders"
          className="px-4 py-2.5 rounded-lg bg-[#6c5ce7]/20 text-[#6c5ce7] font-medium"
        >
          Orders
        </Link>
        <Link
          href="/admin/products"
          className="px-4 py-2.5 rounded-lg text-[#636e72] hover:text-white hover:bg-white/5 transition-colors"
        >
          Products
        </Link>
        <div className="mt-auto">
          <Link
            href="/"
            className="px-4 py-2.5 rounded-lg text-[#00cec9] hover:bg-[#00cec9]/10 transition-colors flex items-center gap-2"
          >
            &larr; Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Orders</h2>
          <div className="flex items-center gap-3">
            <label className="text-sm text-[#636e72]">Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#2d2d44] text-white text-sm border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[#6c5ce7]"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-[#2d2d44] rounded-xl border border-white/5 overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center text-[#636e72]">Loading orders...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-[#636e72] text-sm border-b border-white/5">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Items</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#636e72]">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-[#6c5ce7] font-mono text-sm">
                          {order.id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm">{order.user.name || 'N/A'}</div>
                        <div className="text-[#636e72] text-xs">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {order.items.map((item) => (
                            <span key={item.id} className="text-white text-sm">
                              {item.product.emoji} {item.product.name} x{item.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white text-sm font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`text-xs font-medium capitalize rounded-full px-3 py-1.5 border outline-none cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="bg-[#2d2d44] text-white">
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-[#636e72] text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
