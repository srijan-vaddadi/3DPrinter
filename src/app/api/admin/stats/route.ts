import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [totalProducts, totalOrders, totalUsers, revenueResult, recentOrders] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, email: true } },
            items: { include: { product: true } },
          },
        }),
      ]);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult._sum.total ?? 0,
      totalUsers,
      recentOrders,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
