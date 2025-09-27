
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

interface MyProfileTabProps {
  profile: ProfileInfo;
  onProfileUpdate: (updatedProfile: Partial<ProfileInfo>) => void;
}

export function MyProfileTab({ profile, onProfileUpdate }: MyProfileTabProps) {
  const { user } = useAppContext();
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');
  
  const [house, setHouse] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const city = "Bangalore";
  const state = "Karnataka";

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  
  const isGoogleSignIn = user?.providerData.some(
    (provider) => provider.providerId === 'google.com'
  );
  
  const parseAddress = (fullAddress: string) => {
    if (!fullAddress) return;

    // Reset fields first
    setHouse('');
    setArea('');
    setLandmark('');
    setPincode('');

    const cityStatePincodeRegex = new RegExp(`,\\s*${city},\\s*${state}\\s*-\\s*(\\d{6})$`);
    const cityStatePincodeMatch = fullAddress.match(cityStatePincodeRegex);
    const pincodeValue = cityStatePincodeMatch ? cityStatePincodeMatch[1] : '';
    setPincode(pincodeValue);
    
    const mainAddress = cityStatePincodeMatch ? fullAddress.substring(0, cityStatePincodeMatch.index).trim() : fullAddress;
    
    const parts = mainAddress.split(',').map(p => p.trim());
    if (parts.length > 0) {
      setHouse(parts[0]);
    }
    if (parts.length > 1) {
      // Join the rest of the parts for Area and Landmark
      const remainingParts = parts.slice(1);
      // Heuristic: If there are multiple parts left, the last one might be a landmark.
      if (remainingParts.length > 1) {
          setArea(remainingParts.slice(0, -1).join(', '));
          setLandmark(remainingParts[remainingParts.length - 1]);
      } else {
          setArea(remainingParts.join(', '));
          setLandmark('');
      }
    } else {
        setArea('');
        setLandmark('');
    }
  };


  useEffect(() => {
    const addressParts = [house, area, landmark].filter(Boolean).join(', ');
    const fullAddress = `${addressParts}, ${city}, ${state} - ${pincode}`;

    const changes = name !== (profile.name || '') || 
                     phone !== (profile.phone || '') || 
                     email !== (profile.email || '') || 
                     (house && fullAddress !== (profile.address || '')) ||
                     password !== '';
    setHasChanges(changes);
  }, [name, phone, email, house, area, landmark, pincode, password, profile, city, state]);

  useEffect(() => {
    setName(profile.name || '');
    setPhone(profile.phone || '');
    setEmail(profile.email || '');
    setPassword('');
    parseAddress(profile.address || '');
  }, [profile]);


  const handleCancel = () => {
    setName(profile.name || '');
    setPhone(profile.phone || '');
    setEmail(profile.email || '');
    setPassword('');
    parseAddress(profile.address || '');
  };

  const handleSave = async () => {
     if (phone && phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    if (!house || !area || !pincode || pincode.length !== 6) {
      toast({
        title: "Incomplete Address",
        description: "Please complete all required address fields.",
        variant: "destructive"
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
      
      const addressParts = [house, area, landmark].filter(Boolean).join(', ');
      const fullAddress = `${addressParts}, ${city}, ${state} - ${pincode}`;

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

        <div className='space-y-3'>
          <h3 className="text-lg font-medium text-center font-plex-sans">Delivery Address</h3>
          
          <div className="space-y-1">
            <label htmlFor="house" className="pl-3 text-sm font-medium">House No., Building Name</label>
            <Input
              id="house"
              value={house}
              onChange={(e) => setHouse(e.target.value)}
              className="bg-white/10 border-white/20 text-white rounded-2xl h-12"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="area" className="pl-3 text-sm font-medium">Street, Area, Colony</label>
            <Input
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="bg-white/10 border-white/20 text-white rounded-2xl h-12"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="landmark" className="pl-3 text-sm font-medium">Landmark (Optional)</label>
            <Input
              id="landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="bg-white/10 border-white/20 text-white rounded-2xl h-12"
            />
          </div>

          <div className="space-y-1">
              <label htmlFor="pincode" className="pl-3 text-sm font-medium">Pincode</label>
              <Input
                id="pincode"
                value={pincode}
                onChange={handlePincodeChange}
                className="bg-white/10 border-white/20 text-white rounded-2xl h-12"
              />
          </div>

          <div className="flex gap-4">
              <div className="space-y-1 text-left w-1/2">
                  <label className="pl-2 text-sm font-medium font-plex-sans">City</label>
                  <Input value={city} disabled className="bg-white/10 rounded-2xl text-white/70 h-10 md:h-12" />
              </div>
              <div className="space-y-1 text-left w-1/2">
                  <label className="pl-2 text-sm font-medium font-plex-sans">State</label>
                  <Input value={state} disabled className="bg-white/10 rounded-2xl text-white/70 h-10 md:h-12" />
              </div>
          </div>
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
