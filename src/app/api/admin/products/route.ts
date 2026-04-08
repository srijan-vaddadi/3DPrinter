import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        colors: true,
        sizes: true,
        materials: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Admin products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, basePrice, emoji, gradient, category, badge, featured } = body;

    if (!name || !description || basePrice == null || !emoji || !gradient || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, basePrice, emoji, gradient, category' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        basePrice: parseFloat(basePrice),
        emoji,
        gradient,
        category,
        badge: badge || null,
        featured: featured ?? false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Admin product create error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
