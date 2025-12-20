import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

// Dashboard imports
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProjectsPage from './pages/dashboard/ProjectsPage';
import MediaLibrary from './pages/dashboard/MediaLibrary';
import MessagesPage from './pages/dashboard/MessagesPage';
import TimelinePage from './pages/dashboard/TimelinePage';

import SettingsPage from './pages/dashboard/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="projetos" element={<ProjectsPage />} />
            <Route path="midia" element={<MediaLibrary />} />
            <Route path="mensagens" element={<MessagesPage />} />
            <Route path="cronograma" element={<TimelinePage />} />

            <Route path="configuracoes" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
