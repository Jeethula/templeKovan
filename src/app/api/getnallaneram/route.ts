import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

const PROKERALA_API_BASE = 'https://api.prokerala.com/v2/astrology';
const CLIENT_ID = process.env.NALLANERAM_CLIENT_ID || '';
const CLIENT_SECRET = process.env.NALLANERAM_CLIENT_SECRET || '';

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Missing API credentials');
}

function formatDateForAPI(date: Date): string {
  // Convert to IST
  const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  
  // Format date components
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  const hours = String(istDate.getHours()).padStart(2, '0');
  const minutes = String(istDate.getMinutes()).padStart(2, '0');
  const seconds = String(istDate.getSeconds()).padStart(2, '0');
  
  const formatted = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
  return encodeURIComponent(formatted);
}

async function getAccessToken() {
  try {
    const tokenUrl = 'https://api.prokerala.com/token';
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Token request failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

async function fetchAndStoreNallaNeram() {
  const ayanamsa = 1; // Lahiri
  const coordinates = '11.0168,76.9558';
  const now = new Date();
  const datetime = formatDateForAPI(now);
  
  const accessToken = await getAccessToken();
  const url = `${PROKERALA_API_BASE}/gowri-nalla-neram?ayanamsa=${ayanamsa}&coordinates=${coordinates}&datetime=${datetime}&la=ta`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });


  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API request failed: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  
  const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  istDate.setHours(0, 0, 0, 0);

  await prisma.nallaNeram.deleteMany()

  await prisma.nallaNeram.create({
    data: {
      date: istDate,
      muhurat: data.data.muhurat,
    }
  })

  return  data;
}

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
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}
