import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(req:Request){
    try {
        const body = await req.json();
        console.log(body?.email);
        if(body?.email !== "" || body?.email !==undefined || body?.email !==null){
            console.log(body?.email);
            const user = await prisma.user.findUnique({
                where:{
                    email:body?.email
                }
            })
            if(user){
                return NextResponse.json({user,status:200,success:"user found"});
            }else{
                const newUser = await prisma.user.create({
                    data:{
                        email: body?.email,
                        role: 'user'
                    }
                })
                return NextResponse.json({user:newUser,status:200,success:"user created"});
        }
    }

    }catch(e){
        console.log(e)
        return NextResponse.json({error:"error in user",status:404});
    }
}

