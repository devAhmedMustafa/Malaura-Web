'use client';

import { useEffect, useState } from 'react';

interface GoogleLoginButtonProps {
  onSuccess: (idToken: string) => void;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined in environment variables');
}

declare global {
  interface Window {
    google: typeof google;
  }

  namespace google {
    namespace accounts.id {
      interface CredentialResponse {
        credential: string;
        select_by: string;
      }

      function initialize(config: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
      }): void;

      function renderButton(
        parent: HTMLElement,
        options: {
          theme?: 'outline' | 'filled_blue' | 'filled_black';
          size?: 'small' | 'medium' | 'large';
          type?: 'standard' | 'icon';
        }
      ): void;

      function prompt(): void;
    }
  }
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      console.log('Loading Google Sign-In script...');
      
      // Check if Google script is already loaded
      if (window.google && window.google.accounts) {
        console.log('Google SDK already loaded, initializing...');
        initializeGoogleSignIn();
        return;
      }

      // Load Google script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google script loaded successfully');
        initializeGoogleSignIn();
      };
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        setError('Failed to load Google Sign-In script');
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      try {
        console.log('Initializing Google Sign-In...');
        
        if (window.google && window.google.accounts.id) {
          console.log('Google accounts API available, client ID:', GOOGLE_CLIENT_ID);
          
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });

          const buttonElement = document.getElementById('google-signin-btn');
          if (buttonElement) {
            console.log('Button element found, rendering Google button...');
            window.google.accounts.id.renderButton(buttonElement, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
            });
            console.log('Google button rendered successfully');
          } else {
            console.error('Button element not found');
            setError('Button container not found');
          }
          
          setIsLoading(false);
        } else {
          console.error('Google accounts API not available');
          setError('Google Sign-In API not available');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing Google Sign-In:', err);
        setError('Failed to initialize Google Sign-In');
        setIsLoading(false);
      }
    };

    loadGoogleScript();
  }, []);

  const handleCredentialResponse = (response: google.accounts.id.CredentialResponse) => {
    try {
      onSuccess(response.credential);
    } catch (err) {
      console.error('Error handling Google Sign-In response:', err);
      setError('Sign-in failed. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="w-full">
        <div className="text-red-600 text-sm text-center p-4 bg-red-50 rounded-md mb-4">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Retry Google Sign-In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="w-full h-12 bg-gray-100 rounded-md animate-pulse flex items-center justify-center">
          <span className="text-gray-500 text-sm">Loading Google Sign-In...</span>
        </div>
      )}
      <div 
        id="google-signin-btn" 
        className={`w-full flex justify-center ${isLoading ? 'hidden' : ''}`}
        style={{ minHeight: isLoading ? '0' : '48px' }}
      />
      {!isLoading && (
        <div className="w-full mt-4">
          <p className="text-xs text-gray-500 text-center">
            Having trouble? Make sure to allow pop-ups and third-party cookies.
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
