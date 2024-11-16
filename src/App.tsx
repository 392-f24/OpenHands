import '@/App.css';

import { ThemeProvider, Typography } from '@mui/material';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Saved from './pages/Saved';
import Alerts from './pages/Alerts';
import SearchBar from './components/Home/SearchBar';

import { UserProvider } from '@/context/UserContext';

import Home from '@/pages/Home';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import LoadingCircle from '@/components/common/LoadingCircle';

import useUser from '@/hooks/useUser';

import { theme } from '@/utils/theme';

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <LoadingCircle />;
  }

  return user ? (
    element
  ) : (
    <Typography
      variant='h6'
      sx={{
        textAlign: 'center',
        marginTop: '2rem',
      }}
    >
      Please sign in to view this page
    </Typography>
  );
};

function App() {
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  return (
    <ThemeProvider theme={theme}>
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
              <Routes>
                <Route
                  path='/'
                  element={
                    <ProtectedRoute
                      element={<Home searchQuery={searchQuery} />}
                    />
                  }
                />
                <Route
                  path='/saved'
                  element={
                    <ProtectedRoute
                      element={<Saved searchQuery={searchQuery} />}
                    />
                  }
                />
                <Route
                  path='/alerts'
                  element={
                    <ProtectedRoute
                      element={<Alerts searchQuery={searchQuery} />}
                    />
                  }
                />
              </Routes>
            </div>

            {/* Bottom Navigation with React Router links */}
            <Footer />
          </Router>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
