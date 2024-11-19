import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

// api/services/user - GET all the services of the user by the user
export async function GET(req:NextRequest) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const limit = parseInt(url.searchParams.get("limit") || "8");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const serviceName = url.searchParams.get("serviceName");
    const search = url.searchParams.get("search");

    if (!userId) {
        return NextResponse.json({error: "User ID is required", status: 400});
    }

    try {
        // Fixed where clause
        const whereClause: any = {
            userId: userId
        };

        if (serviceName && serviceName !== 'All') {
            whereClause.nameOfTheService = {
                name: serviceName
            };
        }

        if (search) {
            whereClause.OR = [
                {
                    nameOfTheService: {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    transactionId: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    status: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }

        // Get total count and paginated services
        const [total, services] = await Promise.all([
            prisma.services.count({ where: whereClause }),
            prisma.services.findMany({
                where: whereClause,
                skip: offset,
                take: limit,
                select: {
                    id: true,
                    nameOfTheService: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    description: true,
                    price: true,
                    image: true,
                    status: true,
                    approvedBy: {
                        select: {
                            phone: true,
                            personalInfo: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    },
                    posUser: {
                        select: {
                            phone: true,
                            email: true,
                            personalInfo: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    },
                    serviceDate: true,
                    paymentMode: true,
                    transactionId: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        ]);

        return NextResponse.json({
            services: {
                services,
                total
            },
            status: 200
        });
    } catch(e) {
        console.error('Error fetching services:', e);
        return NextResponse.json({
            error: "Failed to fetch services",
            details: e instanceof Error ? e.message : "Unknown error",
            status: 500
        });
    }
}

// api/services/user - POST create a service by the user
export async function POST(req: NextRequest) {
    const { userId, nameOfTheServiceid, description, amount, image, paymentMode, transactionId, serviceDate } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: "User ID is required", status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found", status: 404 });
        }

        const service = await prisma.services.create({
            data: {
                nameOfTheService:{
                    connect:{id:nameOfTheServiceid}
                },
                description,
                price: parseInt(amount),
                image,
                serviceDate: serviceDate?new Date(serviceDate):null,
                paymentMode,
                transactionId,
                User: {
                    connect: { id: userId }
                }
            }
        });
        return NextResponse.json({ service: service, status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e, status: 500 });
    }
}