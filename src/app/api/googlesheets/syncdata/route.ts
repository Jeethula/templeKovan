import prisma from '@/utils/prisma';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const existingData = await prisma.user.findMany({
    select: {
      email: true,
    }
  });

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

    // Fetch all data from A to M
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A2:N',
    });

    const rows = response.data.values;
    console.log(rows);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'No data found in Google Sheets.' }, { status: 404 });
    }

    // Map all columns to their respective fields
    const sheetsData = rows.map(row => ({
      email: row[10], // Assuming email is in column K (index 10)
      avatarUrl: row[11],  // Assuming name is in column L (index 11)
      fullData: {
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
      }
    }));

    const newObjects = sheetsData.filter(sheetObj => 
      !existingData.some(existingObj => existingObj.email === sheetObj.email)
    );



    newObjects.forEach(async (newObj) => {
        console.log(typeof newObj.fullData.phoneNumber);
        
        const user=await prisma.user.create({
            data: {
            email: newObj.email,
            role: { set: ['user'] },
            phone:newObj.fullData.phoneNumber
            }
        });
        console.log(user);
        
        await prisma.personalInfo.create({
            data: {
                firstName: newObj.fullData.firstName,
                lastName: newObj.fullData.lastName,
                phoneNumber: newObj.fullData.phoneNumber,
                address1: newObj.fullData.address1,
                address2: newObj.fullData.address2,
                city: newObj.fullData.city,
                state: newObj.fullData.state,
                pincode: newObj.fullData.pincode,
                country: newObj.fullData.country,
                // comments: newObj.fullData.comments,
                uniqueId: parseInt(newObj.fullData.uniqueId),
                // avatarUrl: newObj.fullData.avatarUrl,
                salutation: newObj.fullData.salutation,
                user: {
                    connect: { id: user.id }
                }
            }
        });
    });


    return NextResponse.json(newObjects);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data from Google Sheets.' }, { status: 500 });
  }
}