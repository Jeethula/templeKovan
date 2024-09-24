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
            }
        })
        const user = await prisma.user.findUnique({
            where:{
                id:body?.id
            }
        })
        if(details && user){
            return NextResponse.json({details,user,status:200,success:"user profile found"});
        }

        return NextResponse.json({details,status:400,success:"user profile not found"});

    }catch(e){
        return NextResponse.json({error:e,status:500})
    }
}