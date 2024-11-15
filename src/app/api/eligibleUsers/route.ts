import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { parent: null },
        ]
      },
      select: {
        id: true,
        phone: true,  // Include phone number
        personalInfo: {
          select: {
            firstName: true,
            lastName: true,
            uniqueId: true
          }
        }
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      phone: user.phone,  // Include phone in formatted response
      personalInfo: user.personalInfo
    }));

    return NextResponse.json({ users: formattedUsers, status: 200 });
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ 
      error: {
        message: "Failed to fetch users",
        details: error instanceof Error ? error.message : String(error)
      }, 
      status: 500 
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, children } = body;

    const updatedUsers = await prisma.$transaction(
      children.map((child: { id: string; relation: 'son' | 'daughter' }) => 
        prisma.user.update({
          where: { 
            id: child.id 
          },
          data: {
            ...(child.relation === 'son' 
              ? { fatherId: userId } 
              : { motherId: userId })
          },
          include: {
            personalInfo: true
          }
        })
      )
    );

    return NextResponse.json({ status: 200, users: updatedUsers });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ 
      error: {
        message: "Failed to update relationships",
        details: error instanceof Error ? error.message : String(error)
      }, 
      status: 500 
    });
  }
}