'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from './AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import api from '@/utils/api';
import { useState } from 'react';

const Login: React.FC = () => {

  const {login} = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggingIn, setIsLoggingIn] = useState(false);


  const handleGoogleLogin = async (idToken: string) => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      const res = await api.post('/customer', {
        idToken,
      });

      if (res.status === 200) {

        const user = {
          id: res.data.userId,
          email: res.data.email,
        }

        const from = searchParams.get('from') || '/';

        login(user, res.data.token);
        router.push(from);
      }

    } catch (error) {
      console.error('Login failed:', error);
    }
    finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-secondary">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div 
          className="p-8 rounded-xl shadow-lg border bg-bg-card border-border-light"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/logo.png" 
              alt="Gahez Logo" 
              className="w-20 h-20 mx-auto mb-6 rounded-xl shadow-sm" 
            />
            
            {/* Welcome Text */}
            <h1 
              className="text-3xl font-bold mb-3 text-text-primary font-heading"
            >
              Welcome to Gahez
            </h1>
            
            <p 
              className="text-base mb-8 leading-relaxed text-text-secondary"
            >
              Save time, save effort, always ready for you.
            </p>
          </div>

          {/* Login Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 
                className="text-lg font-semibold mb-4 text-text-primary"
              >
                Sign in to continue
              </h2>
            </div>
            
            <GoogleLoginButton onSuccess={handleGoogleLogin} />
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center">
            <p 
              className="text-sm text-text-muted border-border-light"
            >
              By signing in, you agree to our Terms of Service
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-6 text-center">
          <p 
            className="text-sm text-text-muted"
          >
            New to Gahez? Your account will be created automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
