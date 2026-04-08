'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  emoji: string;
  gradient: string;
  category: string;
  badge: string | null;
  featured: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  name: '',
  description: '',
  basePrice: '',
  emoji: '',
  gradient: 'from-purple-500 to-pink-500',
  category: '',
  badge: '',
  featured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          basePrice: parseFloat(form.basePrice),
          badge: form.badge || null,
        }),
      });

      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [newProduct, ...prev]);
        setForm(EMPTY_FORM);
        setShowForm(false);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create product');
      }
    } catch (err) {
      setError('Failed to create product');
    } finally {
      setSubmitting(false);
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
          className="px-4 py-2.5 rounded-lg text-[#636e72] hover:text-white hover:bg-white/5 transition-colors"
        >
          Orders
        </Link>
        <Link
          href="/admin/products"
          className="px-4 py-2.5 rounded-lg bg-[#6c5ce7]/20 text-[#6c5ce7] font-medium"
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
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-[#6c5ce7] hover:bg-[#6c5ce7]/80 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-[#2d2d44] rounded-xl border border-white/5 p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">New Product</h3>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#636e72] mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#1e1e2e] text-white border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6c5ce7]"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm text-[#636e72] mb-1">Category *</label>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#1e1e2e] text-white border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6c5ce7]"
                  placeholder="e.g. Figurines, Tools, Home"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#636e72] mb-1">Description *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#1e1e2e] text-white border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6c5ce7] h-20 resize-none"
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="block text-sm text-[#636e72] mb-1">Base Price ($) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={form.basePrice}
                  onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                  className="w-full bg-[#1e1e2e] text-white border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6c5ce7]"
                  placeholder="29.99"
                />
              </div>
              <div>
                <label className="block text-sm text-[#636e72] mb-1">Emoji *</label>
                <input
                  type="text"
                  required
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  className="w-full bg-[#1e1e2e] text-white border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6c5ce7]"
                  placeholder="e.g. 🎮"
                />
              </div>
              <div>
                <label className="block text-sm text-[#636e72] mb-1">Gradient *</label>
                <input
                  type="text"
                  required
                  value={form.gradient}
                  onChange={(e) => setForm({ ...form, gradient: e.target.value })}
                  className="w-full bg-[#1e1e2e] text-white border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6c5ce7]"
                  placeholder="from-purple-500 to-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm text-[#636e72] mb-1">Badge</label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full bg-[#1e1e2e] text-white border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6c5ce7]"
                  placeholder="e.g. New, Bestseller"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 accent-[#6c5ce7]"
                />
                <label htmlFor="featured" className="text-sm text-white">
                  Featured product
                </label>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#00cec9] hover:bg-[#00cec9]/80 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center text-[#636e72] py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="bg-[#2d2d44] rounded-xl border border-white/5 p-12 text-center text-[#636e72]">
            No products yet. Click &quot;Add Product&quot; to create one.
          </div>
        ) : (
          <div className="bg-[#2d2d44] rounded-xl border border-white/5 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[#636e72] text-sm border-b border-white/5">
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Badge</th>
                  <th className="px-6 py-3 font-medium">Featured</th>
                  <th className="px-6 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.emoji}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{product.name}</div>
                          <div className="text-[#636e72] text-xs truncate max-w-[200px]">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white text-sm bg-white/5 px-2.5 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white text-sm font-medium">
                      ${product.basePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {product.badge ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[#00cec9]/20 text-[#00cec9]">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-[#636e72] text-xs">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.featured ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[#636e72] text-xs">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#636e72] text-sm">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
