import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";


export async function POST(req:Request){

    try{
        const body = await req.json();
        console.log(body, "body");
        const userDetails = await prisma.personalInfo.create({
            data:{
                email: body?.email,
                address1: body?.address1,
                address2: body?.address2,
                state: body?.state,
                phoneNumber: body?.phoneNumber,
                country: body?.country,
                firstName: body?.firstName,
                lastName : body?.lastName,
                avatarUrl: body?.avatarUrl ,
                pincode: body?.pincode,
                city: body?.city,
                isApproved:"null",
                salutation: body?.salutation,
                comments: body?.comments
        }})
        console.log("completed")
        return NextResponse.json({userDetails,status:200,success:"user profile created"});


    }catch(e){
        return NextResponse.json({error:"error in posting user profile",status:404});
    }
}

export async function PUT(req:Request){
    try{
        const body = await req.json();

        const oldUserDetails = await prisma.personalInfo.findUnique({
            where:{
                email:body?.email
            }
        });

        if (!oldUserDetails) {
            return NextResponse.json({ error: "User not found", status: 404 });
        }

            await prisma.personalInfoHistory.create({
            data:{
                email: oldUserDetails?.email,
                address1: oldUserDetails?.address1,
                address2: oldUserDetails?.address2,
                state: oldUserDetails?.state,
                phoneNumber: oldUserDetails?.phoneNumber,
                country: oldUserDetails?.country,
                firstName: oldUserDetails?.firstName,
                lastName : oldUserDetails?.lastName,
                avatarUrl: oldUserDetails?.avatarUrl ,
                pincode: oldUserDetails?.pincode,
                city: oldUserDetails?.city,
                isApproved: oldUserDetails?.isApproved,
                salutation: oldUserDetails?.salutation||null,
                comments: oldUserDetails?.comments
            }
        })

        const userDetails = await prisma.personalInfo.update({
            where:{
                email:body?.email
            },
            data:{
                email: body?.email,
                address1: body?.address1,
                address2: body?.address2,
                state: body?.state,
                phoneNumber: body?.phoneNumber,
                country: body?.country,
                firstName: body?.firstName,
                lastName : body?.lastName,
                avatarUrl: body?.avatarUrl ,
                pincode: body?.pincode,
                city: body?.city,
                isApproved: body?.isApproved || "null"
        }})
        
        return NextResponse.json({userDetails,status:200,success:"user profile updated"});

    }catch(e){
        return NextResponse.json({error:"error in updating user profile",status:404});
    }
}


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get('email'); 

        console.log(email);

        if (!email) {
            return NextResponse.json({ error: "Email is required", status: 400 });
        }

        const userDetails = await prisma.personalInfo.findUnique({
            where: {
                email: email
            }
        });

        if (!userDetails) {
            return NextResponse.json({ error: "User not found", status: 404 });
        }

        return NextResponse.json({ userDetails, status: 200, success: "User profile found" });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error in getting user profile", status: 500 });
    }
}

// for admin to delete user profile
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        console.log(body);

        if (!body.email || !body.adminEmail) {
            return NextResponse.json({ error: "You are not authorized", status: 400 });
        }

        const admin = await prisma.user.findUnique({
            where: {
                email: body.adminEmail,
            }
        });

        if (admin?.role !== "Admin") {
            return NextResponse.json({ error: "You are not authorized", status: 403 });
        }

        const userDetails = await prisma.personalInfo.delete({
            where: {
                email: body.email
            }
        });

        return NextResponse.json({ userDetails, status: 200, success: "User profile deleted" });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error in deleting user profile", status: 500 });
    }
}

// for admin to approve user details
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        console.log(body.email, body.adminEmail, body.isApproved);

        if (!body.email || !body.adminEmail || !body.isApproved ) {
            return NextResponse.json({ error: "data missing", status: 400 });
        }

        const admin = await prisma.user.findUnique({
            where: {
                email: body.adminEmail,
            }
        });

        if (admin?.role !== "Admin") {
            return NextResponse.json({ error: "You are not authorized", status: 403 });
        }

        const userDetails = await prisma.personalInfo.update({
            where: {
                email: body.email
            },
            data: {
                isApproved: body.isApproved
            }
        });
        

        return NextResponse.json({ userDetails, status: 200, success: "User profile updated" });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error in updating user profile", status: 500 });
    }
}