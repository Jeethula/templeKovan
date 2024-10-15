import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(){
    try{
        const personalInfodetails = await prisma.personalInfo.findMany({
            select:{
                salutation:true,
                firstName:true,
                lastName:true,
                userid:true,
                address1:true,
                address2:true,
                city:true,
                pincode:true,
                state:true,
                country:true,
                comments:true,
                isApproved:true,
                avatarUrl:true,
                createdAt:true,
            },
            orderBy:{
                createdAt:"desc"
            }
        }
    )

    const userDetails = await prisma.user.findMany({
        select:{
            id:true,
            email:true,
            role:true,
            phone:true,
        }
        
    })
    return NextResponse.json({personalInfodetails,userDetails,status:200})

    }catch(e){
        return NextResponse.json({error:e,status:500})
    }
}

export async function POST(req:Request){
    try{
        const body = await req.json();
        console.log(body.id, "body");
        const details = await prisma.personalInfo.findUnique({
            where:{
                userid:body?.id
            },
            select:{
                id:true,
                salutation:true,
                firstName:true,
                lastName:true,
                userid:true,
                address1:true,
                address2:true,
                city:true,
                pincode:true,
                phoneNumber:true,
                state:true,
                country:true,
                comments:true,
                isApproved:true,
                avatarUrl:true,
                user:{
                    select:{
                        id:true,
                        email:true,
                        role:true,
                        personalInfo:true,
                        posts:true,
                        likedPosts:true,
                        dislikedPosts:true,
                        referral:true,
                        parent:true,
                        phone:true,
                    }
                }
            }
        })

        if(!details){
            return NextResponse.json({details:details,status:401,success:"user profile not found"});
        }
         return NextResponse.json({details:details,status:200,success:"user profile found"});

    }catch(e){
        return NextResponse.json({error:e,status:500})
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "User ID is required", status: 400 });
        }

        const updatedUser = await prisma.personalInfo.update({
            where: { userid:id },
            data: {
                salutation: body.salutation,
                firstName: body.firstName,
                lastName: body.lastName,
                address1: body.address1,
                address2: body.address2,
                city: body.city,
                pincode: body.pincode,
                state: body.state,
                country: body.country,
                comments: body.comments,
                isApproved: body.isApproved,
                avatarUrl: body.avatarUrl,
            },
        });

        return NextResponse.json({ status: 200, updatedUser, success: "User profile updated successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error", status: 500 });
    }
}


