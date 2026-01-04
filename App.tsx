import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Homepage from './pages/Homepage';
import Gate from './pages/Gate';
import Library from './pages/Library';
import CaseDetail from './pages/CaseDetail';
import NewsDetail from './pages/NewsDetail';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/gate" element={<Gate />} />
              <Route path="/library" element={<Library />} />
              <Route path="/case/:slug" element={<CaseDetail />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;