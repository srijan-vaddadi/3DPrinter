import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Dragon Guardian Figurine',
    description: 'A majestic dragon figurine standing guard over your desk or shelf. This highly detailed model features intricate scales, powerful wings, and a dynamic pose. Each piece is precision-printed and hand-finished for museum-quality detail.',
    basePrice: 34.99,
    emoji: '🐉',
    gradient: 'from-[#a29bfe] to-[#6c5ce7]',
    category: 'figurines',
    badge: 'Popular',
    rating: 4.9,
    reviewCount: 128,
    featured: true,
    colors: [
      { name: 'Royal Purple', hex: '#6c5ce7' },
      { name: 'Fire Red', hex: '#e74c3c' },
      { name: 'Shadow Black', hex: '#2d3436' },
      { name: 'Emerald Green', hex: '#00b894' },
      { name: 'Gold', hex: '#fdcb6e' },
      { name: 'Ice Blue', hex: '#0984e3' },
      { name: 'Silver', hex: '#dfe6e9' },
    ],
    sizes: [
      { name: 'Small', dimensions: '10cm', multiplier: 0.7 },
      { name: 'Medium', dimensions: '15cm', multiplier: 1.0 },
      { name: 'Large', dimensions: '22cm', multiplier: 1.5 },
      { name: 'XL', dimensions: '30cm', multiplier: 2.5 },
    ],
    materials: [
      { name: 'PLA Standard', extraCost: 0 },
      { name: 'PETG Premium', extraCost: 8 },
      { name: 'Resin HD', extraCost: 15 },
      { name: 'Nylon Pro', extraCost: 25 },
    ],
  },
  {
    name: 'Geometric Plant Pot',
    description: 'A modern geometric plant pot that adds a contemporary touch to any room. Features clean lines and a faceted design that catches light beautifully. Perfect for succulents and small plants.',
    basePrice: 19.99,
    emoji: '🌿',
    gradient: 'from-[#55efc4] to-[#00b894]',
    category: 'home',
    rating: 4.3,
    reviewCount: 89,
    featured: true,
    colors: [
      { name: 'Emerald Green', hex: '#00b894' },
      { name: 'Terracotta', hex: '#e17055' },
      { name: 'White', hex: '#dfe6e9' },
      { name: 'Black', hex: '#2d3436' },
      { name: 'Blue', hex: '#0984e3' },
    ],
    sizes: [
      { name: 'Small', dimensions: '8cm', multiplier: 0.7 },
      { name: 'Medium', dimensions: '12cm', multiplier: 1.0 },
      { name: 'Large', dimensions: '18cm', multiplier: 1.5 },
    ],
    materials: [
      { name: 'PLA Standard', extraCost: 0 },
      { name: 'PETG Premium', extraCost: 8 },
      { name: 'Resin HD', extraCost: 15 },
    ],
  },
  {
    name: 'Medieval Castle Model',
    description: 'An intricate medieval castle with towers, drawbridge, and courtyard details. A stunning display piece for history enthusiasts and tabletop gamers alike.',
    basePrice: 49.99,
    emoji: '🏰',
    gradient: 'from-[#fdcb6e] to-[#e17055]',
    category: 'figurines',
    badge: 'New',
    rating: 4.8,
    reviewCount: 64,
    featured: true,
    colors: [
      { name: 'Stone Grey', hex: '#b2bec3' },
      { name: 'Sand', hex: '#fdcb6e' },
      { name: 'White', hex: '#dfe6e9' },
      { name: 'Black', hex: '#2d3436' },
    ],
    sizes: [
      { name: 'Small', dimensions: '12cm', multiplier: 0.7 },
      { name: 'Medium', dimensions: '20cm', multiplier: 1.0 },
      { name: 'Large', dimensions: '30cm', multiplier: 1.8 },
    ],
    materials: [
      { name: 'PLA Standard', extraCost: 0 },
      { name: 'PETG Premium', extraCost: 8 },
      { name: 'Resin HD', extraCost: 15 },
      { name: 'Nylon Pro', extraCost: 25 },
    ],
  },
  {
    name: 'Custom Name Ring',
    description: 'A personalised ring featuring your name or custom text in an elegant font. Lightweight yet durable, perfect as a unique gift or personal accessory.',
    basePrice: 24.99,
    emoji: '💍',
    gradient: 'from-[#fd79a8] to-[#e84393]',
    category: 'jewellery',
    rating: 4.9,
    reviewCount: 203,
    featured: true,
    colors: [
      { name: 'Rose Gold', hex: '#fd79a8' },
      { name: 'Silver', hex: '#dfe6e9' },
      { name: 'Gold', hex: '#fdcb6e' },
      { name: 'Black', hex: '#2d3436' },
    ],
    sizes: [
      { name: 'S (16mm)', dimensions: '16mm', multiplier: 0.9 },
      { name: 'M (18mm)', dimensions: '18mm', multiplier: 1.0 },
      { name: 'L (20mm)', dimensions: '20mm', multiplier: 1.1 },
      { name: 'XL (22mm)', dimensions: '22mm', multiplier: 1.2 },
    ],
    materials: [
      { name: 'PLA Standard', extraCost: 0 },
      { name: 'Resin HD', extraCost: 15 },
      { name: 'Nylon Pro', extraCost: 25 },
    ],
  },
  {
    name: 'Retro Rocket Ship',
    description: 'A nostalgic retro-style rocket ship with vintage aesthetics. Features removable nose cone and detailed engine nozzles. Great for desk display or as a toy.',
    basePrice: 29.99,
    emoji: '🚀',
    gradient: 'from-[#74b9ff] to-[#0984e3]',
    category: 'figurines',
    badge: 'Trending',
    rating: 4.7,
    reviewCount: 156,
    colors: [
      { name: 'Classic Red', hex: '#e74c3c' },
      { name: 'Silver', hex: '#dfe6e9' },
      { name: 'Blue', hex: '#0984e3' },
      { name: 'White', hex: '#ffffff' },
    ],
    sizes: [
      { name: 'Small', dimensions: '10cm', multiplier: 0.7 },
      { name: 'Medium', dimensions: '18cm', multiplier: 1.0 },
      { name: 'Large', dimensions: '25cm', multiplier: 1.6 },
    ],
    materials: [
      { name: 'PLA Standard', extraCost: 0 },
      { name: 'PETG Premium', extraCost: 8 },
      { name: 'Resin HD', extraCost: 15 },
    ],
  },
  {
    name: 'Headphone Stand',
    description: 'A sleek minimalist headphone stand to keep your desk organised. Sturdy base with a smooth curved arm that holds any headphone style securely.',
    basePrice: 22.99,
    emoji: '🎧',
    gradient: 'from-[#636e72] to-[#2d3436]',
    category: 'gadgets',
    rating: 4.4,
    reviewCount: 72,
    colors: [
      { name: 'Black', hex: '#2d3436' },
      { name: 'White', hex: '#dfe6e9' },
      { name: 'Wood Brown', hex: '#d35400' },
      { name: 'Navy', hex: '#2c3e50' },
    ],
    sizes: [
      { name: 'Standard', dimensions: '22cm', multiplier: 1.0 },
      { name: 'Tall', dimensions: '28cm', multiplier: 1.3 },
    ],
    materials: [
      { name: 'PLA Standard', extraCost: 0 },
      { name: 'PETG Premium', extraCost: 8 },
    ],
  },
  {
    name: 'Low-Poly Lion',
    description: 'A stunning low-polygon lion sculpture that combines modern geometric art with the majesty of the king of the jungle. A real conversation starter.',
    basePrice: 39.99,
    emoji: '🦁',
    gradient: 'from-[#fab1a0] to-[#e17055]',
    category: 'art',
    rating: 4.8,
    reviewCount: 94,
    colors: [
      { name: 'Gold', hex: '#fdcb6e' },
      { name: 'Bronze', hex: '#e17055' },
      { name: 'White', hex: '#dfe6e9' },
      { name: 'Black', hex: '#2d3436' },
      { name: 'Silver', hex: '#b2bec3' },
    ],
    sizes: [
      { name: 'Small', dimensions: '10cm', multiplier: 0.7 },
      { name: 'Medium', dimensions: '18cm', multiplier: 1.0 },
      { name: 'Large', dimensions: '25cm', multiplier: 1.6 },
      { name: 'XL', dimensions: '35cm', multiplier: 2.5 },
    ],
    materials: [
      { name: 'PLA Standard', extraCost: 0 },
      { name: 'PETG Premium', extraCost: 8 },
      { name: 'Resin HD', extraCost: 15 },
    ],
  },
  {
    name: 'Architectural Bookend Set',
    description: 'A pair of architectural bookends inspired by classical columns. Keeps your books upright in style while adding a touch of sophistication to your shelf.',
    basePrice: 27.99,
    emoji: '🏛️',
    gradient: 'from-[#dfe6e9] to-[#b2bec3]',
    category: 'home',
    badge: "Editor's Pick",
    rating: 4.5,
    reviewCount: 47,
    colors: [
      { name: 'Marble White', hex: '#dfe6e9' },
      { name: 'Stone Grey', hex: '#b2bec3' },
      { name: 'Black', hex: '#2d3436' },
    ],
    sizes: [
      { name: 'Standard', dimensions: '15cm', multiplier: 1.0 },
      { name: 'Large', dimensions: '20cm', multiplier: 1.4 },
    ],
    materials: [
      { name: 'PLA Standard', extraCost: 0 },
      { name: 'PETG Premium', extraCost: 8 },
      { name: 'Resin HD', extraCost: 15 },
    ],
  },
  {
    name: 'Custom Chess Set',
    description: 'A full 32-piece chess set with beautifully designed pieces. Each piece is uniquely modelled with fine details. Board not included — perfect for collectors.',
    basePrice: 59.99,
    emoji: '♟️',
    gradient: 'from-[#ffeaa7] to-[#fdcb6e]',
    category: 'figurines',
    rating: 4.9,
    reviewCount: 185,
    colors: [
      { name: 'Classic Black & White', hex: '#2d3436' },
      { name: 'Walnut & Ivory', hex: '#d35400' },
      { name: 'Blue & Gold', hex: '#0984e3' },
    ],
    sizes: [
      { name: 'Tournament (9cm King)', dimensions: '9cm', multiplier: 1.0 },
      { name: 'Club (7cm King)', dimensions: '7cm', multiplier: 0.8 },
      { name: 'Display (12cm King)', dimensions: '12cm', multiplier: 1.5 },
    ],
    materials: [
      { name: 'PLA Standard', extraCost: 0 },
      { name: 'PETG Premium', extraCost: 8 },
      { name: 'Resin HD', extraCost: 15 },
      { name: 'Nylon Pro', extraCost: 25 },
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productMaterial.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    const { colors, sizes, materials, ...productData } = p;
    await prisma.product.create({
      data: {
        ...productData,
        colors: { create: colors },
        sizes: { create: sizes },
        materials: { create: materials },
      },
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
