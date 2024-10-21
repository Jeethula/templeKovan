import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma';


//fetch all the user details 
export async function GET(req: NextRequest,res:NextResponse) {
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
                        avatarUrl:true,
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