import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VideoListing } from '../types';

interface VideoStore {
  listings: VideoListing[];
  addListing: (listing: Omit<VideoListing, 'id'>) => void;
  updateListing: (id: string, updates: Partial<VideoListing>) => void;
  deleteListing: (id: string) => void;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set) => ({
      listings: [],
      addListing: (listing) =>
        set((state) => ({
          listings: [
            ...state.listings,
            { ...listing, id: crypto.randomUUID() },
          ],
        })),
      updateListing: (id, updates) =>
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, ...updates } : l,
          ),
        })),
      deleteListing: (id) =>
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== id),
        })),
    }),
    {
      name: 'video-listings-storage',
    },
  ),
);
