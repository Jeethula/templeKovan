import {NextResponse} from 'next/server'
import prisma from '@/utils/prisma';


export async function GET() {
    try {  
      const services = await prisma.serviceAdd.findMany({
        where: {
          isActive: true,
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