import { NextResponse } from "next/server";
import prisma from "../../../utils/prisma";

interface Relationship {
  id: string;
  relation: 'son' | 'daughter';
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userDetails = await prisma.personalInfo.create({
      data: {
        address1: body?.address1,
        address2: body?.address2,
        state: body?.state,
        country: body?.country,
        firstName: body?.firstName,
        lastName: body?.lastName,
        pincode: body?.pincode,
        phoneNumber: body?.phone,
        city: body?.city,
        salutation: body?.salutation,
        // uniqueId: parseInt(body?.uniqueId),
        userid: body?.userId,
      },
    });

    const user = await prisma.user.update({
      where: {
        id: body?.userId,
      },
      data: {
        email: body?.email,
        phone: body?.phone,
      },
    });

    console.log("completed");
    return NextResponse.json({
      userDetails,
      user,
      status: 200,
      success: "user profile created",
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      error: "error in posting user profile",
      status: 404,
    });
  }
}

// export async function PUT(req: Request) {
//     try {
//         const body = await req.json();
//         // const oldUserDetails = await prisma.personalInfo.findUnique({
//         //     where: {
//         //         userid: body?.id
//         //     }
//         // });

//         // if (!oldUserDetails) {
//         //     console.log("User not found");
//         //     return NextResponse.json({ error: "User not found", status: 404 });
//         // }
//         // await prisma.personalInfoHistory.create({
//         //     data: {
//         //         address1: oldUserDetails?.address1,
//         //         address2: oldUserDetails?.address2 ,
//         //         state: oldUserDetails?.state,
//         //         phoneNumber: oldUserDetails?.phoneNumber ,
//         //         country: oldUserDetails.country,
//         //         firstName: oldUserDetails.firstName,
//         //         lastName: oldUserDetails.lastName??'',
//         //         avatarUrl: oldUserDetails.avatarUrl,
//         //         pincode: oldUserDetails.pincode,
//         //         city: oldUserDetails.city,
//         //         isApproved: oldUserDetails.isApproved,
//         //         salutation: oldUserDetails?.salutation,
//         //         comments: oldUserDetails?.comments,
//         //         uniqueId: oldUserDetails?.uniqueId.toString(),
//         //         personalInfoId: oldUserDetails?.id,
//         //     }
//         // });
//         try {
//             const userDetails = await prisma.personalInfo.update({
//                 where: {
//                     userid: body?.userId,
//                 },
//                 data: {
//                     salutation: body?.salutation,
//                     address1: body?.address_line_1,
//                     address2: body?.address_line_2,
//                     state: body?.state,
//                     phoneNumber: body?.phone_number,
//                     uniqueId: body?.unique_id,
//                     country: body?.country,
//                     firstName: body?.first_name,
//                     lastName: body?.last_name,
//                     avatarUrl: body?.avatarUrl,
//                     pincode: body?.pincode,
//                     city: body?.city,
//                     isApproved: body?.isApproved || "pending",
//                     comments: body?.comments
//                 }
//             });

//             const user = await prisma.user.update({
//                 where: {
//                     id: body?.userId
//                 },
//                 data: {
//                     email: body?.email,
//                     phone: body?.phone_number,
//                 }
//             });

