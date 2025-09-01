// @/components/profile-details-view.tsx
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { ProfileInfo } from "@/app/page";
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';

interface ProfileDetailsViewProps {
  profile: ProfileInfo;
  onHasChangesChange: (hasChanges: boolean) => void;
  onProfileUpdate: (updatedProfile: Partial<ProfileInfo>) => void;
}

export function ProfileDetailsView({ profile, onHasChangesChange, onProfileUpdate }: ProfileDetailsViewProps) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('yourpassword'); // Example password
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const hasChanges = 
      name !== profile.name || 
      phone !== profile.phone || 
      email !== profile.email || 
      password !== 'yourpassword';
    onHasChangesChange(hasChanges);
  }, [name, phone, email, password, profile, onHasChangesChange]);
  
  // When the profile prop changes from the parent, update the local state
  useEffect(() => {
    setName(profile.name);
    setPhone(profile.phone);
    setEmail(profile.email);
  }, [profile]);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleCancel = () => {
    setName(profile.name);
    setPhone(profile.phone);
    setEmail(profile.email);
    setPassword('yourpassword');
    onHasChangesChange(false);
  };

  const handleSave = () => {
    const updatedProfile = { name, phone, email };
    onProfileUpdate(updatedProfile);
    onHasChangesChange(false);
  };

  return (
    <div className="p-8 text-white h-full flex flex-col items-center">
      <h2 className="text-3xl font-normal font-poppins self-start mb-6">My Profile</h2>
      
      <Avatar className="w-24 h-24 mb-4">
        <AvatarImage src="https://picsum.photos/200" alt="User avatar" data-ai-hint="person portrait" />
        <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 border-white/20 rounded-2xl h-12 text-base" 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
          <Input 
            id="phone" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-white/10 border-white/20 rounded-2xl h-12 text-base" 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input 
            id="email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 rounded-2xl h-12 text-base" 
          />
        </div>
        <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <div className="relative">
                <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 rounded-2xl h-12 text-base pr-10" 
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

        <div className="flex items-center justify-between gap-4 pt-4 pb-8">
            <Button 
                onClick={handleCancel}
                variant="outline"
                className="bg-transparent text-base text-white border-custom-gold border-2 rounded-full px-12 hover:bg-custom-gold hover:text-custom-purple-dark"
            >
                Cancel
            </Button>
            <Button onClick={handleSave} className="bg-custom-gold text-base text-custom-purple-dark rounded-full px-14 hover:bg-custom-gold/90">
                Save
            </Button>
        </div>
      </div>
    </div>
  );
}
