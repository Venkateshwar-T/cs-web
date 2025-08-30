// @/components/profile-popup.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ProfileSidebar } from './profile-sidebar';
import { ProfileDetailsView } from './profile-details-view';

interface ProfilePopupProps {
  onClose: () => void;
}

export function ProfilePopup({ onClose }: ProfilePopupProps) {
  const [activeTab, setActiveTab] = useState('My Profile');

  return (
    <div className="bg-transparent w-[70vw] h-[70vh] relative rounded-3xl overflow-hidden animate-fade-in">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white hover:text-gray-200 z-20 bg-black/30 rounded-full p-1"
        >
            <X size={20} />
            <span className="sr-only">Close</span>
        </button>
        <div className="flex h-full w-full">
            <div className="w-[25%] h-full bg-white">
                <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="w-[75%] h-full bg-custom-purple-dark">
                {activeTab === 'My Profile' && <ProfileDetailsView />}
                {/* Add other views here based on activeTab */}
            </div>
        </div>
    </div>
  );
}
