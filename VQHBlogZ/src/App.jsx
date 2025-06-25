import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import FloatingParticles from '@/components/FloatingParticles';
import LoadingScreen from '@/components/LoadingScreen';

const HomePage = lazy(() => import('@/pages/HomePage'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Playground = lazy(() => import('@/pages/Playground'));
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen gradient-bg relative">
            <FloatingParticles />
            <Header />
            <main>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/post/:id" element={<BlogPost />} />
                  <Route path="/playground" element={<Playground />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
              </Suspense>
            </main>
            <Toaster />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;