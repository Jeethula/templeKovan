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
                author:{
                    select:{
                        personalInfo:{
                            select:{
                                firstName:true,
                            }
                        }
                    }
                },
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

        const user1=await prisma.comment.findUnique({
            where:{
                id:comment_id
            },
            select:{
                authorId:true
            }
        })

        const user2=await prisma.user.findUnique({
            where:{
                id:authorId
            },
            select:{
                role:true
            }
        })

        if(user1)
        {
            if(user1.authorId!==authorId)
            {
                if(user2)
                {
                    if(user2.role.includes("Admin"))
                    {
                        await prisma.comment.delete({
                            where:{
                                id:comment_id
                            }
                        })
                        return NextResponse.json({message:"Comment Deleted Successfully",status:200})
                    }
                    else
                    {
                        return NextResponse.json({error:"You are not authorized to delete this comment",status:401})
                    }
                }
                return NextResponse.json({error:"You are not authorized to delete this comment",status:401})
            }
            await prisma.comment.delete({
                where:{
                    id:comment_id,
                }
            })
            return NextResponse.json({message:"Comment Deleted Successfully",status:200})
        }
    }
    catch(e){
        return NextResponse.json({error:e,status:500})
    }
    finally{
        await prisma.$disconnect()
    }
}