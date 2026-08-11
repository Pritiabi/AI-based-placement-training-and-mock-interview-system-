import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Authenticated Dashboard Pages
import Dashboard from './pages/Dashboard';
import StudyMaterials from './pages/StudyMaterials';
import TopicDetail from './pages/TopicDetail';
import QuizGenerator from './pages/QuizGenerator';
import QuizInterface from './pages/QuizInterface';
import AptitudeModule from './pages/AptitudeModule';
import CodingPractice from './pages/CodingPractice';
import CodingDetail from './pages/CodingDetail';
import CodingMCQRunner from './pages/CodingMCQRunner';
import MockInterview from './pages/MockInterview';
import CommunicationTraining from './pages/CommunicationTraining';
import DailyVocabulary from './pages/DailyVocabulary';
import GrammarExercises from './pages/GrammarExercises';
import ReadingComprehension from './pages/ReadingComprehension';
import ResumeBuilder from './pages/ResumeBuilder';
import ATSChecker from './pages/ATSChecker';
import CompanyPrep from './pages/CompanyPrep';
import CompanyDetail from './pages/CompanyDetail';
import DailyChallenge from './pages/DailyChallenge';
import ProgressDashboard from './pages/ProgressDashboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Protected Route Wrapper
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Authenticated Dashboard Routes */}
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/materials" element={<StudyMaterials />} />
                <Route path="/materials/:topic" element={<TopicDetail />} />
                <Route path="/quiz-generator" element={<QuizGenerator />} />
                <Route path="/quiz-runner" element={<QuizInterface />} />
                <Route path="/aptitude" element={<AptitudeModule />} />
                <Route path="/coding" element={<CodingPractice />} />
                <Route path="/coding-mcq" element={<CodingMCQRunner />} />
                <Route path="/coding-workspace" element={<CodingDetail />} />
                <Route path="/coding/:id" element={<CodingDetail />} />
                <Route path="/interview" element={<MockInterview />} />
                <Route path="/communication" element={<CommunicationTraining />} />
                <Route path="/daily-vocabulary" element={<DailyVocabulary />} />
                <Route path="/grammar-exercises" element={<GrammarExercises />} />
                <Route path="/reading-comprehension" element={<ReadingComprehension />} />
                <Route path="/resume" element={<ResumeBuilder />} />
                <Route path="/ats" element={<ATSChecker />} />
                <Route path="/company" element={<CompanyPrep />} />
                <Route path="/company/:id" element={<CompanyDetail />} />
                <Route path="/challenge" element={<DailyChallenge />} />
                <Route path="/progress" element={<ProgressDashboard />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />

                {/* Admin Role Protected Route */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Route>

              {/* Fallback Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
