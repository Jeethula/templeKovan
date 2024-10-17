import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma';


// api/services/posuser - POST create a service
export async function POST(req: NextRequest,res:NextResponse) {
    const {userId,nameOfTheService,description,price,image,paymentMode,transactionId,serviceDate,posUserId} = await req.json();

    if(!userId)
    {
        return NextResponse.json({error:"User ID is required",status:400})
    }
    if(!posUserId)
    {
        return NextResponse.json({error:"POS User ID is required",status:400})
    }

    try
    {
        const user=await prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        const posUser=await prisma.user.findUnique({
            where:{
                id:posUserId
            }
        })
        if(!posUser)
        {
            return NextResponse.json({error:"POS User not found",status:404})
        }
        if(!user)
        {
            return NextResponse.json({error:"User not found",status:404})
        }

        if(!posUser.role.includes('pos'))
        {
            return NextResponse.json({error:"POS User not found",status:404})
        }

        if(nameOfTheService==='Thirumanjanam')
        {
            if(!serviceDate)
            {
                return NextResponse.json({error:"Service Date is required",status:400})
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
                                    posUserId,
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
                                    posUserId,
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
        return NextResponse.json({error:"Service not found",status:404})
    }
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }
    
}