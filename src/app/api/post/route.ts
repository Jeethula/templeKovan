import { NextRequest,NextResponse } from "next/server";
import prisma from '../../../utils/prisma'


export async function GET(req: NextRequest) {
    try{
        const posts=await prisma.post.findMany({
            select:{
                id:true,
                title:true,
                content:true,
                image:true,
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
                comments:true,
                author:{

                    select:{
                        id:true,
                        personalInfo:{
                            select:{
                                firstName:true,
                                avatarUrl:true
                            }
                        }
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return NextResponse.json({posts:posts,status:200})
    }
    catch(e){
        return NextResponse.json({error:e,status:500})
    }
    finally{
        await prisma.$disconnect()
    }

}

export async function POST(req: NextRequest) {
    const { title, content, authorId,image } = await req.json();
    console.log(title, content, authorId,image);
    
    try{
        await prisma.post.create({
            data:{
                title,
                content,
                image:image || null,
                authorId,
                likes:0,
                dislikes:0

            }
        })
        return NextResponse.json({status:200})
    }
    catch(e){
        return NextResponse.json({error:e,status:500})
    }
    finally{
        await prisma.$disconnect()
    }
}

export async function PUT(req: NextRequest) {
    const { post_id, title, content,authorId} = await req.json();

    try{

        const user=await prisma.post.findUnique({
            where:{
                id:post_id

            },
            select:{
                authorId:true
            }
        })
        if(user)
        {
            if(user.authorId!==authorId){
                return NextResponse.json({error:"You are not authorized to update this post",status:403})
            }
            else
            {
                const post=await prisma.post.update({
                    where:{
                        id:post_id
                    },
                    data:{
                        title,
                        content
                    }
                })
                return NextResponse.json({post:post,status:200})
          
            }
        }
        else
        {
            return NextResponse.json({error:"Post not found",status
            :404})
        }
    }
    catch(e){
        return NextResponse.json({error:e,status:500})
    }
    finally{
        await prisma.$disconnect()
    }
}

export async function DELETE(req: NextRequest) {
    const { post_id, authorId } = await req.json();
    console.log(post_id, authorId);
    try {
        const user1 = await prisma.post.findUnique({
            where: {
                id: post_id
            },
            select: {
                authorId: true
            }
        });
        console.log(user1);

        const user2 = await prisma.user.findUnique({
            where: {
                id: authorId
            }
        });
        console.log(user2);

        if (user1) {
            if (user1.authorId !== authorId) {
                if (user2) {
                    if (user2.role !== "Admin") {
                        return NextResponse.json({ error: "You are not authorized to delete this post", status: 403 });
                    }
                } else {
                    return NextResponse.json({ error: "You are not authorized to delete this post", status: 403 });
                }
            }
            await prisma.comment.deleteMany({
                where: {
                    postId: post_id
                }
            });
            const post = await prisma.post.delete({
                where: {
                    id: post_id
                }
            });
            return NextResponse.json({ post: post, status: 200 });
        } else {
            return NextResponse.json({ error: "Post not found", status: 404 });
        }
    } catch (e) {
        return NextResponse.json({ error: e, status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}



