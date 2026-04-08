'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const filters = ['All', 'Figurines', 'Home & Decor', 'Gadgets', 'Jewellery', 'Art'];

const filterCategoryMap: Record<string, string | null> = {
  'All': null,
  'Figurines': 'figurines',
  'Home & Decor': 'home',
  'Gadgets': 'gadgets',
  'Jewellery': 'jewellery',
  'Art': 'art',
};

const sortValueMap: Record<string, string> = {
  'popular': 'popular',
  'price-low': 'price_asc',
  'price-high': 'price_desc',
  'newest': 'newest',
  'rating': 'rating',
};

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  emoji: string;
  gradient: string;
  category: string;
  badge: string | null;
  rating: number;
  reviewCount: number;
  featured: boolean;
  colors: unknown[];
  sizes: unknown[];
  materials: unknown[];
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export default function BrowsePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProducts = async (pageNum: number, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      const category = filterCategoryMap[activeFilter];
      if (category) params.set('category', category);
      const sort = sortValueMap[sortBy];
      if (sort) params.set('sort', sort);
      params.set('page', String(pageNum));
      params.set('limit', '9');
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(prev => append ? [...prev, ...data.products] : data.products);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch {
      if (!append) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [activeFilter, sortBy]);

  return (
    <>
      <Navbar />
      <PageHeader
        title="Browse Models"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'All Models' },
        ]}
      />

      <section className="py-16 bg-light min-h-screen">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Filters & Sort */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeFilter === filter
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white text-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray/20 bg-white text-sm text-dark font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-gray text-sm font-medium">Loading models...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="flex items-center justify-center py-24">
              <p className="text-gray text-lg">No models found for this category.</p>
            </div>
          )}

          {/* Product Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-lg transition-all group"
                >
                  <div className={`h-[240px] bg-gradient-to-br ${product.gradient} flex items-center justify-center text-7xl relative`}>
                    <span className="group-hover:scale-110 transition-transform">{product.emoji}</span>
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-accent text-dark px-3 py-1 rounded-full text-xs font-bold">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-dark mb-1.5">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <span className="text-yellow-400">{renderStars(product.rating)}</span>
                      <span className="text-gray">({product.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-primary">
                        <span className="text-sm font-normal text-gray">from </span>${product.basePrice}
                      </div>
                      <span className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
                        Personalise
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More */}
          {!loading && page < totalPages && (
            <div className="text-center mt-12">
              <button
                onClick={() => fetchProducts(page + 1, true)}
                disabled={loadingMore}
                className="px-10 py-3.5 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50 cursor-pointer bg-transparent"
              >
                {loadingMore ? 'Loading...' : 'Load More Models'}
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
