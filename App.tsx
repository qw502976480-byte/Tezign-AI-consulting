import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Homepage from './pages/Homepage';
import Gate from './pages/Gate';
import Library from './pages/Library';
import UserProfile from './pages/UserProfile';
import ResourceDetail from './pages/ResourceDetail';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BookingProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/gate" element={<Gate />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/resource/:slug" element={<ResourceDetail />} />
              </Routes>
            </Layout>
          </Router>
        </BookingProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;