import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';

import { db } from '@/utils/firebase';

interface OrganizationState {
  organizationProfiles: OrganizationProfile[];
  loading: boolean;
  error: string | null;
  fetchProfiles: () => Promise<void>;
  subscribeToProfiles: () => void;
}

const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      organizationProfiles: [],
      loading: true,
      error: null,

      fetchProfiles: async () => {
        try {
          set({ loading: true });
          const organizationsCollection = collection(db, 'organization');
          const snapshot = await getDocs(organizationsCollection);

          if (snapshot.empty) {
            console.info('No organization profiles found.');
            set({ organizationProfiles: [], loading: false });
            return;
          }

          const profiles: OrganizationProfile[] = snapshot.docs.map((doc) => ({
            ...doc.data(),
            uid: doc.id,
          })) as OrganizationProfile[];

          set({ organizationProfiles: profiles, loading: false });
        } catch (error) {
          console.error('Error fetching organization profiles:', error);
          set({ error: (error as Error).message, loading: false });
        }
      },

      subscribeToProfiles: () => {
        const organizationsCollection = collection(db, 'organization');

        const unsubscribe = onSnapshot(
          organizationsCollection,
          (snapshot) => {
            if (snapshot.empty) {
              console.info('No organization profiles found.');
              set({ organizationProfiles: [], loading: false });
              return;
            }

            const profiles: OrganizationProfile[] = snapshot.docs.map(
              (doc) => ({
                ...doc.data(),
                uid: doc.id,
              })
            ) as OrganizationProfile[];

            set({ organizationProfiles: profiles, loading: false });
          },
          (error) => {
            console.error('Error subscribing to organization profiles:', error);
            set({ error: error.message, loading: false });
          }
        );

        return unsubscribe;
      },
    }),
    {
      name: 'organization-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useOrganizationStore;
