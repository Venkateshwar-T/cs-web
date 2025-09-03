// @/components/bottom-navbar.tsx
'use client';

import { Home, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActiveView } from '@/app/page';

interface BottomNavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const navItems = [
  { view: 'home', icon: Home, label: 'Home' },
  { view: 'cart', icon: ShoppingCart, label: 'Cart' },
  { view: 'profile', icon: User, label: 'Profile' },
] as const;

export function BottomNavbar({ activeView, onNavigate }: BottomNavbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-t border-white/20 md:hidden z-50">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs transition-colors w-full h-full',
                isActive ? 'text-custom-gold' : 'text-white/70 hover:text-white'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
