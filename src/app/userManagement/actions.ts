"use server";

import prisma from "@/utils/prisma";

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        personalInfo: {
          select: {
            firstName: true,
            lastName: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            pincode: true,
            country: true,
          },
        },
        sons: {
          select: {
            id: true,
            phone: true,
            personalInfo: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        daughters: {
          select: {
            id: true,
            phone: true,
            personalInfo: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return users.map((user) => ({
      userid: user.id,
      firstName: user.personalInfo?.firstName || "",
      lastName: user.personalInfo?.lastName ?? "",
      email: user.email || "",
      role: user.role || [],
      Phone: user.phone || "",
      address1: user.personalInfo?.address1 || "",
      address2: user.personalInfo?.address2 || "",
      city: user.personalInfo?.city || "",
      state: user.personalInfo?.state || "",
      pincode: user.personalInfo?.pincode || "",
      country: user.personalInfo?.country || "",
      relationships: [
        ...user.sons.map((son) => ({
          id: son.id,
          relation: "son" as const,
          firstName: son.personalInfo?.firstName,
          lastName: son.personalInfo?.lastName,
          phone: son.phone,
        })),
        ...user.daughters.map((daughter) => ({
          id: daughter.id,
          relation: "daughter" as const,
          firstName: daughter.personalInfo?.firstName,
          lastName: daughter.personalInfo?.lastName,
          phone: daughter.phone,
        })),
      ],
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
