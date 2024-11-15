// // lib/prismaMiddleware.ts
// import { PrismaClient, Prisma } from '@prisma/client';
// import { syncTableToGoogleSheet } from './syncGoogleSheets';

// const prisma = new PrismaClient();

// const modelToSheetMapping = {
//   User: 'Sheet5',
//   PersonalInfo: 'Sheet6',
//   Services: 'Sheet7',
//   Post: 'Sheet8',
//   ServiceAdd: 'Sheet9',
//   PersonalInfoHistory: 'Sheet10'
// } as const;

// // Add debug logging
// const debugLog = (message: string, params: any) => {
//   console.log(`[Prisma Debug] ${message}`, {
//     model: params.model,
//     action: params.action,
//     args: params.args
//   });
// };

// prisma.$use(async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
//   debugLog('Operation started:', params);
//   const result = await next(params);
//   const shouldSync = 
//     ['create', 'update', 'delete'].includes(params.action) || 
//     (params.action === 'findMany' && params.model === 'Services') ||
//     (params.model === 'Services' && params.action === 'upsert');

//   if (shouldSync) {
//     try {
//       const model = params.model?.toLowerCase() || '';
//       const sheetName = modelToSheetMapping[params.model as keyof typeof modelToSheetMapping];
      
//       if (sheetName) {
//         console.log(`Syncing ${model} to ${sheetName} after ${params.action}...`);
//         await syncTableToGoogleSheet(
//           model, 
//           process.env.GOOGLE_SHEETS_SPREADSHEET_ID!, 
//           sheetName
//         );
//         console.log(`Sync completed for ${model}`);
//       }
//     } catch (error) {
//       console.error(`Failed to sync ${params.model} to Google Sheets:`, error);
//     }
//   }

//   return result;
// });

// export default prisma;