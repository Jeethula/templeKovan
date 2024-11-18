// /app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { validateDateRange, validateReportType, getDateRange } from '@/lib/utils';


export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get('reportType');
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    const posUserId = searchParams.get('posUserId');

    if (!reportType || !date) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate report type
    validateReportType(reportType);

    // Calculate date range
    const { startDate, endDate } = getDateRange(reportType, new Date(date));
    console.log('startDate:', startDate, 'endDate:', endDate,"===================.............");

    // Validate date range
    validateDateRange(startDate, endDate);
    console.log('startDate:', startDate, 'endDate:', endDate,".............");

    // Build where clause
    const whereClause: {
      serviceDate: { gte: Date; lte: Date };
      nameOfTheServiceId?: string;
      posUserId?: string;
    } = {
      serviceDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (serviceId) {
      whereClause.nameOfTheServiceId = serviceId;
    }
    if (posUserId) {
      whereClause.posUserId = posUserId;
    }

    // Fetch services with related data
    const services = await prisma.services.findMany({
      where: whereClause,
      include: {
        nameOfTheService: true,
        posUser: {
          select: {
            email: true,
            personalInfo: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        serviceDate: 'desc',
      },
    });

    // Calculate statistics
    const totalAmount = services.reduce((sum, service) => sum + service.price, 0);
    const totalServices = services.length;

    return NextResponse.json({
      services,
      totalAmount,
      totalServices,
      dateRange: {
        startDate,
        endDate,
      },
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}