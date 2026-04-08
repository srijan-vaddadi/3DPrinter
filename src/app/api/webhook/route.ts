import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  const stripe = getStripe();
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET || !stripe) {
    return NextResponse.json({ error: 'Missing signature or Stripe not configured' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'confirmed', paymentMethod: 'stripe' },
      });
    }
  }

  return NextResponse.json({ received: true });
}
