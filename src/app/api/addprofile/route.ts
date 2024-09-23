import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(req: Request) {
  console.log("fwrfrfwrfwf")
  try {
    const body = await req.json();
    console.log(body,"2ednoe2dned");
    const { referrerEmail, newUserEmail, personalInfo } = body;

    // Validate input
    if (!referrerEmail || !newUserEmail || !personalInfo) {
      return NextResponse.json({ error: "Missing required information", status: 400 });
    }

    // Check if the referrer exists
    const referrer = await prisma.user.findUnique({
      where: { email: referrerEmail }
    });

    if (!referrer) {
      return NextResponse.json({ error: "Referrer not found", status: 404 });
    }

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email: newUserEmail,
          role: 'user',
          referral: referrerEmail,
          parent: { connect: { id: referrer.id } }
        }
      });

      // Create personal info for the new user
      const newPersonalInfo = await prisma.personalInfo.create({
        data: {
          email: newUserEmail,
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
          isApproved: "pending"
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