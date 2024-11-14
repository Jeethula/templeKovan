import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import prisma from "@/utils/prisma";

// Add OPTIONS handler to support CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Allow': 'GET, PUT, OPTIONS',
    },
  })
}

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
  export async function PUT(request: NextRequest) {
    try {
      const body = await request.json();
      const { userId, roles } = body;
  
      if (!userId || !roles) {
        return NextResponse.json(
          { error: 'Missing required fields' }, 
          { status: 400 }
        );
      }
  
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