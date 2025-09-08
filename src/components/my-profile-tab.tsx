
// @/components/my-profile-tab.tsx
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { ProfileInfo } from "@/app/page";
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface MyProfileTabProps {
  profile: ProfileInfo;
  onProfileUpdate: (updatedProfile: Partial<ProfileInfo>) => void;
}

export function MyProfileTab({ profile, onProfileUpdate }: MyProfileTabProps) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('yourpassword');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleCancel = () => {
    setName(profile.name);
    setPhone(profile.phone);
    setEmail(profile.email);
    setPassword('yourpassword');
    toast({
      title: "Cancelled",
      description: "Your changes have been discarded.",
    });
  };

  const handleSave = () => {
    // Add validation logic here if needed
    const updatedProfile = { name, phone, email };
    onProfileUpdate(updatedProfile);
    toast({
      title: "Success",
      description: "Profile information updated successfully.",
      variant: "success",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src="https://picsum.photos/200" alt="User avatar" data-ai-hint="person portrait" />
        <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="w-full space-y-4 px-4">
        <div className="space-y-1">
          <label htmlFor="name" className="pl-3 text-sm font-medium">Name</label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 border-white/20 text-white rounded-2xl h-12" 
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className="pl-3 text-sm font-medium">Phone Number</label>
          <Input 
            id="phone" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-white/10 border-white/20 text-white rounded-2xl h-12" 
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="pl-3 text-sm font-medium">Email</label>
          <Input 
            id="email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white rounded-2xl h-12" 
          />
        </div>
        <div className="space-y-1">
            <label htmlFor="password" className="pl-3 text-sm font-medium">Password</label>
            <div className="relative">
                <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white rounded-2xl h-12 pr-10" 
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/70 hover:text-white"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
            <Button 
                onClick={handleCancel}
                variant="outline"
                className="bg-transparent text-base text-white border-custom-gold border rounded-full px-10 hover:bg-custom-gold hover:text-custom-purple-dark"
            >
                Cancel
            </Button>
            <Button onClick={handleSave} className="bg-custom-gold text-base text-custom-purple-dark rounded-full px-12 hover:bg-custom-gold/90">
                Save
            </Button>
        </div>
        <div className="h-16" />
      </div>
    </div>
  );
}
