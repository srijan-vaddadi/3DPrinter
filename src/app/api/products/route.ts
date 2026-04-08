import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const sort = searchParams.get('sort');

  const where: Record<string, unknown> = {};
  if (category && category !== 'all') where.category = category;
  if (featured === 'true') where.featured = true;

  let orderBy: Record<string, string> = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { basePrice: 'asc' };
  if (sort === 'price_desc') orderBy = { basePrice: 'desc' };
  if (sort === 'rating') orderBy = { rating: 'desc' };
  if (sort === 'popular') orderBy = { reviewCount: 'desc' };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      colors: true,
      sizes: true,
      materials: true,
    },
  });

  return NextResponse.json(products);
}
