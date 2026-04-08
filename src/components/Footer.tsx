import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white/60 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="text-xl font-extrabold text-white mb-3">
              Print<span className="text-accent">3D</span>
            </div>
            <p className="text-sm leading-relaxed">
              Premium custom 3D printing service. From concept to creation, we bring your ideas to life with precision and care.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/browse" className="hover:text-accent transition-colors">All Models</Link></li>
              <li><Link href="/browse" className="hover:text-accent transition-colors">Figurines</Link></li>
              <li><Link href="/browse" className="hover:text-accent transition-colors">Home Decor</Link></li>
              <li><Link href="/custom" className="hover:text-accent transition-colors">Custom Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="#" className="hover:text-accent transition-colors">Help Centre</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Shipping Info</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Returns</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-sm">
          <p>&copy; 2026 Print3D. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
