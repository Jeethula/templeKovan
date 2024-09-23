import { NextRequest,NextResponse } from "next/server";
import prisma from '../../../../utils/prisma'

type Params={
    id:string
}

export async function GET(req: NextRequest,{ params }: { params: Params }) {
    const { id } = params
    try{
        const post=await prisma.post.findUnique({
            where:{
                id:id
            },
            select:{
                id:true,
                title:true,
                content:true,
                likes:true,
                dislikes:true,
                createdAt:true,
                author:{
                    select:{
                        email:true,
                    }
                }
            }
        })
        return NextResponse.json({post:post,status:200})
    }
    catch(e){
        return NextResponse.json({error:e,status:500})
    }
    finally{
        await prisma.$disconnect()
    }
        
}


