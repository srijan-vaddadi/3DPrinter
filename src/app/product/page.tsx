'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const colors = [
  { name: 'Royal Purple', value: '#6c5ce7' },
  { name: 'Dragon Red', value: '#e74c3c' },
  { name: 'Forest Green', value: '#00b894' },
  { name: 'Ocean Blue', value: '#0984e3' },
  { name: 'Midnight Black', value: '#2d3436' },
  { name: 'Cloud White', value: '#dfe6e9' },
  { name: 'Sunset Gold', value: '#fdcb6e' },
];

const sizes = [
  { label: 'Small', detail: '10cm', modifier: -5 },
  { label: 'Medium', detail: '15cm', modifier: 0 },
  { label: 'Large', detail: '22cm', modifier: 12 },
  { label: 'XL', detail: '30cm', modifier: 25 },
];

const materials = [
  { name: 'PLA Standard', extra: 0, tag: 'Included' },
  { name: 'PETG', extra: 8, tag: '+$8' },
  { name: 'Resin HD', extra: 15, tag: '+$15' },
  { name: 'Nylon Pro', extra: 25, tag: '+$25' },
];

const relatedProducts = [
  { emoji: '🦁', name: 'Lion King Sculpture', stars: '★★★★★', reviews: 95, price: 39.99, bg: 'from-[#f9ca24] to-[#f0932b]' },
  { emoji: '🏰', name: 'Medieval Castle Model', stars: '★★★★★', reviews: 64, price: 49.99, bg: 'from-[#fdcb6e] to-[#e17055]', badge: 'New' },
  { emoji: '♟️', name: 'Custom Chess Set', stars: '★★★★★', reviews: 147, price: 59.99, bg: 'from-[#9b59b6] to-[#8e44ad]' },
];

const BASE_PRICE = 34.99;

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState('#6c5ce7');
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedMaterial, setSelectedMaterial] = useState('PLA Standard');
  const [quantity, setQuantity] = useState(1);
  const [engraving, setEngraving] = useState('');
  const [instructions, setInstructions] = useState('');
  const [activeThumb, setActiveThumb] = useState(0);

  const sizeObj = sizes.find((s) => s.label === selectedSize)!;
  const materialObj = materials.find((m) => m.name === selectedMaterial)!;
  const sizeModifier = sizeObj.modifier;
  const materialExtra = materialObj.extra;
  const unitTotal = BASE_PRICE + sizeModifier + materialExtra;
  const total = unitTotal * quantity;

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-dark pt-[90px] pb-4">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Link href="/" className="text-white/70 hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href="/browse" className="text-white/70 hover:text-accent transition-colors">Browse</Link>
            <span>/</span>
            <span>Dragon Guardian Figurine</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-12 bg-light">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Gallery */}
            <div>
              <div className="h-[420px] bg-gradient-to-br from-[#a29bfe] to-[#6c5ce7] rounded-2xl flex items-center justify-center text-[120px] mb-4 shadow-lg">
                🐉
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`h-[90px] rounded-xl bg-gradient-to-br from-[#a29bfe]/60 to-[#6c5ce7]/60 flex items-center justify-center text-3xl transition-all ${
                      activeThumb === i
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    🐉
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div>
              <h1 className="text-3xl font-extrabold text-dark mb-3">Dragon Guardian Figurine</h1>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-yellow-400 text-lg">★★★★★</span>
                <span className="text-sm text-gray">4.9 (128 reviews)</span>
              </div>

              <div className="text-3xl font-extrabold text-primary mb-5">
                <span className="text-base font-normal text-gray">from </span>${BASE_PRICE}
              </div>

              <p className="text-gray leading-relaxed mb-8">
                A stunningly detailed dragon figurine, standing guard with wings spread wide.
                Each scale is individually rendered for maximum realism. Perfect as a desk
                centrepiece, gift for fantasy lovers, or addition to your miniature collection.
                Fully customisable with your choice of colour, size, material, and personal engraving.
              </p>

              {/* Personalisation */}
              <div className="space-y-7">

                {/* Colour */}
                <div>
                  <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Colour</h3>
                  <div className="flex gap-3">
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        title={c.name}
                        onClick={() => setSelectedColor(c.value)}
                        className={`w-9 h-9 rounded-full transition-all ${
                          selectedColor === c.value
                            ? 'ring-2 ring-primary ring-offset-2 scale-110'
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Size</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {sizes.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => setSelectedSize(s.label)}
                        className={`py-3 rounded-xl text-center transition-all border ${
                          selectedSize === s.label
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray/20 bg-white text-dark hover:border-primary/40'
                        }`}
                      >
                        <div className="font-bold text-sm">{s.label}</div>
                        <div className="text-xs text-gray">{s.detail}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div>
                  <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Material</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {materials.map((m) => (
                      <button
                        key={m.name}
                        onClick={() => setSelectedMaterial(m.name)}
                        className={`py-3 px-4 rounded-xl text-left transition-all border ${
                          selectedMaterial === m.name
                            ? 'border-primary bg-primary/10'
                            : 'border-gray/20 bg-white hover:border-primary/40'
                        }`}
                      >
                        <div className="font-bold text-sm text-dark">{m.name}</div>
                        <div className="text-xs text-accent font-semibold">{m.tag}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Engraving */}
                <div>
                  <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Custom Engraving</h3>
                  <input
                    type="text"
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value)}
                    placeholder="Enter text to engrave (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-gray/20 bg-white text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-gray/50"
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Special Instructions</h3>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Any special requests or notes for your order (optional)"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray/20 bg-white text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-gray/50 resize-none"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Quantity</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 rounded-xl bg-white border border-gray/20 text-dark text-xl font-bold hover:bg-primary/10 hover:border-primary/40 transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-11 rounded-xl border border-gray/20 text-center text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-11 h-11 rounded-xl bg-white border border-gray/20 text-dark text-xl font-bold hover:bg-primary/10 hover:border-primary/40 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-xl border border-gray/20 p-5 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray">Base price</span>
                    <span className="text-dark font-medium">${BASE_PRICE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray">Material ({materialObj.name})</span>
                    <span className="text-dark font-medium">+${materialExtra.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray">Size modifier ({sizeObj.label})</span>
                    <span className="text-dark font-medium">{sizeModifier >= 0 ? '+' : ''}${sizeModifier.toFixed(2)}</span>
                  </div>
                  {quantity > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray">Quantity</span>
                      <span className="text-dark font-medium">x{quantity}</span>
                    </div>
                  )}
                  <div className="border-t border-gray/10 pt-2.5 flex justify-between">
                    <span className="font-bold text-dark">Total</span>
                    <span className="text-xl font-extrabold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Link
                    href="/cart"
                    className="flex-1 py-4 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all text-center"
                  >
                    Add to Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="flex-1 py-4 rounded-xl font-semibold bg-accent text-dark hover:bg-[#00b8b3] transition-all text-center"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-dark mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
            {relatedProducts.map((p) => (
              <Link
                key={p.name}
                href="/product"
                className="bg-light rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-lg transition-all"
              >
                <div className={`h-[220px] bg-gradient-to-br ${p.bg} flex items-center justify-center text-7xl relative`}>
                  {p.emoji}
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-accent text-dark px-3 py-1 rounded-full text-xs font-bold">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-dark mb-1.5">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <span className="text-yellow-400">{p.stars}</span>
                    <span className="text-gray">({p.reviews} reviews)</span>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    <span className="text-sm font-normal text-gray">from </span>${p.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
