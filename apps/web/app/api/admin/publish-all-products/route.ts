import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // Get count before
        const beforeCount = await prisma.product.count({
            where: {
                status: 'PUBLISHED',
                isActive: true
            }
        });

        // Update all products to PUBLISHED
        const result = await prisma.product.updateMany({
            data: {
                status: 'PUBLISHED',
                isActive: true
            }
        });

        // Get count after
        const afterCount = await prisma.product.count({
            where: {
                status: 'PUBLISHED',
                isActive: true
            }
        });

        return NextResponse.json({
            success: true,
            message: `Updated ${result.count} products`,
            publishedBefore: beforeCount,
            publishedAfter: afterCount
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
