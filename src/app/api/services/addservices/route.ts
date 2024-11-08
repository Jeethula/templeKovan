import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      image,
      targetDate,
      targetPrice,
      minAmount,
      maxCount
    } = body;

    const service = await prisma.serviceAdd.create({
      data: {
        name,
        description,
        image,
        targetDate: targetDate ? new Date(targetDate) : null,
        targetPrice,
        minAmount,
        maxCount
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating service' }, { status: 500 });
  }
}

// UPDATE
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      description,
      image,
      targetDate,
      targetPrice,
      minAmount,
      maxCount
    } = body;

    const updatedService = await prisma.serviceAdd.update({
      where: { id },
      data: {
        name,
        description,
        image,
        targetDate: targetDate ? new Date(targetDate) : null,
        targetPrice,
        minAmount,
        maxCount
      }
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating service' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.serviceAdd.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting service' }, { status: 500 });
  }
}