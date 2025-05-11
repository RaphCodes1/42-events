import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient({req, res});

    // Cache the session data
    const session = await supabase.auth.getSession();

    // console.log('Access Token:', req.cookies.get('sb-access-token'));
    // console.log('Refresh Token:', req.cookies.get('sb-refresh-token'));

    // Check if the user is trying to access the admin page
    if (req.nextUrl.pathname.startsWith('/admin-page')) {
        // console.log("Middleware session:", session.data.session);
        // console.log("Middleware user ID:", session?.data?.session?.user?.id);
        // console.log('Cookies:', req.cookies.getAll());
        if (!session.data.session) {
            // If no session, redirect to login
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Check if the user has the admin role
        const { data: userData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.data.session.user.id)
            .single();

        if (!userData || userData.role !== 'admin') {
            // If not admin, redirect to home
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return res;
}

export const config = {
    matcher: [
        '/admin-page/:path*',
        '/((?!login|signup|api|_next/static|_next/image|favicon.ico).*)',
    ]
}