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
      loading: true,
      error: null,

      initializeAuthListener: () => {
        const fetchEventsByIds = useEventStore.getState().fetchEventsByIds;

        const unsubscribeAuth = onAuthStateChanged(
          auth,
          async (firebaseUser) => {
            if (firebaseUser) {
              const currentUser = get().user;
              if (currentUser) {
                await fetchEventsByIds(currentUser.joinedEvents);
              }
            } else {
              set({ user: undefined });
            }
            set({ loading: false });
          }
        );

        return unsubscribeAuth;
      },

      login: async (userType, navigate) => {
        try {
          set({ loading: true });
          const profile = await loginUser(navigate, userType);
          if (profile) {
            set({
              user: { ...profile, role: userType },
              error: null,
            });
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
          const eventStore = useEventStore.getState();
          eventStore.setEvents([]);

          set({ user: undefined, error: null });
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
