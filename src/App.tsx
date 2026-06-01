import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Header        from './components/Header';
import Footer        from './components/Footer';
import Home          from './components/Home';
import Projects      from './pages/Projects';
import AboutPage     from './pages/AboutPage';
import AdminPage     from './pages/AdminPage';
import NotFoundPage  from './pages/NotFoundPage';
import ProjectDetail from './pages/ProjectDetail';

const ADMIN_PATH: string =
  import.meta.env.VITE_ADMIN_PATH ?? 'admin';

const ADMIN_SEQUENCE: string[] = (
  import.meta.env.VITE_ADMIN_KEY ?? ''
).split(',').filter(Boolean);

const useSecretAccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (ADMIN_SEQUENCE.length === 0) return;

    let idx = 0;
    let resetTimer: ReturnType<typeof setTimeout>;

    const handler = (e: KeyboardEvent) => {
      if (e.key === ADMIN_SEQUENCE[idx]) {
        idx++;
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => { idx = 0; }, 2000);

        if (idx === ADMIN_SEQUENCE.length) {
          idx = 0;
          clearTimeout(resetTimer);
          navigate(`/${ADMIN_PATH}`);
        }
      } else {
        idx = 0;
        clearTimeout(resetTimer);
      }
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      clearTimeout(resetTimer);
    };
  }, [navigate]);
};

const AnimatedRoutes = () => {
  const location = useLocation();
  useSecretAccess();

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
          <Route path="/"             element={<Home />} />
          <Route path="/projects"     element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/about"        element={<AboutPage />} />
          <Route path={`/${ADMIN_PATH}`} element={<AdminPage />} />
          <Route path="*"             element={<NotFoundPage />} />
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