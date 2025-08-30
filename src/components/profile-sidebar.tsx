// @/components/profile-sidebar.tsx
'use client';

import Image from 'next/image';
import { Heart, ListOrdered, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const sidebarItems = [
  { id: 'My Profile', label: 'My Profile', icon: <Image src="/icons/profile_drpdwn_btn.png" alt="Profile" width={20} height={20} /> },
  { id: 'My Wishlist', label: 'My Wishlist', icon: <Heart className="h-5 w-5" /> },
  { id: 'My Orders', label: 'My Orders', icon: <ListOrdered className="h-5 w-5" /> },
  { id: 'Log Out', label: 'Log Out', icon: <LogOut className="h-5 w-5" /> },
];

export function ProfileSidebar({ activeTab, setActiveTab }: ProfileSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col">
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 w-full py-3 px-6 text-lg font-medium transition-colors",
                isActive
                  ? 'bg-custom-purple-dark text-white'
                  : 'text-custom-purple-dark hover:bg-custom-purple-dark/10'
              )}
            >
              <div className={cn(isActive ? 'text-white' : 'text-custom-purple-dark')}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