//             console.log("Update completed:", userDetails, user);
//             return NextResponse.json({ userDetails, user, status: 200, success: "User profile updated successfully" });
//         } catch (error) {
//             console.error("Error updating user profile:", error);4
//             return NextResponse.json({ error: "Error updating user profile", status: 500 });
//         }
//     } catch (e) {
//         console.error("Outer error:", e);
//         return NextResponse.json({ error: "Error processing request", e, status: 500 });
//     }
// }

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log(body, "put");
    console.log(body.userId, "body.userId");

    const existingUserByPhone = await prisma.user.findUnique({
      where: { phone: body.phone },
    });

    if (existingUserByPhone && existingUserByPhone.id !== body.userId) {
      console.log("Phone number already exists");

      return NextResponse.json({
        error: "Phone number already exists",
        status: 400,
      });
    }

    const oldUserDetails = await prisma.personalInfo.findUnique({
      where: {
        userid: body?.userId,
      },
    });

    if (!oldUserDetails) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    await prisma.personalInfoHistory.create({
      data: {
        address1: oldUserDetails?.address1,
        address2: oldUserDetails?.address2,
        state: oldUserDetails?.state,
        phoneNumber: oldUserDetails?.phoneNumber,
        country: oldUserDetails.country,
        firstName: oldUserDetails.firstName,
        email: body.email,
        lastName: oldUserDetails.lastName ?? "",
        // avatarUrl: oldUserDetails.avatarUrl,
        pincode: oldUserDetails.pincode,
        city: oldUserDetails.city,
        salutation: oldUserDetails?.salutation,
        // comments: oldUserDetails?.comments,
        uniqueId: oldUserDetails?.uniqueId,
        personalInfoId: oldUserDetails?.id,
      },
    });

    const userDetails = await prisma.personalInfo.update({
      where: {
        userid: body.userId,
      },
      data: {
        salutation: body.salutation,
        address1: body.address1,
        address2: body.address2,
        state: body.state,
        phoneNumber: body.phone,
        // uniqueId: parseInt(body.uniqueId),
        country: body.country,
        firstName: body.firstName,
        lastName: body.lastName,
        // avatarUrl: body.avatarUrl,
        pincode: body.pincode,
        city: body.city,
        // isApproved: body.isApproved || "pending",
        // comments: body.comments,
      },
    });

    // Update user
    const user = await prisma.user.update({
      where: {
        id: body.userId,
      },
      data: {
        email: body.email,
        phone: body.phone,
      },
    });

    console.log("Update completed:", userDetails, user);
    return NextResponse.json({
      userDetails,
      user,
      status: 200,
      success: "User profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({
      error: "Error updating user profile",
      status: 500,
    });
  }
}

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const userId = url.searchParams.get("userId");
//     if (!userId) {
//       return NextResponse.json({ error: "User ID is required", status: 400 });
//     }

//     try {
//       const userDetails = await prisma.personalInfo.findUnique({
//         where: {
//           userid: userId,
//         },
//       });

//       const user = await prisma.user.findUnique({
//         where: {
//           id: userId,
//         },
//       });

//       if (!userDetails) {
//         return NextResponse.json({ error: "User not found", status: 404 });
//       }

//       if (!user) {
//         return NextResponse.json({ error: "User not found", status: 404 });
//       }

//       return NextResponse.json({
//         userDetails,
//         user,
//         status: 200,
//         success: "User profile found",
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({
//       error: "Error in getting user profile",
//       status: 500,
//     });
//   }
// }

// In route.ts, update the relationships GET endpoint


// In route.ts, update the GET endpoint
// In route.ts, update the GET endpoint
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        status: 400, 
        error: "User ID is required" 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        personalInfo: true,
        // Include father's details with their personalInfo
        father: {
          include: {
            personalInfo: {
              select: {
                firstName: true,
                lastName: true,
                salutation: true,
                phoneNumber: true
              }
            }
          }
        },
        // Keep existing children relationships
        children: {
          include: {
            personalInfo: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ 
        status: 404, 
        error: "User not found" 
      });
    }

    // Format relationships including father
    const relationships = [
      // Add father if exists
      ...(user.father ? [{
        id: user.father.id,
        relation: 'father',
        firstName: user.father.personalInfo?.firstName,
        lastName: user.father.personalInfo?.lastName,
        salutation: user.father.personalInfo?.salutation,
        phone: user.father.personalInfo?.phoneNumber
      }] : []),
      // Add children
      ...user.children.map(child => ({
        id: child.id,
        relation: 'son', // You might want to determine this based on additional data
        firstName: child.personalInfo?.firstName,
        lastName: child.personalInfo?.lastName,
        phone: child.phone
      }))
    ];

    return NextResponse.json({
      status: 200,
      userDetails: {
        salutation: user.personalInfo?.salutation,
        firstName: user.personalInfo?.firstName,
        lastName: user.personalInfo?.lastName,
        address1: user.personalInfo?.address1,
        address2: user.personalInfo?.address2,
        city: user.personalInfo?.city,
        state: user.personalInfo?.state,
        country: user.personalInfo?.country,
        pincode: user.personalInfo?.pincode,
        phoneNumber: user.phone,
        uniqueId: user.personalInfo?.uniqueId,
      },
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
      },
      relationships,
      father: user.father ? {
        id: user.father.id,
        firstName: user.father.personalInfo?.firstName,
        lastName: user.father.personalInfo?.lastName,
        salutation: user.father.personalInfo?.salutation,
        phone: user.father.personalInfo?.phoneNumber
      } : null
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ 
      status: 500, 
      error: "Internal server error" 
    });
  }
}

