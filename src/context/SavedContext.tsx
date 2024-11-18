import { createContext, useState } from 'react';

interface SavedContextProps {
  savedOrgs: Organization[];
  toggleSavedOrg: (org: Organization) => void;
}

const SavedContext = createContext<SavedContextProps | undefined>(undefined);

const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedOrgs, setSavedOrgs] = useState<Organization[]>([]);

  const toggleSavedOrg = (org: Organization) => {
    setSavedOrgs((prev) =>
      prev.some((o) => o.id === org.id)
        ? prev.filter((o) => o.id !== org.id)
        : [...prev, org]
    );
  };

  return (
    <SavedContext.Provider value={{ savedOrgs, toggleSavedOrg }}>
      {children}
    </SavedContext.Provider>
  );
};

export { SavedContext, SavedProvider };
