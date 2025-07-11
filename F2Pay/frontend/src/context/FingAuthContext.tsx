import React, { createContext, useContext, useState, useCallback } from 'react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  createPasskey: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  verifyFingerprint: () => Promise<boolean>;
  logout: () => void;
}
 
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const FingAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const register = useCallback(async (name: string, email: string, password: string) => {
    // In a real app, you would make an API call to register the user
    setUser({ name, email });
  }, []);

  const createPasskey = useCallback(async (email: string) => {
    try {
      const registrationOptions = {
        challenge: 'random-challenge',
        rp: {
          name: 'SecurePay',
          id: window.location.hostname
        },
        user: {
          id: btoa(email),
          name: email,
          displayName: email
        },
        pubKeyCredParams: [{
          type: 'public-key',
          alg: -7
        }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required'
        }
      };

const credential = await startRegistration(registrationOptions);
      // In a real app, you would send the credential to your server
      console.log('Passkey registration successful:', credential);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Passkey registration failed:', error);
      throw error;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // In a real app, you would verify credentials with your server
    setUser({ name: 'User', email });
    setIsAuthenticated(true);
  }, []);

  const verifyFingerprint = useCallback(async () => {
    try {
      const authenticationOptions = {
        challenge: 'random-challenge',
        rpId: window.location.hostname,
        allowCredentials: [],
        userVerification: 'required'
      };

      const credential = await startAuthentication(authenticationOptions);
      // In a real app, you would verify the credential with your server
      console.log('Fingerprint verification successful:', credential);
      return true;
    } catch (error) {
      console.error('Fingerprint verification failed:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      register, 
      createPasskey,
      login, 
      verifyFingerprint,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};