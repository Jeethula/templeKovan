import { NextRequest,NextResponse } from "next/server";
import prisma from '../../../../utils/prisma'

type Params={
    id:string
}

export async function GET(req: NextRequest,{ params }: { params: Params }) {
    const { id } = params
    console.log(id)
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
                likedBy:{
                    select:{
                        id:true
                    }
                },
                dislikedBy:{
                    select:{
                        id:true
                    }
                },
                createdAt:true,
                comments:{
                    select:{
                        id:true,
                        content:true,
                        createdAt:true,
                        author:{
                            select:{
                                personalInfo:{
                                    select:{
                                        firstName:true,
                                        avatarUrl:true
                                    }
                                }
                            }
                        },
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


