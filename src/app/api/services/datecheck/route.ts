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
    const serviceDateObj = new Date(serviceDate);
    serviceDateObj.setHours(0, 0, 0, 0);
    const serviceDateString = serviceDateObj.toISOString().split('T')[0];

    try {
        console.log(serviceDateObj, nameOfTheServiceId);
        
        const count = await prisma.services.count({
            where: {
                nameOfTheServiceId,
                serviceDate: new Date(serviceDateString),
            },
        });
        const serviceLimit = await prisma.serviceAdd.findUnique({
            where:{
                id:nameOfTheServiceId
            },
            select:{
                maxCount:true
            }
        })
        if (!serviceLimit || serviceLimit.maxCount === null) {
            return NextResponse.json({ error: 'Service limit not found' }, { status: 404 });
        }
        if (count >= serviceLimit.maxCount)
        {
            return NextResponse.json({isAvailable:false}, { status: 200 });
        }
        return NextResponse.json({ isAvailable: true }, { status: 200})

    } catch (error) {
        console.error('Error checking date availability:', error);
        return NextResponse.json({ error: 'Error checking date availability' }, { status: 500 });
    }
}
