import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Plus,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = ({ isDark, toggleDark }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarBg = isScrolled
    ? isDark
      ? "bg-black/70 backdrop-blur-xl border-b border-white/10"
      : "bg-white/70 backdrop-blur-xl border-b border-black/10"
    : "bg-transparent";

  const textColor = isDark ? "text-white" : "text-black";

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === 'admin') return "/admin/dashboard";
    if (user.role === 'instructor') return "/instructor/dashboard";
    return "/student/dashboard";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/*
         Logo */}
        <Link
          to="/"
          className={`text-2xl font-extrabold tracking-tight ${textColor}`}
        >
          Study <span className="text-accent">Sparks</span>
        </Link>

        {/* Desktop Nav */}
        <div className={`hidden md:flex items-center space-x-8 text-sm font-medium ${textColor}`}>
          <Link to="/" className="hover:text-accent transition">Home</Link>
          <a href="#roadmap" className="hover:text-accent transition">Roadmap</a>
          <a href="#feedback" className="hover:text-accent transition">Feedback</a>

          <button
            onClick={toggleDark}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="flex items-center gap-4 ml-4">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent text-white font-bold hover:opacity-90 transition shadow-lg shadow-accent/20"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`font-semibold hover:text-accent transition ${textColor}`}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-xl bg-accent text-white font-bold hover:opacity-90 transition shadow-lg shadow-accent/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-4 md:hidden">
          <button onClick={toggleDark}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden ${isDark ? "bg-black" : "bg-white"} border-t ${isDark ? "border-white/10" : "border-black/10"
              }`}
          >
            <div className={`flex flex-col p-6 space-y-4 ${textColor}`}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <a href="#roadmap" onClick={() => setMobileMenuOpen(false)}>Roadmap</a>
              <a href="#feedback" onClick={() => setMobileMenuOpen(false)}>Feedback</a>

              <div className="flex flex-col gap-3 mt-4">
                {isAuthenticated ? (
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-3 rounded-xl bg-accent text-white font-bold shadow-lg shadow-accent/20"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-center py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 font-semibold ${textColor}`}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center px-6 py-3 rounded-xl bg-accent text-white font-bold shadow-lg shadow-accent/20"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;