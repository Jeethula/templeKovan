import { NextRequest,NextResponse } from "next/server";
import prisma from '../../../../utils/prisma'

type Params={
    id:string
}

export async function GET(req: NextRequest,{ params }: { params: Params }) {

    const { id } = params;
    try{
        const comments=await prisma.comment.findMany({
            where:{
                postId:id
            },
            select:{
                id:true,
                content:true,
                authorId:true,
                postId:true,
                createdAt:true,
            }
        })
        return NextResponse.json({comments:comments,status:200})
    }
    catch(e){
        return NextResponse.json({error:e,status:500})
    }
    finally{
        await prisma.$disconnect()
    }
}

export async function DELETE(req: NextRequest) {

    const {authorId,comment_id}=await req.json()


    try{
        const comments=await prisma.comment.deleteMany({
            where:{
                id:comment_id,
            }
        })
        return NextResponse.json({comments:comments,status:200})
    }
    catch(e){
        return NextResponse.json({error:e,status:500})
    }
    finally{
        await prisma.$disconnect()
    }
}