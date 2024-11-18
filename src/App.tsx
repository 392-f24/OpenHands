import '@/App.css';

import { ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { UserProvider } from '@/context/UserContext';
import { SavedProvider } from '@/context/SavedContext';
import AppRoutes from '@/routes';

import { Header, Footer, SearchBar } from '@/components/common';

import { theme } from '@/utils/theme';

const App = () => {
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  return (
    <ThemeProvider theme={theme}>
      <SavedProvider>
        <UserProvider>
          <div className='App'>
            <Router
              future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
            >
              <Header />
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <div className='content'>
                {/* Main content area where pages will render */}
                <AppRoutes searchQuery={searchQuery} />
              </div>

              {/* Bottom Navigation with React Router links */}
              <Footer />
            </Router>
          </div>
        </UserProvider>
      </SavedProvider>
    </ThemeProvider>
  );
};

export default App;
