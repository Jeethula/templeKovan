import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        personalInfo: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        sons: {
          select: {
            id: true,
            phone: true,
            personalInfo: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        },
        daughters: {
          select: {
            id: true,
            phone: true,
            personalInfo: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      phone: user.phone,
      personalInfo: user.personalInfo,
      relationships: [
        ...user.sons.map(son => ({
          id: son.id,
          relation: 'son' as const,
          firstName: son.personalInfo?.firstName,
          lastName: son.personalInfo?.lastName,
          phone: son.phone
        })),
        ...user.daughters.map(daughter => ({
          id: daughter.id,
          relation: 'daughter' as const,
          firstName: daughter.personalInfo?.firstName,
          lastName: daughter.personalInfo?.lastName,
          phone: daughter.phone
        }))
      ]
    }));

    return NextResponse.json({
      users: formattedUsers,
      status: 200
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e, status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const details = await prisma.user.findUnique({
      where: {
        id: body?.id
      },
      include: {
        personalInfo: true,
        sons: {
          include: {
            personalInfo: true
          }
        },
        daughters: {
          include: {
            personalInfo: true
          }
        }
      }
    });

    if (!details) {
      return NextResponse.json({
        status: 401,
        success: "user profile not found"
      });
    }

    // Format relationships
    const relationships = [
      ...details.sons.map(son => ({
        id: son.id,
        relation: 'son',
        firstName: son.personalInfo?.firstName,
        lastName: son.personalInfo?.lastName,
        phone: son.phone
      })),
      ...details.daughters.map(daughter => ({
        id: daughter.id,
        relation: 'daughter',
        firstName: daughter.personalInfo?.firstName,
        lastName: daughter.personalInfo?.lastName,
        phone: daughter.phone
      }))
    ];

    return NextResponse.json({
      details: { ...details, relationships },
      status: 200,
      success: "user profile found"
    });

  } catch (e) {
    return NextResponse.json({ error: e, status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, relationships } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required", status: 400 });
    }

    // Update basic info
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        sons: {
          set: relationships
            .filter((r: any) => r.relation === 'son')
            .map((r: any) => ({ id: r.id }))
        },
        daughters: {
          set: relationships
            .filter((r: any) => r.relation === 'daughter')
            .map((r: any) => ({ id: r.id }))
        }
      },
      include: {
        personalInfo: true,
        sons: true,
        daughters: true
      }
    });

    return NextResponse.json({
      status: 200,
      updatedUser,
      success: "User profile updated successfully"
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}


