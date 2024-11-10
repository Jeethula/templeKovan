import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { validateDateRange,convertToCSV } from '@/lib/utils';

export async function GET(request: NextRequest) {
    try {

      const searchParams = request.nextUrl.searchParams;
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const format = searchParams.get('format') || 'json';
  
      if (!startDate || !endDate) {
        return NextResponse.json(
          { error: 'Start and end dates are required' },
          { status: 400 }
        );
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      validateDateRange(start, end);
  
      const services = await prisma.services.findMany({
        where: {
          serviceDate: {
            gte: start,
            lte: end,
          },
        },
        include: {
          nameOfTheService: true,
          posUser: {
            select: {
              email: true,
              personalInfo: true,
            },
          },
          User: {
            select: {
              email: true,
              personalInfo: true,
            },
          },
        },
        orderBy: {
          serviceDate: 'asc',
        },
      });
  
      if (format === 'csv') {
        const csvData = services.map(service => ({
          Date: service.serviceDate?.toLocaleDateString(),
          Service: service.nameOfTheService.name,
          Description: service.description,
          Amount: service.price,
          Status: service.status,
          'POS User': service.posUser?.email || 'N/A',
          'Customer': service.User.email,
          'Transaction ID': service.transactionId || 'N/A',
          'Payment Mode': service.paymentMode || 'N/A',
        }));
  
        const csv = await convertToCSV(csvData);
        
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename=report-${start.toISOString().split('T')[0]}.csv`,
          },
        });
      }
  
      return NextResponse.json(services);
  
    } catch (error) {
      console.error('Error exporting report:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 500 }
      );
    }
  }