
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(req: Request) {
  try {
    const { field, value, userId } = await req.json();

    const where = {
      NOT: { id: userId },
      [field.toLowerCase()]: value
    };

    const exists = await prisma.user.findFirst({ where });
    
    return NextResponse.json({ 
      isValid: !exists,
      status: 200 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Validation failed", 
      status: 500 
    });
  }
}