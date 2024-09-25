import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/utils/prisma";

export async function POST(req:NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;
        const history = await prisma.personalInfoHistory.findMany({
            where: {
                email: email,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        return NextResponse.json({ details: history, status: 200 });
    } catch (e) {
        console.error("Error in fetching history", e);
        return NextResponse.json({ error: "Error in fetching history", status: 500 });
    }
}