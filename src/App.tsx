import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LandingPage from './pages/LandingPage';
import { cn } from './lib/utils';

// Lazy load pages for performance
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ProjectsPage = lazy(() => import('./pages/projects/ProjectsList'));
const ProjectDetail = lazy(() => import('./pages/projects/ProjectDetail'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const MessagesPage = lazy(() => import('./pages/messages/MessagesPage'));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage'));
const AIPlannerPage = lazy(() => import('./pages/ai/AIPlannerPage'));

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {isAuthenticated && <Sidebar />}
      
      <div className={cn(
        "flex flex-col flex-grow min-h-screen",
        isAuthenticated && "md:pl-[240px]"
      )}>
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className="h-full flex items-center justify-center py-20">Loading page...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              
              <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute><MessagesPage /></ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute><NotificationsPage /></ProtectedRoute>
              } />
              <Route path="/planner" element={
                <ProtectedRoute><AIPlannerPage /></ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </main>
        
        <footer className="bg-surface border-t border-border py-12 mt-20">
          <div className="section-container text-center">
            <p className="text-text-muted text-xs font-semibold uppercase tracking-widest">© 2026 FindATeammate. Professional Student Collaboration.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
