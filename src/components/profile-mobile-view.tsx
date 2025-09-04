
// @/components/profile-mobile-view.tsx
'use client';

import { useState } from 'react';
import type { ProfileInfo } from '@/app/page';
import { cn } from '@/lib/utils';
import { MyProfileTab } from './my-profile-tab';

interface ProfileMobileViewProps {
  profile: ProfileInfo;
  onProfileUpdate: (updatedProfile: Partial<ProfileInfo>) => void;
}

const tabs = ['My Profile', 'My Wishlist', 'My Orders'];

export function ProfileMobileView({ profile, onProfileUpdate }: ProfileMobileViewProps) {
  const [activeTab, setActiveTab] = useState('My Profile');

  return (
    <div className="flex flex-col h-full px-4 text-white">
      <div className="flex-shrink-0 border-b border-white/20">
        <div className="flex justify-around">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "py-3 px-2 text-sm font-medium transition-colors w-full",
                activeTab === tab
                  ? 'text-custom-gold border-b-2 border-custom-gold'
                  : 'text-white/70 hover:text-white'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto no-scrollbar py-6">
        {activeTab === 'My Profile' && (
          <MyProfileTab profile={profile} onProfileUpdate={onProfileUpdate} />
        )}
        {activeTab === 'My Wishlist' && (
          <div className="text-center p-8">
            <p>Wishlist items will be shown here.</p>
          </div>
        )}
        {activeTab === 'My Orders' && (
          <div className="text-center p-8">
            <p>Order history will be shown here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
