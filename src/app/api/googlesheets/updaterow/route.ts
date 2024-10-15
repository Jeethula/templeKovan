import { NextResponse, NextRequest } from "next/server";
import { google } from "googleapis";

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
if (!spreadsheetId) {
  throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not defined");
}

const CREDENTIALS = {
    type:process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id:process.env.PRIVATE_KEY_ID,
    private_key:process.env.PRIVATE_KEY,
    client_email:process.env.CLIENT_EMAIL,
    client_id: "114302669955130166634",
    auth_uri:process.env.AUTH_URI,
    token_uri:process.env.TOKEN_URI,
    auth_provider_x509_cert_url:process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url:process.env.CLIENT_X509_CERT_URL,
  };

const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function POST(req: NextRequest) {
  try {
    const sheets = google.sheets({ version: 'v4', auth });

    const body = await req.json();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1', 
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      throw new Error("No data found in the sheet");
    }

    const headers = rows[0];
    const phoneNumberIndex = headers.findIndex((header: string) => header.toLowerCase() === 'phoneNumber');

    if (phoneNumberIndex === -1) {
      throw new Error("Email column not found in the sheet");
    }

    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][phoneNumberIndex]?.trim() === body.phone.trim()) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error("No matching email found to update");
    }

    const updatedRow = [...rows[rowIndex]];
    Object.keys(body).forEach(key => {
      const colIndex = headers.findIndex((header: string) => header.toLowerCase() === key.toLowerCase());
      if (colIndex !== -1) {
        updatedRow[colIndex] = body[key];
        console.log("Updating key:", key, "with value:", body[key]);
      }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!A${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [updatedRow]
      }
    });

    console.log("Row updated successfully");
    return NextResponse.json({ message: "Row updated successfully!" });

  } catch (error) {
    console.error("Error updating row in Google Sheets:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update row." },
      { status: 500 }
    );
  }
}
