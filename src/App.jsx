
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';

// Dashboard imports
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProjectsPage from './pages/dashboard/ProjectsPage';
import MediaLibrary from './pages/dashboard/MediaLibrary';
import MessagesPage from './pages/dashboard/MessagesPage';
import TimelinePage from './pages/dashboard/TimelinePage';
import SettingsPage from './pages/dashboard/SettingsPage';

// Admin imports
import AdminLayout from './admin/AdminLayout';
import AdminHome from './admin/pages/AdminHome';
import AdminClientsPage from './admin/pages/AdminClientsPage';
import AdminProjectsPage from './admin/pages/AdminProjectsPage';
import AdminAuthPage from './admin/AdminAuthPage';
import AdminProtectedRoute from './admin/AdminProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected Dashboard Routes (for clients) */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardHome />} />
                <Route path="projetos" element={<ProjectsPage />} />
                <Route path="midia" element={<MediaLibrary />} />
                <Route path="mensagens" element={<MessagesPage />} />
                <Route path="cronograma" element={<TimelinePage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
              </Route>

              {/* Admin Login (public) */}
              <Route path="/admin/login" element={<AdminAuthPage />} />

              {/* Protected Admin Routes (only for admins) */}
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }>
                <Route index element={<AdminHome />} />
                <Route path="clientes" element={<AdminClientsPage />} />
                <Route path="projetos" element={<AdminProjectsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
