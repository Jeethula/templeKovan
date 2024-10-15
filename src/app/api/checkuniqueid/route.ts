// pages/api/checkuniqueid.ts
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uniqueId } = body;
    console.log(uniqueId);

    if (!uniqueId) {
      return NextResponse.json({ error: "Missing unique ID", status: 400 });
    }

    const existingUser = await prisma.personalInfo.findUnique({
      where: { 
        uniqueId :parseInt(uniqueId) },
    });

    return NextResponse.json({ exists: !!existingUser, status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      error: "Error checking unique ID",
      status: 500,
    });
  }
}
