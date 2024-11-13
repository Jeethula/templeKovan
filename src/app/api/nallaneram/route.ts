
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET() {
  try {
    const nallaneram = await prisma.nallaNeram.findMany({
      orderBy: {
        date: 'desc'
      },
      take: 1
    });

    return NextResponse.json({ nallaneram, status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}
