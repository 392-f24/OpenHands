import '@/App.css';

import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';

import { UserProvider } from '@/context/UserContext';
import { SavedProvider } from '@/context/SavedContext';
import { EventsProvider } from '@/context/EventsContext';
import AppRoutes from '@/routes';

import { Header, Footer } from '@/components/common';

import { theme } from '@/utils/theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <EventsProvider>
        <SavedProvider>
          <UserProvider>
            <div className='App'>
              <Router
                future={{
                  v7_relativeSplatPath: true,
                  v7_startTransition: true,
                }}
              >
                <Header />
                <div className='content'>
                  {/* Main content area where pages will render */}
                  <AppRoutes />
                </div>

                {/* Bottom Navigation with React Router links */}
                <Footer />
              </Router>
            </div>
          </UserProvider>
        </SavedProvider>
      </EventsProvider>
    </ThemeProvider>
  );
};

export default App;
