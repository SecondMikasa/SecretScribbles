import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

// export { default } from "next-auth/middleware"

export async function middleware(request: NextRequest) {
    //NOTE: token will contain session if user is authenticated otherwise null
    const token = await getToken({ req: request })

    const url = request.nextUrl

    if (token &&
        (
        url.pathname.startsWith('/sign-in')
        ||
        url.pathname.startsWith('/sign-up')
        ||
        url.pathname.startsWith('/verify')
        // ||
        // url.pathname.startsWith('/')
        )) {
        //NOTE: The second argument (request.url) provides the base URL of the current request
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        // '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}