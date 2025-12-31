import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { pin } = await request.json();

        // Validate PIN against environment variable
        if (pin === process.env.HOUSEHOLD_PIN) {
            // Create response first
            const response = NextResponse.json({ success: true });
            
            // Set secure auth cookie (valid for 30 days)
            // Use 'lax' for better compatibility with incognito/private browsing
            const isProduction = process.env.NODE_ENV === 'production';
            
            // Set cookie directly in the response
            response.cookies.set('household-auth', process.env.AUTH_SECRET!, {
                httpOnly: true,
                secure: isProduction, // Only require HTTPS in production
                sameSite: 'lax', // Better compatibility than 'none'
                maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
                path: '/',
            });
            
            return response;
        }

        // Invalid PIN
        return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

