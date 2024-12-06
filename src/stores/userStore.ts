import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onAuthStateChanged } from 'firebase/auth';
import type { NavigateFunction } from 'react-router-dom';

import { useEventStore } from '@/stores';

import { loginUser, logoutUser, updateDocument, auth } from '@/utils/firebase';

interface UserState {
  user: User | undefined;
  loading: boolean;
  error: string | null;
  login: (userType: User['role'], navigate: NavigateFunction) => Promise<void>;
  logout: (navigate: NavigateFunction) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  initializeAuthListener: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: undefined,
      loading: false,
      error: null,

      initializeAuthListener: () => {
        const fetchEventsByIds = useEventStore.getState().fetchEventsByIds;

        const unsubscribeAuth = onAuthStateChanged(
          auth,
          async (firebaseUser) => {
            set({ loading: true });
            if (firebaseUser) {
              const currentUser = get().user;

              if (currentUser && currentUser.joinedEvents?.length > 0) {
                try {
                  await fetchEventsByIds(currentUser.joinedEvents);
                } catch (error) {
                  console.error('Error fetching events:', error);
                }
              }
              set({ user: currentUser || undefined });
            } else {
              set({ user: undefined });
              useEventStore.getState().setEvents([]);
            }
            set({ loading: false });
          }
        );

        return unsubscribeAuth;
      },

      login: async (userType, navigate) => {
        const fetchEventsByIds = useEventStore.getState().fetchEventsByIds;

        try {
          set({ loading: true });
          const profile = await loginUser(navigate, userType);
          if (profile) {
            set({
              user: { ...profile, role: userType },
              error: null,
            });
            const currentUser = get().user;
            if (currentUser && currentUser.joinedEvents?.length > 0) {
              await fetchEventsByIds(currentUser.joinedEvents);
            }
          }
        } catch (error) {
          console.error('Error during login:', error);
          set({ error: 'Login failed. Please try again.' });
        } finally {
          set({ loading: false });
        }
      },

      logout: async (navigate) => {
        try {
          set({ loading: true });
          await logoutUser(navigate);

          set({ user: undefined, error: null });
          useEventStore.getState().setEvents([]);
        } catch (error) {
          console.error('Error during logout:', error);
          set({ error: 'Logout failed. Please try again.' });
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (updates) => {
        const currentUser = get().user;
        if (!currentUser) {
          console.error('No user is currently logged in.');
          return;
        }

        try {
          await updateDocument(currentUser.role, currentUser.uid, updates);
          set({
            user: { ...currentUser, ...updates },
            error: null,
          });
        } catch (error) {
          console.error('Error updating profile:', error);
          set({ error: 'Profile update failed. Please try again.' });
        }
      },
    }),
    {
      name: 'user-store',
    }
  )
);

export default useUserStore;
