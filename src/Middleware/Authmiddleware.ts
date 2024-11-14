// middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server'
import * as jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'

interface JWTPayload {
  userId: string
  
}

export function middleware(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JWTPayload
    
    // Add the user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.userId)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

  } catch (error) {
    console.log(error)
    return new NextResponse('Invalid token', {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = {
  matcher: [
    '/api/:path*', 
  ]
}