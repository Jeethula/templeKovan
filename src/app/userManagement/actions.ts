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
            uniqueId: true
          },
        },
        father: {
          select: {
            id: true,
            phone: true,
            personalInfo: {
              select: {
                firstName: true,
                lastName: true,
                salutation: true
              },
            },
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
                salutation: true
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
                salutation: true
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
      unique_id: user.personalInfo?.uniqueId || "",
      relationships: [
        ...(user.father ? [{
          id: user.father.id,
          relation: "father" as const,
          firstName: user.father.personalInfo?.firstName,
          lastName: user.father.personalInfo?.lastName,
          salutation: user.father.personalInfo?.salutation,
          phone: user.father.phone,
        }] : []),
        ...user.sons.map((son) => ({
          id: son.id,
          relation: "son" as const,
          firstName: son.personalInfo?.firstName,
          lastName: son.personalInfo?.lastName,
          salutation: son.personalInfo?.salutation,
          phone: son.phone,
        })),
        ...user.daughters.map((daughter) => ({
          id: daughter.id,
          relation: "daughter" as const,
          firstName: daughter.personalInfo?.firstName,
          lastName: daughter.personalInfo?.lastName,
          salutation: daughter.personalInfo?.salutation,
          phone: daughter.phone,
        })),
      ],
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
