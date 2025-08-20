import React, { createContext, useContext, useState } from 'react';
import { User, Office, Membership, Event, Vote } from '@/types';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  offices: Office[];
  members: User[];
  events: Event[];
  votes: Vote[];
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  offices: [],
  members: [],
  events: [],
  votes: [],
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Mock data
  const [offices] = useState<Office[]>([
    { id: '1', name: 'National Office', type: 'national' },
    { id: '2', name: 'Western Cape Province', type: 'province', parent_office_id: '1' },
    { id: '3', name: 'Cape Town Region', type: 'region', parent_office_id: '2' },
  ]);

  const [members] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'member',
      branch_id: '3',
      contact_info: '+27123456789',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  ]);

  const [events] = useState<Event[]>([]);
  const [votes] = useState<Vote[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentUser,
        setCurrentUser,
        offices,
        members,
        events,
        votes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};