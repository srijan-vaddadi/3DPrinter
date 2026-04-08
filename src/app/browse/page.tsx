'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const filters = ['All', 'Figurines', 'Home & Decor', 'Gadgets', 'Jewellery', 'Art'];

const products = [
  { emoji: '🐉', name: 'Dragon Guardian Figurine', stars: '★★★★★', reviews: 128, price: 34.99, bg: 'from-[#a29bfe] to-[#6c5ce7]', badge: 'Popular' },
  { emoji: '🌿', name: 'Geometric Plant Pot', stars: '★★★★☆', reviews: 89, price: 19.99, bg: 'from-[#55efc4] to-[#00b894]' },
  { emoji: '🏰', name: 'Medieval Castle Model', stars: '★★★★★', reviews: 64, price: 49.99, bg: 'from-[#fdcb6e] to-[#e17055]', badge: 'New' },
  { emoji: '💍', name: 'Custom Name Ring', stars: '★★★★★', reviews: 203, price: 24.99, bg: 'from-[#fd79a8] to-[#e84393]' },
  { emoji: '🚀', name: 'Retro Rocket Ship', stars: '★★★★☆', reviews: 76, price: 29.99, bg: 'from-[#74b9ff] to-[#0984e3]', badge: 'Trending' },
  { emoji: '🎧', name: 'Custom Headphone Stand', stars: '★★★★☆', reviews: 112, price: 22.99, bg: 'from-[#636e72] to-[#2d3436]' },
  { emoji: '🦁', name: 'Lion King Sculpture', stars: '★★★★★', reviews: 95, price: 39.99, bg: 'from-[#f9ca24] to-[#f0932b]' },
  { emoji: '🏛️', name: 'Greek Column Bookend', stars: '★★★★☆', reviews: 58, price: 27.99, bg: 'from-[#badc58] to-[#6ab04c]', badge: "Editor's Pick" },
  { emoji: '♟️', name: 'Custom Chess Set', stars: '★★★★★', reviews: 147, price: 59.99, bg: 'from-[#9b59b6] to-[#8e44ad]' },
];

export default function BrowsePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

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

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {products.map((product) => (
              <Link
                key={product.name}
                href="/product"
                className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-lg transition-all group"
              >
                <div className={`h-[240px] bg-gradient-to-br ${product.bg} flex items-center justify-center text-7xl relative`}>
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
                    <span className="text-yellow-400">{product.stars}</span>
                    <span className="text-gray">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-primary">
                      <span className="text-sm font-normal text-gray">from </span>${product.price}
                    </div>
                    <span className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
                      Personalise
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-10 py-3.5 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
              Load More Models
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
