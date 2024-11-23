import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { field: string } }
) {
  try {
    const { value } = await request.json();
    const { field } = params;

    let exists = false;

    switch (field) {
      case 'email':
        exists = await prisma.user.findFirst({
          where: { email: value }
        }) !== null;
        break;
      case 'phone':
        exists = await prisma.user.findFirst({
          where: { phone: value }
        }) !== null;
        break;
      case 'uniqueId':
        exists = await prisma.personalInfo.findFirst({
          where: { uniqueId: parseInt(value) }
        }) !== null;
        break;
      default:
        return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
    }

    return NextResponse.json({ 
      exists,
      message: exists ? `This ${field} is already registered` : ''
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}