import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from './WalletContext';

interface UserProfile {
  address: string;
  username?: string;
  bio?: string;
  avatar?: string;
  nftAvatar?: {
    contractAddress: string;
    tokenId: string;
    imageUrl: string;
  };
  socialLinks?: {
    twitter?: string;
    discord?: string;
    website?: string;
  };
  preferences: {
    theme: 'dark' | 'light';
    language: string;
    notifications: boolean;
    defaultNetwork: string;
  };
  stats: {
    totalTransactions: number;
    totalMinted: number;
    totalTransferred: number;
    joinDate: Date;
  };
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  uploadToIPFS: (file: File) => Promise<string>;
  setNFTAvatar: (contractAddress: string, tokenId: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { account, isConnected } = useWallet();

  useEffect(() => {
    if (isConnected && account) {
      loadProfile(account);
    } else {
      setProfile(null);
    }
  }, [isConnected, account]);

  const loadProfile = async (address: string) => {
    setIsLoading(true);
    try {
      // Try to load from localStorage first (for demo)
      const savedProfile = localStorage.getItem(`profile_${address}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        // Create default profile
        const defaultProfile: UserProfile = {
          address,
          preferences: {
            theme: 'dark',
            language: 'en',
            notifications: true,
            defaultNetwork: '0x1'
          },
          stats: {
            totalTransactions: 0,
            totalMinted: 0,
            totalTransferred: 0,
            joinDate: new Date()
          }
        };
        setProfile(defaultProfile);
        localStorage.setItem(`profile_${address}`, JSON.stringify(defaultProfile));
      }

      // In a real app, you would fetch from IPFS or your backend
      // const response = await fetch(`/api/profile/${address}`);
      // const profileData = await response.json();
      // setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);

    // Save to localStorage (in real app, save to IPFS/backend)
    localStorage.setItem(`profile_${profile.address}`, JSON.stringify(updatedProfile));

    try {
      // In a real app, you would save to IPFS or your backend
      // await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedProfile)
      // });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    // Mock IPFS upload - in real app, use Web3.Storage or Pinata
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // For demo, we'll use a data URL
        // In real app: upload to IPFS and return hash
        const mockIPFSHash = `ipfs://Qm${Math.random().toString(36).substring(2, 15)}`;
        resolve(mockIPFSHash);
      };
      reader.readAsDataURL(file);
    });
  };

  const setNFTAvatar = async (contractAddress: string, tokenId: string) => {
    try {
      // In real app, fetch NFT metadata from contract
      const mockImageUrl = `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/`;
      
      await updateProfile({
        nftAvatar: {
          contractAddress,
          tokenId,
          imageUrl: mockImageUrl
        }
      });
    } catch (error) {
      console.error('Error setting NFT avatar:', error);
    }
  };

  const value = {
    profile,
    isLoading,
    updateProfile,
    uploadToIPFS,
    setNFTAvatar
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};