import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const identifier = body?.identifier;

        if (!identifier) {
            return NextResponse.json({ error: "Identifier is required", status: 400 });
        }

        let user;
        if (identifier.includes('@')) {
            user = await prisma.user.findUnique({
                where: { email: identifier }
            });
        } else {
            user = await prisma.user.findUnique({
                where: { phone: identifier }
            });
        }

        if (user) {
            return NextResponse.json({ user, status: 200, success: "user found" });
        } else {

            const generateUniqueIdentifier = async (type: 'email' | 'phone') => {
                let uniqueIdentifier;
                let userExists;
                do {
                    if (type === 'email') {
                        uniqueIdentifier = `user${Math.floor(Math.random() * 10000)}@example.com`;
                        userExists = await prisma.user.findUnique({ where: { email: uniqueIdentifier } });
                    } else {
                        uniqueIdentifier = `123456${Math.floor(Math.random() * 10000)}`;
                        userExists = await prisma.user.findUnique({ where: { phone: uniqueIdentifier } });
                    }
                } while (userExists);
                return uniqueIdentifier;
            };

            const newUser = await prisma.user.create({
                data: {
                    email: identifier.includes('@') ? identifier : await generateUniqueIdentifier('email'),
                    phone: !identifier.includes('@') ? identifier : await generateUniqueIdentifier('phone'),
                    role: ['user'],
                },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    role: true,
                    isfirstTimeLogin: true,
                }
            });
            console.log(newUser);
            return NextResponse.json({ user: newUser, status: 200, success: "user created" });
        }
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "error in user", status: 404 });
    }
}
