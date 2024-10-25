import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/utils/prisma";

export async function GET()
{
    try{
        const serviceLimits = await prisma.serviceLimit.findMany();
        return NextResponse.json({serviceLimits, status:200});
    }
    catch(e){
        console.error("Error in fetching service limits", e);
        return NextResponse.json({error:"Error in fetching service limits", status:500});
    }
}


export async function PUT(req:NextRequest)
{
    try{
        const body = await req.json();
        const {id, thirumanjanam, abhisekam, thirumanjanamPrice, abhisekamPrice} = body;
        console.log(id, thirumanjanam, abhisekam, thirumanjanamPrice, abhisekamPrice);
        const serviceLimit = await prisma.serviceLimit.update({
            where:{
                id
            },
            data:{
                thirumanjanam:parseInt(thirumanjanam),
                abhisekam:parseInt(abhisekam),
                // thirumanjanamPrice:parseInt(thirumanjanamPrice),
                // abhisekamPrice:parseInt(abhisekamPrice)
            }
        });
        console.log("Service limit updated successfully");
        
        return NextResponse.json({serviceLimit, status:201});
    }
    catch(e){
        console.error("Error in creating service limit", e);
        return NextResponse.json({error:"Error in creating service limit", status:500});
    }
}