// for admin to delete user profile
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    console.log(body);

    if (!body.userId || !body.adminEmail) {
      return NextResponse.json({
        error: "You are not authorized",
        status: 400,
      });
    }

    const admin = await prisma.user.findUnique({
      where: {
        email: body.adminEmail,
      },
    });

    if (admin?.role.includes("Admin")) {
      return NextResponse.json({
        error: "You are not authorized",
        status: 403,
      });
    }

    const userDetails = await prisma.personalInfo.delete({
      where: {
        userid: body.userId,
      },
    });

    return NextResponse.json({
      userDetails,
      status: 200,
      success: "User profile deleted",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      error: "Error in deleting user profile",
      status: 500,
    });
  }
}

// for admin to approve user details
// export async function PATCH(req: Request) {
//   try {
//     const body = await req.json();
//     console.log(body.userId, body.adminEmail, body.isApproved);

//     if (!body.userId || !body.adminEmail || !body.isApproved) {
//       return NextResponse.json({ error: "data missing", status: 400 });
//     }

//     const admin = await prisma.user.findUnique({
//       where: {
//         email: body.adminEmail,
//       },
//     });

//     if (admin?.role.includes("Admin")) {
//       return NextResponse.json({
//         error: "You are not authorized",
//         status: 403,
//       });
//     }

//     const userDetails = await prisma.personalInfo.update({
//       where: {
//         userid: body.userId,
//       },
//       data: {
//         // isApproved: body.isApproved,
//       },
//     });

//     return NextResponse.json({
//       userDetails,
//       status: 200,
//       success: "User profile updated",
//     });
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({
//       error: "Error in updating user profile",
//       status: 500,
//     });
//   }
// }

// app/api/userDetails/route.ts - Update PATCH endpoint
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, userDetails, relationships } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required", status: 400 });
    }

    // First update personal info
    const updatedPersonalInfo = await prisma.personalInfo.update({
      where: { userid: id },
      data: {
        salutation: userDetails.salutation,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        address1: userDetails.address1,
        address2: userDetails.address2,
        city: userDetails.city,
        pincode: userDetails.pincode,
        state: userDetails.state,
        country: userDetails.country,
      }
    });

    // Then update user relationships
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        sons: {
          set: relationships
            ?.filter((r:Relationship) => r.relation === 'son')
            ?.map((r:Relationship) => ({ id: r.id })) || []
        },
        daughters: {
          set: relationships
            ?.filter((r: Relationship) => r.relation === 'daughter')
            ?.map((r: Relationship) => ({ id: r.id })) || []
        }
      },
      include: {
        personalInfo: true,
        sons: {
          include: {
            personalInfo: true
          }
        },
        daughters: {
          include: {
            personalInfo: true
          }
        }
      }
    });

    return NextResponse.json({
      status: 200,
      updatedUser,
      updatedPersonalInfo,
      success: "Profile updated successfully"
    });
    
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : 'Unknown error',
      status: 500 
    });
  }
}
