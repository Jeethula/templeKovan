import prisma from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { serviceDate, nameOfTheServiceId } = await req.json()
    
    if (!serviceDate) {
        return NextResponse.json({ error: 'Service date is required' }, { status: 400 });
    }
    if (!nameOfTheServiceId) {
        return NextResponse.json({ error: 'Name of the service is required' }, { status: 400 });
    }

    try {
        const startDate = new Date(serviceDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(serviceDate);
        endDate.setHours(23, 59, 59, 999);

        const count = await prisma.services.count({
            where: {
                nameOfTheServiceId,
                serviceDate: {
                    gte: startDate,
                    lte: endDate
                },
            },
        });

        const serviceLimit = await prisma.serviceAdd.findUnique({
            where: {
                id: nameOfTheServiceId
            },
            select: {
                maxCount: true
            }
        });

        if (!serviceLimit || serviceLimit.maxCount === null) {
            return NextResponse.json({ error: 'Service limit not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            isAvailable: count < serviceLimit.maxCount 
        }, { status: 200 });

    } catch (error) {
        console.error('Error checking date availability:', error);
        return NextResponse.json({ error: 'Error checking date availability' }, { status: 500 });
    }
}
