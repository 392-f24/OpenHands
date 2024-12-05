import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';

import AppRoutes from '@/routes';
import { useUserStore } from '@/stores';

import { theme } from '@/utils/theme';

const App = () => {
  const initializeAuthListener = useUserStore(
    (state) => state.initializeAuthListener
  );

  useEffect(() => {
    const unsubscribe = initializeAuthListener;
    return () => unsubscribe && unsubscribe();
  }, [initializeAuthListener]);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Toaster
          richColors
          position='top-center'
        />
        <AppRoutes />
      </ThemeProvider>
    </Router>
  );
};

export default App;
