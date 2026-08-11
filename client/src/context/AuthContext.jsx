import React, { createContext, useContext, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  isFirebaseConfigured,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from '../services/firebase';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('placeprep_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('placeprep_token') || '');
  const [loading, setLoading] = useState(false);

  // Sync candidate profile with MongoDB backend
  const syncProfile = async (firebaseUser, extraData = {}) => {
    try {
      const idToken = firebaseUser.getIdToken 
        ? await firebaseUser.getIdToken() 
        : `mock-token-${firebaseUser.uid}`;

      localStorage.setItem('placeprep_token', idToken);
      setToken(idToken);

      const res = await API.post('/auth/sync', {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: extraData.name || firebaseUser.displayName || 'Placement Aspirant',
        college: extraData.college || 'Engineering College',
        degree: extraData.degree || 'B.Tech',
        department: extraData.department || 'Computer Science',
        graduationYear: extraData.graduationYear || 2026,
        profileImage: firebaseUser.photoURL || ''
      }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('placeprep_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.warn('Backend profile sync fallback notice:', err.message);
      const fallbackUser = {
        _id: 'local-' + Date.now(),
        firebaseUid: firebaseUser.uid,
        name: extraData.name || firebaseUser.displayName || 'Placement Candidate',
        email: firebaseUser.email,
        college: extraData.college || 'National Institute of Technology',
        degree: extraData.degree || 'B.Tech',
        department: extraData.department || 'Computer Science',
        graduationYear: extraData.graduationYear || 2026,
        role: firebaseUser.email === 'admin@placeprep.ai' ? 'admin' : 'user',
        streak: 7
      };
      setUser(fallbackUser);
      localStorage.setItem('placeprep_user', JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await syncProfile(userCredential.user);
      } else {
        // Direct MongoDB dev login mode when Firebase API Key is not set in .env
        const mockFbUser = { uid: 'dev-uid-' + Date.now(), email, displayName: email.split('@')[0] };
        await syncProfile(mockFbUser);
      }
    } catch (error) {
      if (error.code === 'auth/api-key-not-valid' || error.message.includes('api-key')) {
        const mockFbUser = { uid: 'dev-uid-' + Date.now(), email, displayName: email.split('@')[0] };
        await syncProfile(mockFbUser);
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await syncProfile(userCredential.user, formData);
      } else {
        // Direct MongoDB dev registration mode when Firebase API Key is not set in .env
        const mockFbUser = { uid: 'dev-uid-' + Date.now(), email: formData.email, displayName: formData.name };
        await syncProfile(mockFbUser, formData);
      }
    } catch (error) {
      if (error.code === 'auth/api-key-not-valid' || error.message.includes('api-key')) {
        const mockFbUser = { uid: 'dev-uid-' + Date.now(), email: formData.email, displayName: formData.name };
        await syncProfile(mockFbUser, formData);
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        await syncProfile(result.user);
      } else {
        const mockFbUser = { uid: 'google-dev-uid-' + Date.now(), email: 'google.candidate@placeprep.ai', displayName: 'Google Candidate' };
        await syncProfile(mockFbUser);
      }
    } catch (error) {
      const mockFbUser = { uid: 'google-dev-uid-' + Date.now(), email: 'google.candidate@placeprep.ai', displayName: 'Google Candidate' };
      await syncProfile(mockFbUser);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      console.log('[Dev Notice] Password reset simulated for email:', email);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try { await signOut(auth); } catch (e) {}
    }
    setUser(null);
    setToken('');
    localStorage.removeItem('placeprep_token');
    localStorage.removeItem('placeprep_user');
  };

  const updateProfileData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('placeprep_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isFirebaseConfigured,
      login,
      register,
      loginWithGoogle,
      forgotPassword,
      logout,
      updateProfileData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
