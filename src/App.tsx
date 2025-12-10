import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminLayout } from './components/layout/AdminLayout';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/Dashboard';
import { CourseList } from './pages/courses/CourseList';
import { CourseDetail } from './pages/courses/CourseDetail';
import { UnitList } from './pages/units/UnitList';
import { UnitDetail } from './pages/units/UnitDetail';
import { LessonList } from './pages/lessons/LessonList';
import { LessonDetail } from './pages/lessons/LessonDetail';
import { QuestionList } from './pages/questions/QuestionList';
import { TheoryList } from './pages/theories/TheoryList';
import { Toaster } from 'sonner';
import { RoleManagementPage } from './pages/roles/RoleManagementPage';
import { AccountManagementPage } from './pages/account/AccountManagementPage';
import { UserProvider } from './context/user.context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    
    <QueryClientProvider client={queryClient}>

       <Toaster 
        position="top-right"
        richColors // Để có màu đẹp cho success/error
        expand={false}
        closeButton
      />
     

      <BrowserRouter>
        <Routes>
          
        <Route path="/login" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            
            <Route path="/units" element={<UnitList />} />
            <Route path="/units/:id" element={<UnitDetail />} />
            
            <Route path="/lessons" element={<LessonList />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            
            <Route path="/questions" element={<QuestionList />} />
            
            <Route path="/theories" element={<TheoryList />} />
            <Route path="/role" element={<RoleManagementPage />} />
            <Route path="/account" element={<AccountManagementPage />} />
            
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

 
    </QueryClientProvider>
  );
}

export default App;
