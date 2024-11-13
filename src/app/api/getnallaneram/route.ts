import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();
const PROKERALA_API_BASE = 'https://api.prokerala.com/v2/astrology';
// const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
// const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

const CLIENT_ID ='be487840-5568-4204-8ceb-74b53abaa6f3'
const CLIENT_SECRET='AefwKzAnvBgWPAtf5f55BVylKxhPv55JrNDKoiP8'

// Initialize cron job to run at 12 AM IST (6:30 PM UTC)
cron.schedule('0 0 * * *', async () => {
  console.log('Running Nalla Neram cron job at:', new Date().toISOString());
  await fetchAndStoreNallaNeram();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

async function fetchAndStoreNallaNeram() {
  try {
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
      throw new Error(`API request failed: ${response.statusText}`);
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
  } catch (error) {
    console.error('Error in automated Nalla Neram fetch:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Modify the GET handler to use the same function
export async function GET() {
  try {
    const data = await fetchAndStoreNallaNeram();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch/store Nalla Neram data' },
      { status: 500 }
    );
  }
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
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}
