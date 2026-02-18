'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const APP_CALLBACK_URL =
  process.env.NEXT_PUBLIC_AUTH_CALLBACK_APP_URL || 'gatherly://auth/callback';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type') || 'email';
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    const q: string[] = [];
    if (tokenHash) q.push('token_hash=' + encodeURIComponent(tokenHash));
    if (type) q.push('type=' + encodeURIComponent(type));
    if (accessToken) q.push('access_token=' + encodeURIComponent(accessToken));
    if (refreshToken) q.push('refresh_token=' + encodeURIComponent(refreshToken));

    const appUrl = q.length ? APP_CALLBACK_URL + '?' + q.join('&') : APP_CALLBACK_URL;

    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
    }, 2000);

    window.location.href = appUrl;

    return () => clearTimeout(fallbackTimer);
  }, [searchParams]);

  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') || 'email';
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const q: string[] = [];
  if (tokenHash) q.push('token_hash=' + encodeURIComponent(tokenHash));
  if (type) q.push('type=' + encodeURIComponent(type));
  if (accessToken) q.push('access_token=' + encodeURIComponent(accessToken));
  if (refreshToken) q.push('refresh_token=' + encodeURIComponent(refreshToken));
  const fallbackHref =
    q.length ? APP_CALLBACK_URL + '?' + q.join('&') : APP_CALLBACK_URL;

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#1A1A1A] flex flex-col items-center justify-center px-6 py-6 text-center">
      <div
        className="w-10 h-10 border-[3px] border-[#EDE9E3] border-t-[#2D9D8B] rounded-full animate-spin mb-4"
        aria-hidden
      />
      <p id="msg" className="m-0">
        Opening Gatherly…
      </p>
      {showFallback && (
        <p className="mt-6 text-sm text-[#5C5C5C]">
          <a href={fallbackHref} id="openLink" className="text-[#2D9D8B]">
            Tap here to open the app
          </a>
        </p>
      )}
    </div>
  );
}
