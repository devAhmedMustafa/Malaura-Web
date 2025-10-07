'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
    isAuthenticated: () => boolean;
    user: User | null;
    token: string | null;
    isInitialized: boolean;
    login: (userData: User, token: string) => void;
    updateUser: (userData: Partial<User>) => void;
    updateToken: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User | null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);
    const [isInitialized, setIsInitialized] = useState(false);

    function isAuthenticated(): boolean {
        return !!user && !!token;
    }

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [token]);

    // Initialize from localStorage on client side
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('user');
            }
        }
        
        if (storedToken) {
            setToken(storedToken);
        }
        
        setIsInitialized(true);
    }, []);
    
    const login = (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
    }

    const updateUser = (userData: Partial<User>) => {
        setUser((prevUser) => {
            if (!prevUser) return prevUser;
            return { ...prevUser, ...userData } as User;
        });
    }

    const updateToken = (authToken: string) => {
        setToken(authToken);
    }

    const logout = () => {
        setUser(null);
        setToken(null);
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                token,
                isInitialized,
                login,
                updateUser,
                updateToken,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}