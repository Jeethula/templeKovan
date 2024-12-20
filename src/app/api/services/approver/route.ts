import {NextRequest,NextResponse} from 'next/server'
import prisma from '@/utils/prisma';


// api/services/approver - GET all the services of the users
export async function GET(req:NextRequest)
{
    // const url = new URL(req.url);
    // const approverId = url.searchParams.get("approverId");
    const url = new URL(req.url);
    const approverId = url.searchParams.get("approverId");
    if (!approverId) {
        return NextResponse.json({error: "Approver ID is required", status: 400});
    }
    try
    {
        const user=await prisma.user.findUnique({
            where:{
                id:approverId
            },
            select:{
                role:true,
            }
        })
        if(!user)
        {
            return NextResponse.json({error:"Approver not found",status:404})
        }
        if(!user.role.includes('approver'))
        {
            return NextResponse.json({error:"Approver not found",status:404})
        }
        const services=await prisma.services.findMany({
            select:{
                id:true,
                nameOfTheService:{
                    select:{
                        name:true,
                    }
                },
                price:true,
                paymentMode:true,
                transactionId:true,
                status:true,
                serviceDate:true,
                createdAt:true,
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        if(!services)
        {
            
            return NextResponse.json({error:"Services not found",status:404})
        }
        
        return NextResponse.json({services:services,status:200})
    }
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }
}


// api/services/approver - POST to update the status of the service
export async function POST(req:NextRequest)
{
    const {serviceId,status,approverId} = await req.json();
    
    if(!serviceId)
    {
        return NextResponse.json({error:"User ID is required",status:400})
    }
    if(!approverId)
    {
        return NextResponse.json({error:"Approver ID is required",status:400})
    }

    try
    {
        const service=await prisma.services.findUnique({
            where:{
                id:serviceId
            }
        })
        if(!service)
        {
            return NextResponse.json({error:"Service not found",status:404})
        }
        const approver=await prisma.user.findUnique({
            where:{
                id:approverId
            }
        })
        if(!approver)
        {
            return NextResponse.json({error:"Approver not found",status:404})
        }
        if(!approver.role.includes('approver'))
        {
            return NextResponse.json({error:"Approver not found",status:404})
        }
        
        await prisma.services.update({
            where:{
                id:serviceId
            },
            data:{
                status:status,
                approvedAt:new Date(),
                approvedBy:{
                    connect:{
                        id:approverId
                    }
                },
            }
        })
        return NextResponse.json({message:"Status Updated Successfully",status:200})
    }
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }
}