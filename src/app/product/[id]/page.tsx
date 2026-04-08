'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

interface ProductSize {
  id: string;
  name: string;
  dimensions: string;
  multiplier: number;
}

interface ProductMaterial {
  id: string;
  name: string;
  extraCost: number;
}

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
  colors: ProductColor[];
  sizes: ProductSize[];
  materials: ProductMaterial[];
}

interface RelatedProduct {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  basePrice: number;
  badge: string | null;
  rating: number;
  reviewCount: number;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [engraving, setEngraving] = useState('');
  const [instructions, setInstructions] = useState('');
  const [activeThumb, setActiveThumb] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product data
  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProduct(data);

        // Set defaults from fetched data
        if (data.colors?.length > 0) setSelectedColor(data.colors[0].hex);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0].name);
        if (data.materials?.length > 0) setSelectedMaterial(data.materials[0].name);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (!id) return;

    async function fetchRelated() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const products = Array.isArray(data) ? data : data.products ?? [];
        const filtered = products
          .filter((p: RelatedProduct) => p.id !== id)
          .slice(0, 3);
        setRelatedProducts(filtered);
      } catch {
        // silently fail for related products
      }
    }

    fetchRelated();
  }, [id]);

  // Price calculation
  const sizeObj = product?.sizes?.find((s) => s.name === selectedSize);
  const materialObj = product?.materials?.find((m) => m.name === selectedMaterial);
  const sizeMultiplier = sizeObj?.multiplier ?? 1;
  const materialExtra = materialObj?.extraCost ?? 0;
  const basePrice = product?.basePrice ?? 0;
  const unitTotal = basePrice * sizeMultiplier + materialExtra;
  const total = unitTotal * quantity;

  async function handleAddToCart() {
    if (!product || addingToCart) return;
    setAddingToCart(true);
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          color: selectedColor,
          size: selectedSize,
          material: selectedMaterial,
          quantity,
          engraving: engraving || undefined,
          instructions: instructions || undefined,
        }),
      });
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    await handleAddToCart();
    router.push('/checkout');
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-light min-h-screen pt-[90px]">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-gray text-lg">Loading product...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Not found state
  if (notFound || !product) {
    return (
      <>
        <Navbar />
        <div className="bg-light min-h-screen pt-[90px]">
          <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
            <div className="text-8xl mb-6">🔍</div>
            <h1 className="text-3xl font-extrabold text-dark mb-4">Product Not Found</h1>
            <p className="text-gray mb-8 max-w-md mx-auto">
              Sorry, we couldn&apos;t find the product you&apos;re looking for. It may have been removed or the link is incorrect.
            </p>
            <Link
              href="/browse"
              className="inline-block px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Parse gradient classes
  const gradientClass = product.gradient || 'from-[#a29bfe] to-[#6c5ce7]';

  // Generate star string from rating
  const fullStars = Math.round(product.rating);
  const starsStr = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

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
            <span>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-12 bg-light">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Gallery */}
            <div>
              <div className={`h-[420px] bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center text-[120px] mb-4 shadow-lg relative`}>
                {product.emoji}
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-accent text-dark px-3 py-1 rounded-full text-xs font-bold">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`h-[90px] rounded-xl bg-gradient-to-br ${gradientClass.replace(']', ']/60').replace(/to-\[/, 'to-[').split(' ').map(c => c.includes('/60') ? c : c + '/60').join(' ')} flex items-center justify-center text-3xl transition-all ${
                      activeThumb === i
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {product.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div>
              <h1 className="text-3xl font-extrabold text-dark mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-yellow-400 text-lg">{starsStr}</span>
                <span className="text-sm text-gray">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              <div className="text-3xl font-extrabold text-primary mb-5">
                <span className="text-base font-normal text-gray">from </span>${product.basePrice.toFixed(2)}
              </div>

              <p className="text-gray leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Personalisation */}
              <div className="space-y-7">

                {/* Colour */}
                {product.colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Colour</h3>
                    <div className="flex gap-3 flex-wrap">
                      {product.colors.map((c) => (
                        <button
                          key={c.id}
                          title={c.name}
                          onClick={() => setSelectedColor(c.hex)}
                          className={`w-9 h-9 rounded-full transition-all ${
                            selectedColor === c.hex
                              ? 'ring-2 ring-primary ring-offset-2 scale-110'
                              : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size */}
                {product.sizes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Size</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {product.sizes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSize(s.name)}
                          className={`py-3 rounded-xl text-center transition-all border ${
                            selectedSize === s.name
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray/20 bg-white text-dark hover:border-primary/40'
                          }`}
                        >
                          <div className="font-bold text-sm">{s.name}</div>
                          <div className="text-xs text-gray">{s.dimensions}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Material */}
                {product.materials.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Material</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {product.materials.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMaterial(m.name)}
                          className={`py-3 px-4 rounded-xl text-left transition-all border ${
                            selectedMaterial === m.name
                              ? 'border-primary bg-primary/10'
                              : 'border-gray/20 bg-white hover:border-primary/40'
                          }`}
                        >
                          <div className="font-bold text-sm text-dark">{m.name}</div>
                          <div className="text-xs text-accent font-semibold">
                            {m.extraCost === 0 ? 'Included' : `+$${m.extraCost}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
                    <span className="text-dark font-medium">${basePrice.toFixed(2)}</span>
                  </div>
                  {materialObj && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray">Material ({materialObj.name})</span>
                      <span className="text-dark font-medium">+${materialExtra.toFixed(2)}</span>
                    </div>
                  )}
                  {sizeObj && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray">Size ({sizeObj.name})</span>
                      <span className="text-dark font-medium">x{sizeMultiplier}</span>
                    </div>
                  )}
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
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 py-4 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all text-center disabled:opacity-50"
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="flex-1 py-4 rounded-xl font-semibold bg-accent text-dark hover:bg-[#00b8b3] transition-all text-center disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-2xl font-extrabold text-dark mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="bg-light rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-lg transition-all"
                >
                  <div className={`h-[220px] bg-gradient-to-br ${p.gradient || 'from-[#a29bfe] to-[#6c5ce7]'} flex items-center justify-center text-7xl relative`}>
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
                      <span className="text-yellow-400">{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}</span>
                      <span className="text-gray">({p.reviewCount} reviews)</span>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      <span className="text-sm font-normal text-gray">from </span>${p.basePrice}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
