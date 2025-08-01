import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')
    const publicPaths = [
        '/login', '/api/login',
        '/register', '/api/register'
    ]
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}