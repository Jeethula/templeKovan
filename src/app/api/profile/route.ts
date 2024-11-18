import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

interface Relationship {
  id: string;
  relation: 'son' | 'daughter';
  firstName?: string;
  lastName?: string;
  phone?: string;
}



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
            address1: true,
        address2: true,
        city: true,
        state: true,
        pincode: true,
        country: true
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
            .filter((r:Relationship) => r.relation === 'son')
            .map((r:Relationship) => ({ id: r.id }))
        },
        daughters: {
          set: relationships
            .filter((r:Relationship) => r.relation === 'daughter')
            .map((r:Relationship) => ({ id: r.id }))
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

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { userId, email, Phone, firstName, lastName, ...addressInfo } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required", status: 400 });
        }

        // Update user details
        await prisma.user.update({
            where: { id: userId },
            data: {
                email: email,
                phone: Phone
            }
        });

        // Update personal info
        const updatedPersonalInfo = await prisma.personalInfo.update({
            where: { 
                userid: userId 
            },
            data: {
                firstName,
                lastName,
                address1: addressInfo.address1,
                address2: addressInfo.address2,
                city: addressInfo.city,
                pincode: addressInfo.pincode,
                state: addressInfo.state,
                country: addressInfo.country,
                phoneNumber: Phone,
            }
        });

        return NextResponse.json({ 
            status: 200, 
            data: updatedPersonalInfo, 
            message: "Profile updated successfully" 
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ 
            error: "Failed to update profile", 
            status: 500 
        });
    }
}


