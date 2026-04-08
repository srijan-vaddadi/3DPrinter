import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const categories = [
  { emoji: '🧙‍♂️', name: 'Figurines & Characters', desc: 'Custom action figures, game characters, and miniatures.', count: '420+ designs', bg: 'from-[#a29bfe] to-[#6c5ce7]' },
  { emoji: '🏠', name: 'Home & Decor', desc: 'Vases, lamp shades, wall art, and decorative pieces.', count: '380+ designs', bg: 'from-[#55efc4] to-[#00b894]' },
  { emoji: '⚙️', name: 'Gadgets & Tools', desc: 'Phone stands, organisers, and practical everyday items.', count: '290+ designs', bg: 'from-[#fdcb6e] to-[#e17055]' },
  { emoji: '💎', name: 'Jewellery & Accessories', desc: 'Rings, pendants, earrings, and wearable art.', count: '210+ designs', bg: 'from-[#fd79a8] to-[#e84393]' },
  { emoji: '🎭', name: 'Art & Sculptures', desc: 'Abstract art, busts, and artistic statement pieces.', count: '180+ designs', bg: 'from-[#74b9ff] to-[#0984e3]' },
  { emoji: '📤', name: 'Upload Your Own', desc: 'Have a 3D file? Upload it and we\'ll print it for you.', count: 'Unlimited possibilities', bg: 'from-[#636e72] to-[#2d3436]', href: '/custom' },
];

const featured = [
  { emoji: '🐉', name: 'Dragon Guardian Figurine', stars: '★★★★★', reviews: 128, price: 34.99, bg: 'from-[#a29bfe] to-[#6c5ce7]', badge: 'Popular' },
  { emoji: '🌿', name: 'Geometric Plant Pot', stars: '★★★★☆', reviews: 89, price: 19.99, bg: 'from-[#55efc4] to-[#00b894]' },
  { emoji: '🏰', name: 'Medieval Castle Model', stars: '★★★★★', reviews: 64, price: 49.99, bg: 'from-[#fdcb6e] to-[#e17055]', badge: 'New' },
  { emoji: '💍', name: 'Custom Name Ring', stars: '★★★★★', reviews: 203, price: 24.99, bg: 'from-[#fd79a8] to-[#e84393]' },
];

