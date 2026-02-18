'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard() {
    const router = useRouter();
    const pathname = usePathname();
    const isCheckingRef = useRef(false);
    const lastCheckRef = useRef(0);

    useEffect(() => {
        // Skip auth check on login and auth callback (Supabase → app redirect)
        if (pathname === '/login' || pathname === '/auth/callback') return;

        // Check authentication status
        const checkAuth = async () => {
            // Prevent concurrent checks
            if (isCheckingRef.current) return;
            
            // Throttle checks to max once per 5 seconds
            const now = Date.now();
            if (now - lastCheckRef.current < 5000) return;
            
            isCheckingRef.current = true;
            lastCheckRef.current = now;

            try {
                const response = await fetch('/api/auth/check', {
                    method: 'GET',
                    cache: 'no-store',
                });

                if (response.status === 401 || !response.ok) {
                    // Not authenticated - redirect to login
                    router.push('/login');
                }
            } catch (error) {
                // Silently fail on network errors
            } finally {
                isCheckingRef.current = false;
            }
        };

        // Check immediately
        checkAuth();

        // Check when window regains focus (user switches back to tab)
        const handleFocus = () => checkAuth();
        window.addEventListener('focus', handleFocus);

        // Check when page becomes visible
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkAuth();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Periodic check every 30 seconds
        const interval = setInterval(checkAuth, 30000);

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(interval);
        };
    }, [pathname, router]);

    return null; // This component doesn't render anything
}

