import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get('household-auth');

        // Check if authenticated
        if (authCookie && authCookie.value === process.env.AUTH_SECRET) {
            return NextResponse.json({ authenticated: true });
        }

        // Not authenticated
        return NextResponse.json(
            { authenticated: false, error: 'Not authenticated' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { authenticated: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}



