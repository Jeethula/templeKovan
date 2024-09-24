import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(){
    try{
        const details = await prisma.personalInfo.findMany({
            select:{
                salutation:true,
                firstName:true,
                lastName:true,
                email:true,
                phoneNumber:true,
                id:true,
                address1:true,
                address2:true,
                city:true,
                pincode:true,
                state:true,
                country:true,
                comments:true,
                isApproved:true,
                avatarUrl:true
            },
            orderBy:{
                createdAt:"desc"
            }
        }
    )
    return NextResponse.json({details,status:200})

    }catch(e){
        return NextResponse.json({error:e,status:500})
    }
}

export async function POST(req:Request){
    try{
        const body = await req.json();
        const details = await prisma.personalInfo.findUnique({
            where:{
                id:body?.id
            },
            select:{
                salutation:true,
                firstName:true,
                lastName:true,
                email:true,
                phoneNumber:true,
                id:true,
                address1:true,
                address2:true,
                city:true,
                pincode:true,
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
                    }
                }
            }
        })
        console.log(details,"2d2ef3rf3rf3rf");
    
        
        if(!details){
            return NextResponse.json({details:details,status:401,success:"user profile not found"});
        }
         return NextResponse.json({details:details,status:200,success:"user profile found"});


    }catch(e){
        return NextResponse.json({error:e,status:500})
    }
}