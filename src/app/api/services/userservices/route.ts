import { NextRequest,NextResponse } from 'next/server'
import prisma from '@/utils/prisma';


// api/services/userservices - GET all the services of the user by the approver or POS User
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const getterId=url.searchParams.get("getterId")

    if (!userId) {
        return NextResponse.json({error: "User ID is required", status: 400});
    }   
    if(!getterId)
    {
        return NextResponse.json({error:"Getter ID is required",status:400})
    }

    try
    {

        const getter=await prisma.user.findUnique({
            where:{
                id:getterId
            },
            select:{
                role:true
            }
        })

        if(!getter)
        {
            return NextResponse.json({error:"Getter not found",status:404})
        }
        if(!getter.role.includes('pos')||!getter.role.includes('approver'))
        {
            return NextResponse.json({error:"Getter is not a POS User or Approver",status:400})
        }
        const user=await prisma.user.findUnique({
            where:{
                id:userId
            },
            // select:{
            //     personalInfo:{
            //         select:{
            //             // services:true
                        
            //         }
            //     }
            // }
        })
        if(!user)
        {
            return NextResponse.json({error:"User not found",status:404})
        }
        return NextResponse.json({services:user,status:200})
    }
    catch(e)
    {
        return NextResponse.json({error:e,status:500})
    }
}
