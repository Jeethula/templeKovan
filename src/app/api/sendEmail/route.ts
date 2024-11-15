
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { sendEmail } from '@/utils/sendEmail';

interface Service {
  serviceId: string;
}

export async function POST(req: Request) {
  try {
    const { serviceId }: Service = await req.json();
    
    if (!serviceId) {
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }

    const service = await prisma.services.findUnique({
        where: { id: serviceId },
        select: {
            nameOfTheService: {
                select: {
                    name: true
                }
            },
            transactionId: true,
            price: true,
            status: true,
            approvedBy:{
                select: {
                    email: true,
                    phone:true,
                    personalInfo:{
                        select:{
                            firstName:true,
                            lastName:true,
                        }
                    }
                }
            },
            User:{
                select:{
                    email:true
            }
          }
        }
    });

    if (!service || !service.approvedBy || !service.approvedBy.personalInfo) {
      return NextResponse.json(
        { success: false, message: 'Service or approver details not found' },
        { status: 404 }
      );
    }

    try {
      await sendEmail({
        to: service.User.email,
        subject: 'Seva Booking Confirmation',
        text: `Your Seva has been booked successfully. Seva ID: ${serviceId}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #663399; margin: 0; font-size: 24px;">Transaction Confirmation</h1>
      <p style="color: #666; margin-top: 10px;">Thank you for your booking</p>
    </div>

    <div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
      <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Service Details</h2>
      <p style="margin: 5px 0; color: #555;">
        <strong>Service Name:</strong> ${service?.nameOfTheService.name}
      </p>
      <p style="margin: 5px 0; color: #555;">
        <strong>Transaction ID:</strong> ${service?.transactionId}
      </p>
      <p style="margin: 5px 0; color: #555;">
        <strong>Amount:</strong> ₹${service?.price}
      </p>
      <p style="margin: 5px 0; color: #555;">
        <strong>Status:</strong> <span style="color: ${service?.status === 'APPROVED' ? '#4CAF50' : '#FFA500'}">${service?.status}</span>
      </p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Approved By</h2>
      <p style="margin: 5px 0; color: #555;">
        <strong>Name:</strong> ${service?.approvedBy.personalInfo.firstName} ${service?.approvedBy.personalInfo.lastName}
      </p>
      <p style="margin: 5px 0; color: #555;">
        <strong>Email:</strong> ${service?.approvedBy.email}
      </p>
      <p style="margin: 5px 0; color: #555;">
        <strong>Phone:</strong> ${service?.approvedBy.phone}
      </p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="color: #888; font-size: 14px;">
        If you have any questions, please contact our support team.
      </p>
    </div>
  </div>
</body>
</html>
        `,
      });
    } catch (emailError: any) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send confirmation email',
          error: emailError.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Seva booked successfully' 
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to book Seva' },
      { status: 500 }
    );
  }
}