import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import prisma from '@/utils/prisma';

const API_KEY = "f73cf02b-9077-11ef-8b17-0200cd936042";
const BASE_URL = 'https://2factor.in/API/V1';

export async function POST(req: NextRequest) {
  const { phoneNumber, action, otp } = await req.json();
  console.log(phoneNumber,action,otp);
  
  if (action === 'send') {
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    const url = `${BASE_URL}/${API_KEY}/SMS/91${phoneNumber}/${otpValue}/OTP_DEFAULT`;

    const user = await prisma.user.findUnique({
      where: {
        phone: phoneNumber
      }
    })

    if(!user){
      return NextResponse.json({ success: false, error: 'Phone number not found' }, { status: 200 });
    }

    try {
      const response = await axios.get(url);
      return NextResponse.json({ 
        success: true, 
        sessionId: response.data.Details,
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 });
    }
  } else if (action === 'verify') {

    const user = await prisma.user.findUnique({
        where: {
          phone: phoneNumber
        },
        select:{
            email: true,
            phone: true,
            role:true,
            id:true
        }
      })
    
    const storedOtp = otp; 

    if (otp === storedOtp) {

      return NextResponse.json({ success: true, verified: true , user: user});
    } else {
      return NextResponse.json({ success: false, verified: false, error: 'Invalid OTP' });
    }
  }

  return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
}
