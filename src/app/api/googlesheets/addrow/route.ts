import { NextResponse } from "next/server";
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

export async function POST(req: Request) {
  try {
    const sheets = google.sheets({ version: 'v4', auth });

    const body = await req.json();
    const sheetMetadata = await sheets.spreadsheets.get({
      spreadsheetId,
      ranges: ['Sheet1!1:1'],
      fields: 'sheets.data.rowData.values.userEnteredValue',
    });

    const headerRow = sheetMetadata.data.sheets?.[0].data?.[0].rowData?.[0].values?.map(
      cell => cell.userEnteredValue?.stringValue
    ) || [];
    const newRow = headerRow.map(header => (header ? body[header] : '') || '');


    const appendResult = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [newRow]
      },
    });

    console.log("Append result:", appendResult.data);

    return NextResponse.json({ message: "Row added successfully!", updatedRange: appendResult.data.updates?.updatedRange });
  } catch (error) {
    console.error("Error adding row to Google Sheets:", error);
    return NextResponse.json({ error: "Failed to add row." }, { status: 500 });
  }
}