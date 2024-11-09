
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
 

// api/services/user - GET all the services of the user by the user
export async function GET(req:NextRequest)
{
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
 
    if (!userId) {
        return NextResponse.json({error: "User ID is required", status: 400});
    }
    try
    {
        const user=await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                services:{
                    select:{
                        id:true,
                        nameOfTheService:{
                            select:{
                                id:true,
                                name:true,
                                image:true
                            }
                        },
                        description:true,
                        price:true,
                        image:true,
                        status:true,
                        approvedBy:{
                            select:{
                                phone:true,
                                personalInfo:{
                                    select:{
                                        firstName:true,
                                        lastName:true
                                    }
                                }
                            }
                        },
                        serviceDate:true,
                        paymentMode:true,
                        transactionId:true,
                        createdAt:true,
                        updatedAt:true
                    }
                }
            }
        })
        

        return NextResponse.json({services:user,status:200})
    }
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }

}



// api/services/user - POST create a service by the user
export async function POST(req: NextRequest) {
    const { userId, nameOfTheServiceid, description, amount, image, paymentMode, transactionId, serviceDate } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: "User ID is required", status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found", status: 404 });
        }

        const service = await prisma.services.create({
            data: {
                nameOfTheService:{
                    connect:{id:nameOfTheServiceid}
                },
                description,
                price: parseInt(amount),
                image,
                serviceDate: new Date(serviceDate),
                paymentMode,
                transactionId,
                User: {
                    connect: { id: userId }
                }
            }
        });
        return NextResponse.json({ service: service, status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e, status: 500 });
    }
}