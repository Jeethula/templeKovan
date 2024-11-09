import {NextRequest,NextResponse} from 'next/server'
import prisma from '@/utils/prisma';

export async function GET(){
    try {
        const user = await prisma.services.findFirst({
            where:{
                nameOfTheServiceId:"cm39vec3p0000ooi3pkdquuov",
            },
            orderBy:{
                createdAt:"desc"
            }
        });
        return NextResponse.json({user});
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch user data' },
            { status: 500 }
        );
    }
}
            