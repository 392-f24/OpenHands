import React, { createContext, useState } from 'react';

interface Organization {
  id: number;
  name: string;
  location: string;
  description: string;
  website: string;
  needs: string[];
  loanable: boolean;
}

interface SavedContextProps {
  savedOrgs: Organization[];
  toggleSavedOrg: (org: Organization) => void;
}

const SavedContext = createContext<SavedContextProps | undefined>(undefined);

const SavedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
