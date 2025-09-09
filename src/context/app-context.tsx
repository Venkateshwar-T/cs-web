// @/context/app-context.tsx
'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import type { Product, ProfileInfo } from '@/app/page';
import { useLocalStorage } from '@/hooks/use-local-storage';

const PROFILE_STORAGE_KEY = 'chocoSmileyProfile';

interface AppContextType {
  profileInfo: ProfileInfo;
  updateProfileInfo: (newInfo: Partial<ProfileInfo>) => void;
  isProfileLoaded: boolean;
}

const defaultProfileInfo: ProfileInfo = {
    name: 'John Doe',
    phone: '+1 234 567 890',
    email: 'john.doe@example.com',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [profileInfo, setProfileInfo, isProfileLoaded] = useLocalStorage<ProfileInfo>(
    PROFILE_STORAGE_KEY,
    defaultProfileInfo
  );

  const updateProfileInfo = (newInfo: Partial<ProfileInfo>) => {
    setProfileInfo(prev => ({ ...prev, ...newInfo }));
  };

  const value: AppContextType = {
    profileInfo,
    updateProfileInfo,
    isProfileLoaded,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
