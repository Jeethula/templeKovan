import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(req:Request){
    try {
        const body = await req.json();
        const identifier = body?.identifier; // This can be either email or phone number

        let user;
        if (identifier.includes('@')) {
            // It's an email
            user = await prisma.user.findUnique({
                where: { email: identifier }
            });
        } else {
            // It's a phone number
            user = await prisma.user.findUnique({
                where: { phone: identifier }
            });
        }

        if(user){
            return NextResponse.json({user, status:200, success:"user found"});
        } else {
            // Create a new user if not found
            const newUser = await prisma.user.create({
                data: {
                    email: identifier.includes('@') ? identifier : undefined,
                    phone: !identifier.includes('@') ? identifier : undefined,
                    role: ['user'], // Set default role
                }
            });
            return NextResponse.json({user: newUser, status:200, success:"user created"});
        }
    } catch(e) {
        console.log(e)
        return NextResponse.json({error:"error in user", status:404});
    }
}
