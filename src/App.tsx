import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Projects from './pages/Projects';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFoundPage';
import ProjectDetail from './pages/ProjectDetail';

// Dans <Routes> ajouter :
<Route path="/projects/:id" element={<ProjectDetail />} />

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="flex-grow"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--muted)]">
        <Header />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  );
};

export default App;


