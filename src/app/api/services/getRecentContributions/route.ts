import {NextResponse} from 'next/server'
import prisma from '@/utils/prisma';

export async function GET(){
    try {
        const user = await prisma.services.findFirst({
            where:{
                nameOfTheServiceId:"cm39vec3p0000ooi3pkdquuov",
            },
            orderBy:{
                createdAt:"desc"
            },
            select:{
                price:true,
                createdAt:true,
                updatedAt:true,
                User:{
                    select:{
                        personalInfo:{
                            select:{
                                firstName:true,
                                lastName:true,
                                city:true,
                            }
                        }
                    }
                }
                
            }   
        });
        return NextResponse.json({user});
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data' },
            { status: 500 }
        );
    }
}
            