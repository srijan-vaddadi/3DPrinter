import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const body = await request.json();
  const { shippingName, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry } = body;

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);
  const shipping = 9.99;
  const tax = parseFloat((subtotal * 0.1).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  // Create order in database
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'pending',
      subtotal,
      shipping,
      tax,
      total,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.basePrice,
          color: item.color,
          size: item.size,
          material: item.material,
          engraving: item.engraving,
        })),
      },
    },
  });

  // If Stripe is configured, create a checkout session
  const stripe = getStripe();
  if (stripe) {
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: [item.color, item.size, item.material].filter(Boolean).join(' · '),
        },
        unit_amount: Math.round(item.product.basePrice * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping and tax as line items
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Shipping', description: 'Standard tracked delivery' },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,
    });
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Tax', description: 'Sales tax' },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${request.headers.get('origin')}/confirmation?orderId=${order.id}`,
      cancel_url: `${request.headers.get('origin')}/cart`,
      metadata: { orderId: order.id },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ url: checkoutSession.url, orderId: order.id });
  }

  // If Stripe not configured, simulate success (demo mode)
  await prisma.order.update({ where: { id: order.id }, data: { status: 'confirmed' } });
  await prisma.cartItem.deleteMany({ where: { userId: user.id } });

  return NextResponse.json({ url: `/confirmation?orderId=${order.id}`, orderId: order.id });
}
