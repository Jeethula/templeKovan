
import { NextResponse } from 'next/server';
import { syncAllTables } from '../../../../lib/syncGoogleSheets';

export async function GET() {
    try {
        const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
        if (!spreadsheetId) {
            throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not configured');
        }

        await syncAllTables(spreadsheetId);
        
        return NextResponse.json(
            { message: 'All tables synced to Google Sheets successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { message: 'Error syncing to Google Sheets', error: (error as Error).message },
            { status: 500 }
        );
    }
}