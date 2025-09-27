// @/components/my-profile-tab.tsx
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
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

interface MyProfileTabProps {
  profile: ProfileInfo;
  onProfileUpdate: (updatedProfile: Partial<ProfileInfo>) => void;
}

// Helper to parse the full address string
const parseAddress = (fullAddress: string) => {
    const parts = fullAddress.split(',').map(p => p.trim());
    const pincodeMatch = fullAddress.match(/\b\d{6}\b/);
    const pincode = pincodeMatch ? pincodeMatch[0] : '';
    
    // Naive parsing, assuming structure: address..., city, state, pincode
    // This is brittle, but we'll refine it.
    let address = fullAddress;
    if (pincode) {
        address = address.replace(pincode, '').trim().replace(/,$/, '').trim();
    }
    address = address.replace(/, Karnataka/i, '').trim().replace(/,$/, '').trim();
    address = address.replace(/, Bangalore/i, '').trim().replace(/,$/, '').trim();

    return {
        address: address,
        pincode: pincode
    };
};


export function MyProfileTab({ profile, onProfileUpdate }: MyProfileTabProps) {
  const { user } = useAppContext();
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');

  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const city = 'Bangalore';
  const state = 'Karnataka';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  
  const isGoogleSignIn = user?.providerData.some(
    (provider) => provider.providerId === 'google.com'
  );

  useEffect(() => {
    setName(profile.name || '');
    setPhone(profile.phone || '');
    setEmail(profile.email || '');
    const { address: parsedAddress, pincode: parsedPincode } = parseAddress(profile.address || '');
    setAddress(parsedAddress);
    setPincode(parsedPincode);
    setPassword('');
  }, [profile]);


  useEffect(() => {
    const fullAddressFromState = [address.trim(), city, state, pincode.trim()].filter(Boolean).join(', ');
    const changes = name !== (profile.name || '') || 
                      phone !== (profile.phone || '') || 
                      email !== (profile.email || '') || 
                      fullAddressFromState !== (profile.address || '') ||
                      password !== '';
    setHasChanges(changes);
  }, [name, phone, email, address, pincode, password, profile, city, state]);
  
  const handleCancel = () => {
    setName(profile.name || '');
    setPhone(profile.phone || '');
    setEmail(profile.email || '');
    const { address: parsedAddress, pincode: parsedPincode } = parseAddress(profile.address || '');
    setAddress(parsedAddress);
    setPincode(parsedPincode);
    setPassword('');
  };

  const handleSave = async () => {
     if (phone && phone.length !== 10) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid 10-digit phone number.", variant: "destructive" });
      return;
    }
     if (!address.trim()) {
      toast({ title: "Incomplete Address", description: "Please provide your delivery address.", variant: "destructive"});
      return;
    }
    if (pincode && pincode.length !== 6) {
      toast({ title: "Invalid Pincode", description: "Please enter a valid 6-digit pincode.", variant: "destructive" });
      return;
    }


    setIsSaving(true);
    let passwordChanged = false;
    
    try {
      if (password && !isGoogleSignIn) {
        await updateUserPassword(password);
        passwordChanged = true;
      }
      
      const fullAddress = [address.trim(), city, state, pincode.trim()].filter(Boolean).join(', ');
      const updatedProfile: Partial<ProfileInfo> = { name, phone, address: fullAddress };

       if (!isGoogleSignIn) {
         updatedProfile.email = email;
       }
      onProfileUpdate(updatedProfile);

      toast({
        title: "Success",
        description: `Profile information updated successfully.${passwordChanged ? " Your password has been changed." : ""}`,
        variant: "success",
      });
      setPassword('');

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
  
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPincode(value);
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isSaving) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-16">
        <Loader />
        <p className="mt-4 text-white">Saving your details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={user?.photoURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=random`} alt="User avatar" data-ai-hint="person portrait" />
        <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      {isGoogleSignIn && (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full">
              <Image src="/icons/google.png" alt="Google" width={16} height={16} />
              <span>Logged in with Google</span>
          </div>
          <p className="text-sm text-white/80">{email}</p>
        </div>
      )}

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
          <div className="flex items-center bg-white/10 border border-white/20 rounded-2xl h-12 overflow-hidden">
            <span className="text-white px-3 border-r border-white/20">+91</span>
            <Input 
                id="phone" 
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className="bg-transparent border-none text-white h-full focus-visible:ring-0 focus-visible:ring-offset-0" 
            />
          </div>
        </div>
        
        <Separator className="bg-white/20 my-4" />
        
        <h3 className="text-lg font-medium text-center font-plex-sans -mb-2">Delivery Address</h3>

        <div className='space-y-1'>
          <label htmlFor="address" className="pl-3 text-sm font-medium">Address</label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House No, Building Name, Street, Area"
              className="bg-white/10 border-white/20 text-white rounded-2xl h-24 no-scrollbar"
            />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label htmlFor="pincode" className="pl-3 text-sm font-medium">Pincode</label>
                <Input
                    id="pincode"
                    type="tel"
                    value={pincode}
                    onChange={handlePincodeChange}
                    className="bg-white/10 border-white/20 text-white rounded-2xl h-12"
                />
            </div>
             <div className="space-y-1">
                <label htmlFor="city" className="pl-3 text-sm font-medium">City</label>
                <Input
                    id="city"
                    value={city}
                    readOnly
                    className="bg-white/10 border-white/20 text-white rounded-2xl h-12 opacity-70 cursor-not-allowed"
                />
            </div>
        </div>

        <div className="space-y-1">
            <label htmlFor="state" className="pl-3 text-sm font-medium">State</label>
            <Input
                id="state"
                value={state}
                readOnly
                className="bg-white/10 border-white/20 text-white rounded-2xl h-12 opacity-70 cursor-not-allowed"
            />
        </div>


        {!isGoogleSignIn && (
          <>
            <Separator className="bg-white/20 my-4" />
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
                        placeholder="Enter new password to change"
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
          </>
        )}

        <div className="flex items-center justify-center gap-4 pt-4">
            <Button 
                onClick={handleCancel}
                variant="outline"
                className="bg-transparent text-base text-white border-custom-gold border rounded-full px-10 hover:bg-custom-gold hover:text-custom-purple-dark disabled:opacity-50 disabled:bg-transparent disabled:text-white/50 disabled:border-white/50 disabled:hover:text-white/50"
                disabled={!hasChanges || isSaving}
            >
                Cancel
            </Button>
            <Button onClick={handleSave} className="bg-custom-gold text-base text-custom-purple-dark rounded-full px-12 hover:bg-custom-gold/90 disabled:opacity-50" disabled={!hasChanges || isSaving}>
                Save
            </Button>
        </div>
        <div className="h-16" />
      </div>
    </div>
  );
}
