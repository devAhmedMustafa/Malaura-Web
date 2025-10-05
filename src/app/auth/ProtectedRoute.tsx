'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import React, { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isInitialized } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isInitialized && !isAuthenticated()) {
            router.push(`/auth?from=${encodeURIComponent(pathname)}`);
        }
    }, [isAuthenticated, isInitialized, router, pathname]);

    if (!isInitialized) {
        return <div>Loading...</div>; // or a loading spinner
    }

    if (!isAuthenticated()) {
        return null; // Will redirect via useEffect
    }

    return <>{children}</>;
}