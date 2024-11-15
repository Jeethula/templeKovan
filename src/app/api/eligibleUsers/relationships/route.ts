// app/api/eligibleUsers/relationships/route.ts

import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(req: Request) {
  try {
    // Get userId from URL params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        status: 400, 
        error: "User ID is required" 
      });
    }

    // Fetch user's relationships
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
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

    if (!user) {
      return NextResponse.json({ 
        status: 404, 
        error: "User not found" 
      });
    }

    // Format relationships
    const relationships = [
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
    ];

    return NextResponse.json({
      status: 200,
      relationships
    });

  } catch (error) {
    console.error('Error fetching relationships:', error);
    return NextResponse.json({ 
      status: 500, 
      error: "Internal server error" 
    });
  }
}