import './App.css';
import Router from './Router';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import ThemeLayout from './components/themeLayout/ThemeLayout';
import CustomTitleBar from './components/electron-frame/CustomTitleBar';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
    },
  },
});

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        hideProgressBar={true}
        closeOnClick
      />
      <CustomTitleBar />
      <QueryClientProvider client={queryClient}>
        <ThemeLayout>
          <Router />
        </ThemeLayout>
      </QueryClientProvider>
    </>
  );
}

export default App;
