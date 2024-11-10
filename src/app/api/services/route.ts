import { NextResponse } from 'next/server'
import prisma from '@/utils/prisma';

export async function GET(request: Request) {
    try {
        // Get period from URL params
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period');

        // Calculate date range
        const now = new Date();
        let startDate = now;
        
        if (period === 'weekly') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (period === 'monthly') {
            startDate = new Date(now.setDate(now.getDate() - 30));
        }

        const services = await prisma.serviceAdd.findMany({
            where: {
                isActive: true,
                ...(period && {
                    createdAt: {
                        gte: startDate,
                        lte: new Date()
                    }
                })
            },
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}