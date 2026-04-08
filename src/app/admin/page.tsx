import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, totalUsers, revenueResult, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } },
        },
      }),
    ]);

  const totalRevenue = revenueResult._sum.total ?? 0;

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-blue-500/20 text-blue-400',
    printing: 'bg-purple-500/20 text-purple-400',
    shipped: 'bg-orange-500/20 text-orange-400',
    delivered: 'bg-green-500/20 text-green-400',
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
          className="px-4 py-2.5 rounded-lg bg-[#6c5ce7]/20 text-[#6c5ce7] font-medium"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/orders"
          className="px-4 py-2.5 rounded-lg text-[#636e72] hover:text-white hover:bg-white/5 transition-colors"
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
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <Link
            href="/"
            className="text-sm text-[#00cec9] hover:underline"
          >
            View Store &rarr;
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#2d2d44] rounded-xl p-6 border border-white/5">
            <p className="text-[#636e72] text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-[#00cec9]">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="bg-[#2d2d44] rounded-xl p-6 border border-white/5">
            <p className="text-[#636e72] text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-[#6c5ce7]">{totalOrders}</p>
          </div>
          <div className="bg-[#2d2d44] rounded-xl p-6 border border-white/5">
            <p className="text-[#636e72] text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold text-white">{totalProducts}</p>
          </div>
          <div className="bg-[#2d2d44] rounded-xl p-6 border border-white/5">
            <p className="text-[#636e72] text-sm mb-1">Total Users</p>
            <p className="text-3xl font-bold text-white">{totalUsers}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#2d2d44] rounded-xl border border-white/5">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm text-[#6c5ce7] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#636e72]">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href="/admin/orders"
                          className="text-[#6c5ce7] font-mono text-sm hover:underline"
                        >
                          {order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-white text-sm">
                        {order.user.email}
                      </td>
                      <td className="px-6 py-4 text-white text-sm">
                        {order.items.length}
                      </td>
                      <td className="px-6 py-4 text-white text-sm font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[order.status] || 'bg-gray-500/20 text-gray-400'}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#636e72] text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
