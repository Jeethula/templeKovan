import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/utils/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ 
        error: "Search query is required", 
        status: 400 
      });
    }
    // Date parsing logic remains the same
    let parsedDate: Date | undefined;
    if (query.includes('/')) {
      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const match = query.match(dateRegex);
      
      if (match) {
        const [, day, month, year] = match;
        const paddedDay = day.padStart(2, '0');
        const paddedMonth = month.padStart(2, '0');
        const dateString = `${year}-${paddedMonth}-${paddedDay}`;
        const tempDate = new Date(dateString);
        
        if (!isNaN(tempDate.getTime()) && 
            tempDate.getDate() === parseInt(day) && 
            tempDate.getMonth() === parseInt(month) - 1 && 
            tempDate.getFullYear() === parseInt(year)) {
          parsedDate = tempDate;
        }
      }
    }

    // Batch all queries using prisma.$transaction
    const [users, personalInfo, services, serviceAdd, serviceLimits] = await prisma.$transaction([
      prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
            { referral: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          referral: true,
          createdAt: true
        },
      }),
      
      prisma.personalInfo.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { address1: { contains: query, mode: "insensitive" } },
            { address2: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { state: { contains: query, mode: "insensitive" } },
            { country: { contains: query, mode: "insensitive" } },
            { phoneNumber: { contains: query, mode: "insensitive" } },
            { pincode: { contains: query, mode: "insensitive" } },
            { salutation: { contains: query, mode: "insensitive" } },
            { uniqueId: { equals: parseInt(query) || undefined } }
          ]
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          address1: true,
          address2: true,
          city: true,
          state: true,
          country: true,
          phoneNumber: true,
          pincode: true,
          uniqueId: true,
          userid: true
        }
      }),

      prisma.services.findMany({
        where: {
          OR: [
            { description: { contains: query, mode: "insensitive" } },
            { transactionId: { contains: query, mode: "insensitive" } },
            { status: { contains: query, mode: "insensitive" } },
            { paymentMode: { contains: query, mode: "insensitive" } },
            { price: { equals: parseInt(query) || undefined } },
            ...(parsedDate ? [{
              serviceDate: {
                gte: parsedDate,
                lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000)
              }
            }] : [])
          ]
        },
        select: {
          id: true,
          description: true,
          status: true,
          price: true,
          paymentMode: true,
          transactionId: true,
          serviceDate: true,
          nameOfTheService: {
            select: {
              name: true,
              description: true
            }
          }
        }
      }),

      prisma.serviceAdd.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { targetPrice: { equals: parseInt(query) || undefined } },
            { minAmount: { equals: parseInt(query) || undefined } },
            { maxCount: { equals: parseInt(query) || undefined } }
          ]
        },
        select: {
          id: true,
          name: true,
          description: true,
          targetPrice: true,
          minAmount: true,
          maxCount: true,
          isSeva: true,
          isActive: true
        }
      }),

      prisma.serviceLimit.findMany({
        where: {
          OR: [
            { thirumanjanam: { equals: parseInt(query) || undefined } },
            { abhisekam: { equals: parseInt(query) || undefined } },
            { thirumanjanamPrice: { equals: parseInt(query) || undefined } },
            { abhisekamPrice: { equals: parseInt(query) || undefined } }
          ]
        }
      })
    ]);

    // Format results
    const results = [
      ...users.map(user => ({
        type: 'user',
        label: `User: ${user.email || user.phone}`,
        url: `/userManagement?search=${user.email || user.phone}`,
        data: user
      })),
      ...personalInfo.map(info => ({
        type: 'profile',
        label: `Profile: ${info.firstName} ${info.lastName || ''} - ${info.city || ''}`,
        url: `/userManagement?search=${info.firstName}`,
        data: info
      })),
      ...services.map(service => ({
        type: 'service',
        label: `Service: ${service.nameOfTheService.name} - ${service.status} - ₹${service.price}`,
        url: `/serviceManagement/${service.id}`,
        data: service
      })),
      ...serviceAdd.map(service => ({
        type: 'serviceType',
        label: `Service Type: ${service.name} - ₹${service.targetPrice || 'N/A'}`,
        url: `/addSevas/${service.id}`,
        data: service
      })),
      ...serviceLimits.map(limit => ({
        type: 'serviceLimit',
        label: `Service Limit: Thirumanjanam: ₹${limit.thirumanjanamPrice}, Abhisekam: ₹${limit.abhisekamPrice}`,
        url: `/addSevas/${limit.id}`,
        data: limit
      }))
    ];

    return NextResponse.json({ 
      results, 
      counts: {
        users: users.length,
        profiles: personalInfo.length,
        services: services.length,
        serviceTypes: serviceAdd.length,
        serviceLimits: serviceLimits.length,
        total: results.length
      },
      status: 200 
    });

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ 
      error: "Error fetching search results", 
      status: 500 
    });
  }
}
