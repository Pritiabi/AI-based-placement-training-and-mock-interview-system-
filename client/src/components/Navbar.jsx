import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight">
              PlacePrep<span className="text-indigo-400">.AI</span>
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-wider text-indigo-400 font-semibold -mt-1">Placement Training System</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#statistics" className="hover:text-white transition-colors">Platform Stats</a>
          <a href="#companies" className="hover:text-white transition-colors">Company Prep</a>
        </div>

        {/* Auth CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden p-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur-2xl flex flex-col gap-4">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white font-medium py-2">Features</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white font-medium py-2">How It Works</a>
          <a href="#statistics" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white font-medium py-2">Statistics</a>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            {user ? (
              <Link to="/dashboard" className="w-full text-center py-3 rounded-xl font-semibold text-white bg-indigo-600">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="w-full text-center py-3 rounded-xl font-semibold text-slate-200 bg-slate-800">
                  Sign In
                </Link>
                <Link to="/register" className="w-full text-center py-3 rounded-xl font-semibold text-white bg-indigo-600">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
