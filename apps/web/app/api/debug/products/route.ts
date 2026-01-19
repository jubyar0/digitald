import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // Count all products
        const total = await prisma.product.count();

        // Count published products
        const published = await prisma.product.count({
            where: {
                status: 'PUBLISHED',
                isActive: true
            }
        });

        // Get first 5 published products with all details
        const products = await prisma.product.findMany({
            where: {
                status: 'PUBLISHED',
                isActive: true
            },
            take: 5,
            select: {
                id: true,
                name: true,
                thumbnail: true,
                images: true,
                status: true,
                isActive: true,
                vendor: {
                    select: {
                        name: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            stats: {
                total,
                published
            },
            sampleProducts: products
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
