import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// /lib/utils.ts
export function getDateRange(reportType: string, baseDate: Date) {
  const startDate = new Date(baseDate);
  const endDate = new Date(baseDate);

  switch (reportType) {
    case 'daily':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'weekly':
      startDate.setDate(startDate.getDate() - startDate.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'monthly':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'custom':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
  }

  return { startDate, endDate };
}

export async function convertToCSV(data: Record<string, unknown>[]) {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header]?.toString() || '';
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

// /middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { auth } from '@/auth';

// export async function middleware(request: NextRequest) {
//   // Only apply to API routes
//   if (request.nextUrl.pathname.startsWith('/api')) {
//     // Check authentication
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json(
//         { error: 'Authentication required' },
//         { status: 401 }
//       );
//     }

//     // Rate limiting implementation
//     const ip = request.ip || 'unknown';
//     const rateLimit = await checkRateLimit(ip);
    
//     if (!rateLimit.allowed) {
//       return NextResponse.json(
//         { error: 'Too many requests' },
//         {
//           status: 429,
//           headers: {
//             'Retry-After': rateLimit.retryAfter.toString(),
//           },
//         }
//       );
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: '/api/:path*',
// };

// /lib/validation.ts
export function validateDateRange(startDate: Date, endDate: Date) {
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date format');
  }

  if (startDate > endDate) {
    throw new Error('Start date must be before end date');
  }

  const maxRange = 366;
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > maxRange) {
    throw new Error(`Date range cannot exceed ${maxRange} days`);
  }
}

export function validateReportType(reportType: string) {
  const validTypes = ['daily', 'weekly', 'monthly', 'custom'];
  if (!validTypes.includes(reportType)) {
    throw new Error('Invalid report type');
  }
}

// // /lib/rate-limit.ts
// import { Redis } from '@upstash/redis';

// const redis = Redis.fromEnv();

// export async function checkRateLimit(ip: string) {
//   const REQUESTS_PER_MINUTE = 60;
//   const now = Date.now();
//   const key = `rate-limit:${ip}`;
  
//   const [count] = await redis.pipeline()
//     .incr(key)
//     .expire(key, 60)
//     .exec();

//   if (count > REQUESTS_PER_MINUTE) {
//     return {
//       allowed: false,
//       retryAfter: 60,
//     };
//   }

//   return {
//     allowed: true,
//     retryAfter: 0,
//   };
// }