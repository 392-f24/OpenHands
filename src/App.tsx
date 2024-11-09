import '@/App.css';

import { ThemeProvider, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import LoadingCircle from '@/components/common/LoadingCircle';
import Home from '@/pages/Home';
import Me from '@/pages/Me';

import { UserProvider } from '@/context/UserContext';
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
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <div className='App'>
          <Router
            future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
          >
            <Header />
            <div className='content'>
              {/* Main content area where pages will render */}
              <Routes>
                <Route
                  path='/'
                  element={<ProtectedRoute element={<Home />} />}
                />
                <Route
                  path='/me'
                  element={<ProtectedRoute element={<Me />} />}
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
