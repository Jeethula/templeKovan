import { NextResponse } from 'next/server'
import prisma from "@/utils/prisma";

export async function GET() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          phone: true,
          personalInfo: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
  
      return NextResponse.json(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
  }
  
  // Update user roles
  export async function PUT(request: Request) {
    try {
      const body = await request.json();
      const { userId, roles } = body;
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: roles },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          personalInfo: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        }
      })
  
      return NextResponse.json(updatedUser)
    } catch (error) {
      console.error('Error updating user roles:', error)
      return NextResponse.json({ error: 'Failed to update roles' }, { status: 500 })
    }
  }