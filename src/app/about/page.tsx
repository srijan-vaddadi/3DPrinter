import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

const stats = [
  { value: '15,000+', label: 'Happy Customers' },
  { value: '50,000+', label: 'Models Printed' },
  { value: '50+', label: 'Materials Available' },
  { value: '4.9/5', label: 'Customer Rating' },
];

const values = [
  {
    emoji: '🏆',
    title: 'Quality First',
    gradient: 'from-primary to-purple-400',
    description:
      'Every print is inspected by our quality team before shipping. We use industrial-grade printers and premium materials to ensure the highest standards.',
  },
  {
    emoji: '🌿',
    title: 'Sustainability',
    gradient: 'from-accent to-emerald-400',
    description:
      'We use biodegradable PLA as our default material, minimize waste through optimized print layouts, and offset our carbon footprint with every order.',
  },
  {
    emoji: '🤝',
    title: 'Community',
    gradient: 'from-orange-400 to-pink-400',
    description:
      'We support makers, designers, and engineers worldwide. Our open community shares designs, tips, and inspiration to push the boundaries of 3D printing.',
  },
];

const team = [
  {
    emoji: '👨‍💼',
    name: 'Alex Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former mechanical engineer with a passion for democratizing manufacturing. 15+ years in additive manufacturing.',
  },
  {
    emoji: '👩‍🎨',
    name: 'Maya Patel',
    role: 'Head of Design',
    bio: 'Award-winning industrial designer who ensures every print meets the highest aesthetic and functional standards.',
  },
  {
    emoji: '👨‍🔬',
    name: 'Tom Wilson',
    role: 'Lab Manager',
    bio: 'Materials science expert overseeing our print farm of 200+ printers. Obsessed with print quality and consistency.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageHeader title="About Print3D" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      <main className="bg-light">
        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Making 3D Printing Personal
            </h2>
            <p className="text-lg text-gray leading-relaxed">
              At Print3D, we believe everyone should have access to high-quality 3D printing.
              Whether you&apos;re a hobbyist bringing your first design to life, an engineer
              prototyping the next big thing, or a business scaling production -- we&apos;re here
              to make it happen. Founded in 2020, we&apos;ve grown from a small garage operation
              to one of the most trusted names in online 3D printing, serving customers in over
              40 countries worldwide.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-dark py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-dark text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className={`bg-gradient-to-r ${value.gradient} p-6 text-center`}>
                    <span className="text-5xl">{value.emoji}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-dark mb-3">{value.title}</h3>
                    <p className="text-gray leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-dark text-center mb-4">Meet Our Team</h2>
            <p className="text-gray text-center mb-12 max-w-2xl mx-auto">
              The passionate people behind every perfect print
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-light rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">{member.emoji}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Printing?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join thousands of makers and bring your ideas to life with Print3D.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/browse"
                className="bg-white text-primary font-semibold px-8 py-4 rounded-xl hover:bg-light transition-colors"
              >
                Browse Models
              </Link>
              <Link
                href="/custom"
                className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
              >
                Custom Order
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
