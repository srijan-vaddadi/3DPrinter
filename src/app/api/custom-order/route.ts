import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email: session.user.email, name: session.user.name, image: session.user.image },
    });
  }

  const body = await request.json();
  const { projectName, material, color, quality, infill, scale, quantity, notes, fileName } = body;

  // Create a custom product entry
  const product = await prisma.product.create({
    data: {
      name: projectName || 'Custom 3D Print',
      description: `Custom order: ${material} | ${quality} quality | ${infill} infill | ${scale}% scale${notes ? ` | Notes: ${notes}` : ''}${fileName ? ` | File: ${fileName}` : ''}`,
      basePrice: 29.99, // Base price for custom prints, adjusted by quote
      emoji: '📤',
      gradient: 'from-[#636e72] to-[#2d3436]',
      category: 'custom',
      badge: 'Custom',
    },
  });

  // Add to cart
  const cartItem = await prisma.cartItem.create({
    data: {
      userId: user.id,
      productId: product.id,
      quantity: quantity || 1,
      color,
      size: `${quality} | ${infill} infill | ${scale}%`,
      material,
    },
    include: { product: true },
  });

  return NextResponse.json(cartItem, { status: 201 });
}
