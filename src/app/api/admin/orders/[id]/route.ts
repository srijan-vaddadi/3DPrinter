import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const VALID_STATUSES = ['pending', 'confirmed', 'printing', 'shipped', 'delivered'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Admin order update error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
