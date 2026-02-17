import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { Router } from './Router';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <Router />
          <Toaster position="top-right" />
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
