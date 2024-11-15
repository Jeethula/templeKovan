// lib/syncGoogleSheets.ts
import { updateGoogleSheet } from './googleSheets';
import prisma from '@/utils/prisma';

function sanitizeData(data: any[]): any[] {
  return data.map(item => {
    const sanitizedItem: any = {};
    for (const [key, value] of Object.entries(item)) {
      if (value === null || value === undefined) {
        sanitizedItem[key] = '';
      } else if (Array.isArray(value)) {
        sanitizedItem[key] = value.join(', ');
      } else if (value instanceof Date) {
        sanitizedItem[key] = value.toISOString();
      } else if (typeof value === 'string' && value.length > 49000) {
        if (value.startsWith('data:image')) {
          sanitizedItem[key] = '[IMAGE DATA]';
        } else {
          sanitizedItem[key] = value.substring(0, 49000) + '...';
        }
      } else if (typeof value === 'object') {
        sanitizedItem[key] = JSON.stringify(value);
      } else {
        sanitizedItem[key] = value;
      }
    }
    return sanitizedItem;
  });
}

export async function syncAllTables(spreadsheetId: string) {
  const tables = {
    'user': 'Sheet5',
    'personalInfo': 'Sheet6',
    'services': 'Sheet7',
    'post': 'Sheet8',
    'serviceAdd': 'Sheet9',
    'personalInfoHistory': 'Sheet10'
  };

  for (const [tableName, sheetTitle] of Object.entries(tables)) {
    try {
      console.log(`Syncing ${tableName} to ${sheetTitle}...`);
      await syncTableToGoogleSheet(tableName, spreadsheetId, sheetTitle);
    } catch (error) {
      console.error(`Failed to sync ${tableName}:`, error);
      // Continue with other tables even if one fails
    }
  }
}

export async function syncTableToGoogleSheet(tableName: string, spreadsheetId: string, sheetTitle: string) {
  if (!spreadsheetId || !sheetTitle) {
    throw new Error('Missing required parameters');
  }

  try {
    const data = await (prisma as any)[tableName].findMany();
    if (!data || data.length === 0) {
      console.warn(`No data found in table ${tableName}`);
      return;
    }

    // Sanitize data before sending to Google Sheets
    const sanitizedData = sanitizeData(data);
    await updateGoogleSheet(spreadsheetId, sheetTitle, sanitizedData);
  } catch (error) {
    console.error(`Error syncing ${tableName}:`, error);
    throw error;
  }
}