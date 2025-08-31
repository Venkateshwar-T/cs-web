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
  { id: 'My Profile', label: 'My Profile', icon: <Image src="/icons/profile_drpdwn_btn.png" alt="Profile" width={24} height={24} /> },
  { id: 'My Wishlist', label: 'My Wishlist', icon: <Heart className="h-6 w-6" /> },
  { id: 'My Orders', label: 'My Orders', icon: <ListOrdered className="h-6 w-6" /> },
  { id: 'Log Out', label: 'Log Out', icon: <LogOut className="h-6 w-6" /> },
];

export function ProfileSidebar({ activeTab, setActiveTab }: ProfileSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-white pt-6">
      <nav className="flex flex-col">
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 w-full py-3 px-6 font-medium transition-all duration-200",
                isActive
                  ? 'text-custom-purple-dark text-xl'
                  : 'text-custom-purple-dark/70 text-lg hover:bg-custom-purple-dark/10'
              )}
            >
              <div className="flex-shrink-0">
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
