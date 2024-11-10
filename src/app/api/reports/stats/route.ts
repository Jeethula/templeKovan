import {NextResponse,NextRequest} from 'next/server'
import prisma from '@/utils/prisma';
import { validateDateRange } from '@/lib/utils';

export async function GET(request: NextRequest) {
    try {

  
      const searchParams = request.nextUrl.searchParams;
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
  
      if (!startDate || !endDate) {
        return NextResponse.json(
          { error: 'Start and end dates are required' },
          { status: 400 }
        );
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      validateDateRange(start, end);
  
      // Get service statistics
      const serviceStats = await prisma.services.groupBy({
        by: ['nameOfTheServiceId', 'status'],
        where: {
          serviceDate: {
            gte: start,
            lte: end,
          },
        },
        _count: {
          _all: true,
        },
        _sum: {
          price: true,
        },
      });
  
      // Get POS user performance
      const posUserStats = await prisma.services.groupBy({
        by: ['posUserId'],
        where: {
          serviceDate: {
            gte: start,
            lte: end,
          },
          status: 'COMPLETED',
        },
        _count: {
          _all: true,
        },
        _sum: {
          price: true,
        },
      });
  
      return NextResponse.json({
        serviceStats,
        posUserStats,
      });
  
    } catch (error) {
      console.error('Error generating statistics:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 500 }
      );
    }
  }