import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

const PROKERALA_API_BASE = 'https://api.prokerala.com/v2/astrology';
const CLIENT_ID = process.env.NALLANERAM_CLIENT_ID || '';
const CLIENT_SECRET = process.env.NALLANERAM_CLIENT_SECRET || '';

function validateEnvVars() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing API credentials. Ensure CLIENT_ID and CLIENT_SECRET are set in the environment.');
  }
}

function formatDateForAPI(date: Date): string {
  const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  const hours = String(istDate.getHours()).padStart(2, '0');
  const minutes = String(istDate.getMinutes()).padStart(2, '0');
  const seconds = String(istDate.getSeconds()).padStart(2, '0');
  return encodeURIComponent(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`);
}

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken() {
  validateEnvVars();

  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const tokenUrl = 'https://api.prokerala.com/token';
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }).toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Token request failed: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

async function fetchAndStoreNallaNeram() {
  const ayanamsa = 1;
  const coordinates = '11.0168,76.9558';
  const now = new Date();
  const datetime = formatDateForAPI(now);
  
  const accessToken = await getAccessToken();
  const url = `${PROKERALA_API_BASE}/gowri-nalla-neram?ayanamsa=${ayanamsa}&coordinates=${coordinates}&datetime=${datetime}&la=ta`;

  console.log('Formatted datetime for API:', datetime);
  console.log('Requesting Nalla Neram data from:', url);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API request failed: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  istDate.setHours(0, 0, 0, 0);

  try {
    await prisma.nallaNeram.deleteMany();
    await prisma.nallaNeram.create({
      data: {
        date: istDate,
        muhurat: data.data.muhurat,
      },
    });
  } catch (dbError) {
    console.error('Error with database operations:', dbError);
    throw new Error('Failed to store Nalla Neram data in the database.');
  }

  return data;
}

export async function GET() {
  try {
    await fetchAndStoreNallaNeram();
    return NextResponse.json({
      success: true,
      message: 'Nalla Neram data fetched and stored successfully',
    });
  } catch (error) {
    console.error('Error in Nalla Neram API:', error);
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 },
    );
  }
}
