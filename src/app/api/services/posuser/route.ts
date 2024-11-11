import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma';

//fetch all the user details 
export async function GET(req: NextRequest) {
    const url=new URL(req.url)
    const posUserId=url.searchParams.get('posUserId')
    if(!posUserId)
    {
        return NextResponse.json({error:"POS User ID is required",status:400})
    }

    try
    {
        const user=await prisma.user.findUnique({
            where:{
                id:posUserId
            },
        })
        if(!user)
        {
            return NextResponse.json({error:"User not found",status:404})
        }
        if(!user.role.includes('posuser'))
        {
            return NextResponse.json({error:"POS User not found",status:404})
        }
        const users=await prisma.user.findMany({
            select:{
                id:true,
                phone:true,
                email:true,
                personalInfo:{
                    select:{
                        id:true,
                        firstName:true,
                        lastName:true,
                        address1:true,
                        address2:true,
                        city:true,
                        state:true,
                        country:true,
                        pincode:true,
                        salutation:true,
                    }
                }
            }
        })
        return NextResponse.json({users:users,status:200})


    }
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }
}




// api/services/posuser - POST create a service
export async function POST(req: NextRequest) {
    const {userId,nameOfTheServiceId,serviceDate,posUserId,price,description} = await req.json();
    
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

        if(!posUser.role.includes('posuser'))
        {
            return NextResponse.json({error:"POS User not found",status:404})
        }

        const service=await prisma.services.create({
            data:{
                nameOfTheService:{
                    connect:{
                        id:nameOfTheServiceId
                    }
                },
                price,
                serviceDate:serviceDate?new Date(serviceDate):null,
                description,
                status:"APPROVED",
                User:{
                    connect:{
                        id:userId
                    }
                },
                posUser:{
                    connect:{
                        id:posUserId
                    }
                }
            }
        })

        const serviceDetails=await prisma.services.findUnique({
            where:{
                id:service.id
            },
            select:{
                id:true,
                nameOfTheService:{
                    select:{
                        name:true
                    }
                },
                price:true,
                serviceDate:true,
                description:true,
                status:true,
                User:{
                    select:{
                        id:true,
                        email:true,
                        phone:true,
                        personalInfo:{
                            select:{
                                firstName:true,
                                lastName:true,
                            }
                        }
                    }
                },
                posUser:{
                    select:{
                        id:true,
                        personalInfo:{
                            select:{
                                firstName:true,
                                lastName:true,
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json({service:serviceDetails,status:200})
    }
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }
    
}