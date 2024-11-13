
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // This keeps the connection alive for background tasks
  return NextResponse.next()
}