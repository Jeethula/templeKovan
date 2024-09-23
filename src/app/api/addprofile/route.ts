// import { NextResponse } from "next/server";
// import prisma from "../../../utils/prisma";

// export async function POST(req: Request) {
//     try {
//         const body = await req.json();
//         console.log(body);

//         // Check if the user adding this profile is authenticated
//         if (!body.currentUserEmail) {
//             return NextResponse.json({ error: "Unauthorized", status: 401 });
//         }

//         // Find the current user
//         const currentUser = await prisma.user.findUnique({
//             where: { email: body.currentUserEmail }
//         });

//         if (!currentUser) {
//             return NextResponse.json({ error: "Current user not found", status: 404 });
//         }

//         // Create a new user with referral information
//         const newUser = await prisma.user.create({
//             data: {
//                 email: body.email,
//                 role: "User",
//                 referredBy: { connect: { id: currentUser.id } }
//             }
//         });

//         // Create personal info for the new user
//         const userDetails = await prisma.personalInfo.create({
//             data: {
//                 email: body.email,
//                 address1: body.address1,
//                 address2: body.address2,
//                 state: body.state,
//                 phoneNumber: body.phoneNumber,
//                 country: body.country,
//                 firstName: body.firstName,
//                 lastName: body.lastName,
//                 avatarUrl: body.avatarUrl,
//                 isApproved: "null",
//                 user: { connect: { email: body.email } }
//             }
//         });

//         return NextResponse.json({ userDetails, newUser, status: 200, success: "User profile created with referral" });

//     } catch (e) {
//         console.error(e);
//         return NextResponse.json({ error: "Error in posting user profile", status: 500 });
//     }
// }

// // Other functions (PUT, GET, DELETE, PATCH) remain the same

// export async function GET(req: Request) {
//     try {
//         const url = new URL(req.url);
//         const email = url.searchParams.get('email');

//         if (!email) {
//             return NextResponse.json({ error: "Email is required", status: 400 });
//         }

//         const userDetails = await prisma.user.findUnique({
//             where: { email: email },
//             include: {
//                 personalInfo: true,
//                 referredBy: {
//                     select: { email: true, personalInfo: { select: { firstName: true, lastName: true } } }
//                 },
//                 referrals: {
//                     select: { email: true, personalInfo: { select: { firstName: true, lastName: true } } }
//                 }
//             }
//         });

//         if (!userDetails) {
//             return NextResponse.json({ error: "User not found", status: 404 });
//         }

//         return NextResponse.json({ userDetails, status: 200, success: "User profile found" });

//     } catch (e) {
//         console.error(e);
//         return NextResponse.json({ error: "Error in getting user profile", status: 500 });
//     }
// }