
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";
 

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
    const {userId,nameOfTheService,description,amount,image,paymentMode,transactionId,serviceDate} = await req.json();
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

        const serviceDateObj = new Date(serviceDate);
        serviceDateObj.setHours(0, 0, 0, 0);
        const serviceDateString = serviceDateObj.toISOString().split('T')[0];
        console.log(typeof(serviceDateString));


        if(nameOfTheService==='thirumanjanam')
        {
            if(!serviceDate)
            {
                return NextResponse.json({error:"Service date is required",status:400})
            }
            const serviceDateObj=new Date(serviceDate)
            console.log(serviceDateObj);
            
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
                                        price:parseInt(amount),
                                        image,
                                        paymentMode,
                                        transactionId,
                                        serviceDate:new Date(serviceDateString)
                                    }
                                }
                            }
                        }
                    }
                })
                return NextResponse.json({service:service,status:200})
        }

        if(nameOfTheService==='abhisekam')
        {
            if(!serviceDate)
            {
                return NextResponse.json({error:"Service date is required",status:400})
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
                                        price:parseInt(amount),
                                        image,
                                        paymentMode,
                                        transactionId,
                                        serviceDate:new Date(serviceDateString)
                                    }
                                }
                            }
                        }
                    }
                })
                return NextResponse.json({service:service,status:200})
        } 

        if(nameOfTheService==='donation')
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
                                    price:parseInt(amount),
                                    image,
                                    paymentMode,
                                    transactionId,
                                    serviceDate: new Date(serviceDateString)
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
        console.log("err");
        
        return NextResponse.json({error:e,status:500})
    }
 
   
}