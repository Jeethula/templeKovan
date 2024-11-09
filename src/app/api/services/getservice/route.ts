import {NextRequest,NextResponse} from 'next/server'
import prisma from '@/utils/prisma';


export async function GET(req:NextRequest)
{
    const url = new URL(req.url);
    const serviceId = url.searchParams.get("serviceId");
    if (!serviceId) {
        return NextResponse.json({error: "Service ID is required", status: 400});
    }
    try
    {
        const service=await prisma.serviceAdd.findUnique({
            where:{
                id:serviceId
            }
        })
        if(!service)
        {
            return NextResponse.json({error:"Service not found",status:404})
        }
        return NextResponse.json({service:service,status:200})
    }
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }
}