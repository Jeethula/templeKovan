import prisma from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { serviceDate, nameOfTheService } = await req.json();
    if (!serviceDate) {
        return NextResponse.json({ error: 'Service date is required' }, { status: 400 });
    }
    if (!nameOfTheService) {
        return NextResponse.json({ error: 'Name of the service is required' }, { status: 400 });
    }
    const serviceDateObj = new Date(serviceDate);
    serviceDateObj.setHours(0, 0, 0, 0);
    const serviceDateString = serviceDateObj.toISOString().split('T')[0];

    try {
        console.log(serviceDateObj, nameOfTheService);
        
        const count = await prisma.services.count({
            where: {
                nameOfTheService,
                serviceDate: new Date(serviceDateString),
            },
        });
        
        const serviceLimit = await prisma.serviceLimit.findMany({});

        if (nameOfTheService === 'thirumanjanam') {
            if (count < serviceLimit[0].thirumanjanam) {
                return NextResponse.json({ isAvailable: true }, { status: 200 });
            } else {
                return NextResponse.json({ isAvailable: false }, { status: 200 });
            }
        } else if (nameOfTheService === 'abhisekam') {
            if (count < serviceLimit[0].abhisekam) {
                return NextResponse.json({ isAvailable: true }, { status: 200 });
            } else {
                return NextResponse.json({ isAvailable: false }, { status: 200 });
            }
        }

        if (count < 3) {
            return NextResponse.json({ isAvailable: true }, { status: 200 });
        } else {
            return NextResponse.json({ isAvailable: false }, { status: 200 });
        }
    } catch (error) {
        console.error('Error checking date availability:', error);
        return NextResponse.json({ error: 'Error checking date availability' }, { status: 500 });
    }
}
