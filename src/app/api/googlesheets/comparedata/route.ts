import prisma from '@/utils/prisma';
import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const CREDENTIALS = {
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: "114302669955130166634",
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    };

  try {
    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch all data from A to N
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A2:N',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'No data found in Google Sheets.' }, { status: 404 });
    }

    // Map sheet columns to database fields
    const sheetsData = rows.map(row => ({
      firstName: row[0],
      lastName: row[1],
      phoneNumber: row[2],
      address1: row[3],
      address2: row[4],
      city: row[5],
      state: row[6],
      pincode: row[7],
      country: row[8],
      comments: row[9],
      email: row[10],
      avatarUrl: row[11],
      salutation: row[12],
      uniqueId: row[13],
    }));

    // Fetch existing personal info data
    const existingPersonalInfo = await prisma.personalInfo.findMany({});

    const updates = [];

    for (const sheetData of sheetsData) {
      const existingInfo = existingPersonalInfo.find(info => info.phoneNumber === sheetData.phoneNumber);

      if (existingInfo) {
        // User exists, check for updates in personalInfo
        const personalInfoUpdates: { [key: string]: any } = {};
        let hasUpdates = false;

        for (const [key, value] of Object.entries(sheetData)) {
          if (key !== 'phoneNumber' && existingInfo[key as keyof typeof existingInfo] !== value) {
            personalInfoUpdates[key] = value;
            hasUpdates = true;
          }
        }

        if (hasUpdates) {
          updates.push(prisma.personalInfo.update({
            where: { id: existingInfo.id },
            data: personalInfoUpdates,
          }));
        }
      }
      // We're not handling new users or email changes in this version
    }

    // Execute all updates in a transaction
    const result = await prisma.$transaction(updates);

    return NextResponse.json({ 
      message: 'PersonalInfo data updated successfully', 
      updatesCount: result.length 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process data from Google Sheets.' }, { status: 500 });
  }
}