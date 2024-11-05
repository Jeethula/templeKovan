import {NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";


export async function GET(req: NextRequest)
{
    const url = new URL(req.url);
    const approverId = url.searchParams.get("approvedById");
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
                personalInfo:{
                    select:{
                        lastName:true,
                        firstName:true,
                        phoneNumber:true,
                    }
                }
            }
        })
        return NextResponse.json({user,status:200})


    }
    catch(e)
    {
        console.log(e);
        return NextResponse.json({error:"Error in fetching approver details",status:404})
    }
}