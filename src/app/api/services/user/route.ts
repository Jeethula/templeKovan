
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
                personalInfo:{
                    select:{
                        Services:true
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
export async function POST(req:NextRequest, res:NextResponse)
{
    const {userId,nameOfTheService,description,price,image,paymentMode,transactionId,serviceDate} = await req.json();

    if(!userId)
    {
        return NextResponse.json({error:"User ID is required",status:400})
    }

    try
    {
        const user=await prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        if(!user)
        {
            return NextResponse.json({error:"User not found",status:404})
        }

        if(nameOfTheService==='Thirumanjamanam')
        {
            if(!serviceDate)
            {
                return NextResponse.json({error:"Service date is required",status:400})
            }
                const today = new Date(serviceDate);
                const startOfDay = new Date(today.setHours(0, 0, 0, 0));
                const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
                const serviceCount = await prisma.services.count({
                where: {
                    nameOfTheService: 'Thirumanjamanam',
                    createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                    },
                },
                });
                
                const serviceLimit=await prisma.serviceLimit.findMany({
                    select:{
                        Thirumanjanam:true
                    }
                })

                if (serviceCount >= serviceLimit[0].Thirumanjanam) {
                    return NextResponse.json({error: "Service limit reached", status: 400});
                }
                const service=await prisma.user.update({
                    where:{
                        id:userId
                    },
                    data:{
                        personalInfo:{
                            update:{
                                Services:{
                                    create:{
                                        nameOfTheService,
                                        description,
                                        price,
                                        image,
                                        paymentMode,
                                        transactionId,
                                        serviceDate
                                    }
                                }
                            }
                        }
                    }
                })
                return NextResponse.json({service:service,status:200})
        }

        if(nameOfTheService==='Abhishekam')
        {
            if(!serviceDate)
            {
                return NextResponse.json({error:"Service date is required",status:400})
            }
                const today = new Date(serviceDate);
                const startOfDay = new Date(today.setHours(0, 0, 0, 0));
                const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
                const serviceCount = await prisma.services.count({
                where: {
                    nameOfTheService: 'Abhishekam',
                    createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                    },
                },
                });
                
                const serviceLimit=await prisma.serviceLimit.findMany({
                    select:{
                        Abhishekam:true
                    }
                })

                if (serviceCount >= serviceLimit[0].Abhishekam) {
                    return NextResponse.json({error: "Service limit reached", status: 400});
                }
                const service=await prisma.user.update({
                    where:{
                        id:userId
                    },
                    data:{
                        personalInfo:{
                            update:{
                                Services:{
                                    create:{
                                        nameOfTheService,
                                        description,
                                        price,
                                        image,
                                        paymentMode,
                                        transactionId,
                                        serviceDate
                                    }
                                }
                            }
                        }
                    }
                })
                return NextResponse.json({service:service,status:200})
        } 

        if(nameOfTheService==='generalDonation')
        {
            const service=await prisma.user.update({
                where:{
                    id:userId
                },
                data:{
                    personalInfo:{
                        update:{
                            Services:{
                                create:{
                                    nameOfTheService,
                                    description,
                                    price,
                                    image,
                                    paymentMode,
                                    transactionId,
                                    serviceDate
                                }
                            }
                        }
                    }
                }
            })
            return NextResponse.json({service:service,status:200})
        }
        
        return NextResponse.json({error:"Service name not found",status:400})
}
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }
 
   
}