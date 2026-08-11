import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            PlacePrep<span className="text-indigo-400">.AI</span>
          </span>
        </div>

        <p className="text-xs text-slate-500 text-center flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" /> for College Final-Year Placement Candidates.
        </p>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#contact" className="hover:text-white transition-colors">Placement Support</a>
        </div>
      </div>
    </footer>
  );
}