const testimonials = [
  { text: 'The dragon figurine I ordered exceeded my expectations. The detail is incredible, and the personalised name plate was a perfect touch. Will definitely order again!', name: 'Sarah M.', role: 'Figurine Collector', initial: 'S', stars: '★★★★★' },
  { text: 'I uploaded my own design and the team printed it perfectly. The quality of the resin print was professional-grade. Great communication throughout.', name: 'James K.', role: 'Product Designer', initial: 'J', stars: '★★★★★' },
  { text: 'Ordered custom chess pieces as a gift. They were beautifully made and arrived on time. The personalisation options are fantastic — love choosing materials!', name: 'Aisha R.', role: 'Gift Buyer', initial: 'A', stars: '★★★★☆' },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-dark via-[#2d1b69] to-dark relative overflow-hidden pt-[70px]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-[3.5rem] font-extrabold text-white leading-tight mb-5">
              Your Ideas,<br/>
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Perfectly Printed</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-[500px]">
              Design, personalise, and order custom 3D printed models. From figurines to home decor, bring your imagination to life with precision printing.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/browse" className="inline-flex items-center justify-center px-9 py-4 rounded-xl font-semibold bg-accent text-dark hover:bg-[#00b8b3] hover:-translate-y-0.5 transition-all text-[1.05rem]">
                Browse Models
              </Link>
              <Link href="/custom" className="inline-flex items-center justify-center px-9 py-4 rounded-xl font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all text-[1.05rem]">
                Custom Order
              </Link>
            </div>
            <div className="flex gap-10 mt-12">
              {[{ num: '2,500+', label: 'Models Available' }, { num: '15K+', label: 'Happy Customers' }, { num: '50+', label: 'Materials' }].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold text-accent">{s.num}</div>
                  <div className="text-sm text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="w-[400px] h-[400px] bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl border border-white/10 flex flex-col items-center justify-center animate-[float_6s_ease-in-out_infinite]">
              <svg viewBox="0 0 200 200" fill="none" className="w-[200px] h-[200px]">
                <path d="M100 20L20 65v70l80 45 80-45V65L100 20z" stroke="#00cec9" strokeWidth="2" fill="none"/>
                <path d="M100 20L20 65l80 45 80-45L100 20z" fill="rgba(108,92,231,0.4)"/>
                <path d="M100 130L20 65v70l80 45V130z" fill="rgba(0,206,201,0.4)"/>
                <path d="M100 130l80-65v70l-80 45V130z" fill="rgba(162,155,254,0.4)"/>
                <circle cx="100" cy="90" r="25" fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth="1.5"/>
                <path d="M90 90l7 7 13-14" stroke="#00cec9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-white/60 mt-4 text-sm">Interactive 3D Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-3">How It Works</h2>
            <p className="text-gray max-w-[600px] mx-auto text-lg">Four simple steps to get your perfect custom 3D printed model delivered to your door.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🔍', num: 1, title: 'Choose a Design', desc: 'Browse our curated collection or upload your own 3D model file.' },
              { icon: '🎨', num: 2, title: 'Personalise It', desc: 'Pick your colour, size, material, and add custom text or engravings.' },
              { icon: '🖨️', num: 3, title: 'We Print It', desc: 'Your model is precision-printed using professional-grade 3D printers.' },
              { icon: '📦', num: 4, title: 'Delivered to You', desc: 'Carefully packaged and shipped worldwide with tracking.' },
            ].map((step) => (
              <div key={step.num} className="text-center p-10 bg-white rounded-xl shadow-md hover:-translate-y-2 transition-transform">
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xl font-extrabold flex items-center justify-center mx-auto mb-5">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-gray text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-3">Popular Categories</h2>
            <p className="text-gray max-w-[600px] mx-auto text-lg">Explore our most loved collections, each fully customisable to your taste.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href || '/browse'} className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-lg transition-all">
                <div className={`h-[220px] bg-gradient-to-br ${cat.bg} flex items-center justify-center text-7xl`}>
                  {cat.emoji}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-1.5">{cat.name}</h3>
                  <p className="text-gray text-sm mb-3">{cat.desc}</p>
                  <span className="text-sm text-primary font-semibold">{cat.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-3">Featured Models</h2>
            <p className="text-gray max-w-[600px] mx-auto text-lg">Our most popular designs, hand-picked for quality and creativity.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {featured.map((p) => (
              <Link key={p.name} href="/product" className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-lg transition-all">
                <div className={`h-[240px] bg-gradient-to-br ${p.bg} flex items-center justify-center text-7xl relative`}>
                  {p.emoji}
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-accent text-dark px-3 py-1 rounded-full text-xs font-bold">{p.badge}</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-1.5">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray">
                    <span className="text-yellow-400">{p.stars}</span>
                    <span>({p.reviews} reviews)</span>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    <span className="text-sm font-normal text-gray">from </span>${p.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/browse" className="inline-flex items-center justify-center px-7 py-3 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
              View All Models →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-dark text-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-3">What Our Customers Say</h2>
            <p className="text-white/60 max-w-[600px] mx-auto text-lg">Thousands of happy customers have brought their ideas to life with Print3D.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-dark-light rounded-xl p-8 border border-white/5">
                <div className="text-yellow-400 text-lg mb-4">{t.stars}</div>
                <p className="text-white/70 text-[0.95rem] mb-5 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[0.95rem]">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary to-accent text-center py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Create Something Amazing?</h2>
          <p className="text-white/85 mb-8 text-lg">Browse our collection or upload your own design. Your imagination is the only limit.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/browse" className="px-9 py-4 rounded-xl font-semibold bg-dark text-white hover:bg-dark-light transition-all text-[1.05rem]">
              Start Browsing
            </Link>
            <Link href="/signup" className="px-9 py-4 rounded-xl font-semibold bg-white text-primary hover:bg-white/90 transition-all text-[1.05rem]">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
