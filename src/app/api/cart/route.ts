import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

async function getUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  let user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
    });
  }
  return user;
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ items: [], count: 0 });

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return NextResponse.json({ items, count });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { productId, quantity, color, size, material, engraving } = body;

  const item = await prisma.cartItem.create({
    data: {
      userId: user.id,
      productId,
      quantity: quantity || 1,
      color,
      size,
      material,
      engraving,
    },
    include: { product: true },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, quantity } = body;

  if (!id || quantity < 1) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const item = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
    include: { product: true },
  });

  return NextResponse.json(item);
}

export async function DELETE(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('id');

  if (!itemId) {
    return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ success: true });
}
