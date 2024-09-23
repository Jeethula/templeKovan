import { NextRequest,NextResponse } from "next/server";
import prisma from '../../../../../utils/prisma'

export async function POST(req: NextRequest) {
    const { post_id,user_id } = await req.json();
    try{
        const post=await prisma.post.update({
            where:{
                id:post_id
            },
            data:{
                dislikes:{
                    increment:1
                },
                dislikedBy:{
                    connect:{
                        id:user_id
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



