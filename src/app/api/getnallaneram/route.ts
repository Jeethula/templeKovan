import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';


const PROKERALA_API_BASE = 'https://api.prokerala.com/v2/astrology';

const CLIENT_ID =process.env.NALLANERAM_CLIENT_ID
const CLIENT_SECRET =process.env.NALLANERAM_CLIENT_SECRET
console.log(CLIENT_ID);
console.log(CLIENT_SECRET);


export async function GET() {
  try {
    await fetchAndStoreNallaNeram();
    return NextResponse.json({ 
      success: true, 
      message: 'Nalla Neram data fetched and stored successfully' 
    });
  } catch (error) {
    console.error('Error in Nalla Neram API:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch Nalla Neram data' },
      { status: 500 }
    );
  }
}

async function fetchAndStoreNallaNeram() {
  const ayanamsa = 1;
  const coordinates = '11.0168,76.9558';
  
  const now = new Date();
  const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  istDate.setHours(0, 0, 0, 0);
  
  const datetime = encodeURIComponent(istDate.toISOString());
  const url = `${PROKERALA_API_BASE}/gowri-nalla-neram?ayanamsa=${ayanamsa}&coordinates=${coordinates}&datetime=${datetime}&la=ta`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${await getAccessToken()}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  
  await prisma.nallaNeram.upsert({
    where: {
      date: istDate,
    },
    update: {
      muhurat: data.data.muhurat,
      updatedAt: new Date(),
    },
    create: {
      date: istDate,
      muhurat: data.data.muhurat,
    },
  });

  return data;
}

async function getAccessToken() {
  try {
    const tokenUrl = 'https://api.prokerala.com/token';
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    console.log(data);
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}
