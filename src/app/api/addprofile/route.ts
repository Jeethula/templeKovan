// pages/api/addprofile.ts
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { referrerEmail, newUserEmail, personalInfo ,newUserPhone } = body;

    if (!referrerEmail || !newUserEmail || !personalInfo) {
      return NextResponse.json({ error: "Missing required information", status: 400 });
    }

    const referrer = await prisma.user.findUnique({
      where: { email: referrerEmail }
    });

    if (!referrer) {
      return NextResponse.json({ error: "Referrer not found", status: 404 });
    }

    // Check if the new user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: newUserEmail }
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists", status: 400 });
    }

    // Check if the unique_id already exists
    const existingUniqueId = await prisma.personalInfo.findUnique({
      where: { uniqueId: personalInfo.uniqueId }
    });

    if (existingUniqueId) {
      return NextResponse.json({ error: "Unique ID already exists", status: 400 });
    }

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email: newUserEmail,
          phone: newUserPhone,
          referral: referrerEmail,
          parent: { connect: { id: referrer.id } }
        }
      });

      // Create personal info for the new user
      const newPersonalInfo = await prisma.personalInfo.create({
        data: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          address1: personalInfo.address1,
          address2: personalInfo.address2,
          state: personalInfo.state,
          phoneNumber: personalInfo.phoneNumber,
          country: personalInfo.country,
          pincode: personalInfo.pincode,
          city: personalInfo.city,
          avatarUrl: personalInfo.avatarUrl,
          salutation: personalInfo.salutation,
          comments: personalInfo.comments || "",
          isApproved: "pending",
          uniqueId: personalInfo.uniqueId,
          user: { connect: { id: newUser.id } }
        }
      });

      return { newUser, newPersonalInfo };
    });

    return NextResponse.json({
      status: 200,
      success: "New user added successfully",
      data: result
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error adding new user", status: 500 });
  }
}