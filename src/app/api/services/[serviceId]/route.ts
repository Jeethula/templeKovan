import { NextRequest,NextResponse } from "next/server"
import prisma from "@/utils/prisma"

type Params={
    serviceId:string
}


export async function GET(req: NextRequest,{ params }: { params: Params })
{
    const { serviceId } = params
    try{
        const service=await prisma.services.findUnique({
            where:{
                id:serviceId
            },
            select:{
                id:true,
                nameOfTheService:true,
                price:true,
                serviceDate:true,
                image:true,
                approvedBy:true,
                transactionId:true,
                paymentMode:true,
                status:true,
                personalInfo:{
                    select:{
                        firstName:true,
                        lastName:true,
                        phoneNumber:true,
                        address1:true,
                        address2:true,
                        city:true,
                        state:true,
                        country:true,
                        pincode:true,

                    }
                }
            }
        })
        return NextResponse.json({service,status:200})
    }
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }

}