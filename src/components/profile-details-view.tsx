
// @/components/profile-details-view.tsx
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppContext, type ProfileInfo } from '@/context/app-context';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { updateUserPassword } from '@/lib/firebase';
import { Loader } from './loader';


interface ProfileDetailsViewProps {
  profile: ProfileInfo;
  onHasChangesChange: (hasChanges: boolean) => void;
  onProfileUpdate: (updatedProfile: Partial<ProfileInfo>) => void;
}

export function ProfileDetailsView({ profile, onHasChangesChange, onProfileUpdate }: ProfileDetailsViewProps) {
  const { user } = useAppContext();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState(''); // Default to empty
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const isGoogleSignIn = user?.providerData.some(
    (provider) => provider.providerId === 'google.com'
  );

  useEffect(() => {
    const hasChanges = 
      name !== profile.name || 
      phone !== profile.phone || 
      email !== profile.email || 
      password !== '';
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
    setPassword('');
    onHasChangesChange(false);
  };

  const handleSave = async () => {
    if (phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    let passwordChanged = false;
    
    try {
      if (password && !isGoogleSignIn) {
        await updateUserPassword(password);
        passwordChanged = true;
      }

      const updatedProfile: Partial<ProfileInfo> = { name, phone };
      if (!isGoogleSignIn) {
        updatedProfile.email = email;
      }
      onProfileUpdate(updatedProfile);
      onHasChangesChange(false);

      toast({
        title: "Success",
        description: `Profile information updated successfully.${passwordChanged ? " Your password has been changed." : ""}`,
        variant: "success",
      });
       setPassword(''); // Clear password field after successful save

    } catch (error: any) {
       toast({
        title: "Update Failed",
        description: error.message || "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsSaving(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhone(value);
    }
  };

  if (isSaving) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader />
        <p className="mt-4 text-white">Saving your details...</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-white h-full flex flex-col items-center">
      <div className='flex w-full justify-between items-center'>
        <h2 className="text-3xl font-normal font-poppins self-start mb-6">My Profile</h2>
      </div>
      
      <Avatar className="w-24 h-24 mb-4">
        <AvatarImage src={user?.photoURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=random`} alt="User avatar" data-ai-hint="person portrait" onDragStart={(e) => e.preventDefault()}/>
        <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      {isGoogleSignIn && (
        <div className="flex flex-col items-center gap-1 mb-4">
            <div className="flex items-center gap-2 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full">
                <Image src="/icons/google.png" alt="Google" width={16} height={16} />
                <span>Logged in with Google</span>
            </div>
            <p className="text-sm text-white/80">{email}</p>
        </div>
      )}

      <div className="w-full max-w-xs space-y-3">
        <div className="space-y-1">
          <label htmlFor="name" className="pl-3 text-m font-medium">Name</label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white border-white/20 text-black rounded-2xl h-12 text-base" 
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className="p-3 text-m font-medium">Phone Number</label>
          <div className="flex items-center bg-white border border-white/20 rounded-2xl h-12 overflow-hidden">
              <span className="text-black font-montserrat px-3 border-r border-gray-300">+91</span>
              <Input 
                id="phone" 
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className="bg-transparent border-none text-black h-full text-base focus-visible:ring-0 focus-visible:ring-offset-0" 
              />
          </div>
        </div>
        {!isGoogleSignIn && (
          <div className="space-y-1">
            <label htmlFor="email" className="p-3 text-m font-medium">Email</label>
            <Input 
              id="email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-white/20 text-black rounded-2xl h-12 text-base"
            />
          </div>
        )}
        {!isGoogleSignIn && (
          <div className="space-y-1">
              <label htmlFor="password" className="p-3 text-m font-medium">Password</label>
              <div className="relative">
                  <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password to change"
                      className="bg-white border-white/20 text-black rounded-2xl h-12 text-base pr-10" 
                  />
                  <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-black/70 hover:text-black"
                  >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
              </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 pt-4 pb-8">
            <Button 
                onClick={handleCancel}
                variant="outline"
                className="bg-transparent text-base text-white border-custom-gold border-2 rounded-full px-10 hover:bg-custom-gold hover:text-custom-purple-dark"
                disabled={isSaving}
            >
                Cancel
            </Button>
            <Button onClick={handleSave} className="bg-custom-gold text-base text-custom-purple-dark rounded-full px-12 hover:bg-custom-gold/90" disabled={isSaving}>
                Save
            </Button>
        </div>
      </div>
    </div>
  );
}
