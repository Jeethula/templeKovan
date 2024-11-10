import {NextResponse} from 'next/server'
import prisma from '@/utils/prisma';

export async function GET() {
    try {
  
      const posUsers = await prisma.user.findMany({
        where: {
          role: {
            has: 'posuser',
          },
        },
        select: {
          id: true,
          email: true,
          phone: true,
          personalInfo: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          personalInfo: {
            firstName: 'asc',
          },
        },
      });
  
      return NextResponse.json(posUsers);
    } catch (error) {
      console.error('Error fetching POS users:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }