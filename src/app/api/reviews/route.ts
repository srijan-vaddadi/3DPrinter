import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ reviews });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const body = await request.json();
  const { productId, rating, comment } = body;

  if (!productId || !rating || !comment) {
    return NextResponse.json(
      { error: 'productId, rating, and comment are required' },
      { status: 400 }
    );
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: 'Rating must be a number between 1 and 5' },
      { status: 400 }
    );
  }

  const review = await prisma.review.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
    update: {
      rating,
      comment,
    },
    create: {
      userId: user.id,
      productId,
      rating,
      comment,
    },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
  });

  // Update product rating and reviewCount with aggregate
  const aggregate = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count.rating,
    },
  });

  return NextResponse.json({ review });
}
