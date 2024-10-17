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
            }
        })
        return NextResponse.json({service,status:200})
    }
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }

}