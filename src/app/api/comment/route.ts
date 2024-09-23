import { NextRequest,NextResponse } from "next/server";
import prisma from '../../../utils/prisma'


export async function POST(req: NextRequest) {
    const { content, post_id,user_id } = await req.json();
    try{
        const comment=await prisma.comment.create({
            data:{
                content:content,
                postId:post_id,
                authorId:user_id
            }
        })
        return NextResponse.json({comment:comment,status:200})
    }
    catch(e){
        return NextResponse.json({error:e,status:500})
    }
    finally{
        await prisma.$disconnect()
    }
}

