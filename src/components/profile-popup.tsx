// @/components/profile-popup.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ProfileSidebar } from './profile-sidebar';
import { ProfileDetailsView } from './profile-details-view';
import type { ProfileInfo } from '@/app/page';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProfilePopupProps {
  onClose: () => void;
  profile: ProfileInfo;
}

export function ProfilePopup({ onClose, profile }: ProfilePopupProps) {
  const [activeTab, setActiveTab] = useState('My Profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const handleActionWithCheck = (action: () => void) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => action); // Store the action to be executed after confirmation
      setIsDialogVisible(true);
    } else {
      action(); // Execute immediately if no changes
    }
  };

  const handleClose = () => handleActionWithCheck(onClose);

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    handleActionWithCheck(() => setActiveTab(tab));
  };
  
  const handleConfirmDiscard = () => {
    if (pendingAction) {
      pendingAction();
    }
    setHasUnsavedChanges(false);
    setIsDialogVisible(false);
    setPendingAction(null);
  };

  const handleCancelDiscard = () => {
    setIsDialogVisible(false);
    setPendingAction(null);
  };

  return (
    <>
      <div className="bg-transparent w-[60vw] h-[85vh] relative rounded-3xl overflow-hidden animate-fade-in">
          <button 
              onClick={handleClose} 
              className="absolute top-4 right-4 text-white hover:text-gray-200 z-20 bg-black/30 rounded-full p-1"
          >
              <X size={20} />
              <span className="sr-only">Close</span>
          </button>
          <div className="flex h-full w-full">
              <div className="w-[25%] h-full bg-white">
                  <ProfileSidebar activeTab={activeTab} onTabChange={handleTabChange} />
              </div>
              <div className="w-[75%] h-full bg-custom-purple-dark overflow-y-auto custom-scrollbar">
                  {activeTab === 'My Profile' && (
                    <ProfileDetailsView 
                      profile={profile} 
                      onHasChangesChange={setHasUnsavedChanges}
                      onCancel={handleClose}
                    />
                  )}
                  {/* Add other views here based on activeTab */}
              </div>
          </div>
      </div>
      <AlertDialog open={isDialogVisible} onOpenChange={setIsDialogVisible}>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to discard them?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDiscard}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDiscard}>Discard Changes</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
