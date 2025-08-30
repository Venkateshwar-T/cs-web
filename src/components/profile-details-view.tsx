// @/components/profile-details-view.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { ProfileInfo } from "@/app/page";

interface ProfileDetailsViewProps {
  profile: ProfileInfo;
}

export function ProfileDetailsView({ profile }: ProfileDetailsViewProps) {
  return (
    <div className="p-8 text-white h-full flex flex-col items-center">
      <h2 className="text-3xl font-bold self-start mb-8">My Profile</h2>
      
      <Avatar className="w-24 h-24 mb-8">
        <AvatarImage src="https://picsum.photos/200" alt="User avatar" data-ai-hint="person portrait" />
        <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <Input 
            id="name" 
            value={profile.name} 
            readOnly 
            className="bg-white/10 border-white/20 rounded-2xl h-12 text-base" 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
          <Input 
            id="phone" 
            value={profile.phone} 
            readOnly 
            className="bg-white/10 border-white/20 rounded-2xl h-12 text-base" 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input 
            id="email" 
            value={profile.email} 
            readOnly 
            className="bg-white/10 border-white/20 rounded-2xl h-12 text-base" 
          />
        </div>
      </div>
    </div>
  );
}
