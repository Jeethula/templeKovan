import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const requiredEnvVars = {
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const serviceAccountAuth = new JWT({
  email: process.env.CLIENT_EMAIL,
  key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function updateGoogleSheet(spreadsheetId, sheetTitle, data) {
  console.log('Starting sheet update...');
  if (!data || data.length === 0) {
    throw new Error('No data provided for update');
  }

  const jsonData = JSON.stringify(data);
  if (jsonData.length > 10000000) {
    throw new Error('Data size too large for Google Sheets API');
  }

  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);

  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[sheetTitle];

  if (!sheet) {
    throw new Error(`Sheet with title "${sheetTitle}" not found.`);
  }

  await sheet.clear();
  await sheet.setHeaderRow(Object.keys(data[0]));
  await sheet.addRows(data);
}
