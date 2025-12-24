
import React from 'react';
import { View } from '../types';
import { Sun, Moon, Plus, Newspaper } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: View) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, isDarkMode, onToggleDarkMode }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-900 transition-all duration-500">
      <div className="container mx-auto px-4 max-w-6xl h-24 flex items-center justify-between">
        <div 
          className="flex items-center gap-5 cursor-pointer group"
          onClick={() => onNavigate('feed')}
        >
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-3 rounded-[1.2rem] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.3)] dark:shadow-none group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
            <Newspaper size={30} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-5xl font-black tracking-tighter dark:text-white text-slate-900 leading-none">
              VAO
            </span>
            <span className="text-[9px] font-black tracking-[0.5em] uppercase text-slate-400 mt-1.5 opacity-80">Digital Newsroom</span>
          </div>
        </div>

        <div className="flex items-center gap-5 md:gap-10">
          <button
            onClick={onToggleDarkMode}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none active:scale-90 group"
            title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
          >
            {isDarkMode ? (
              <Sun size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            ) : (
              <Moon size={24} className="group-hover:-rotate-12 transition-transform duration-500" />
            )}
          </button>
          
          <button
            onClick={() => onNavigate('editor')}
            className="relative overflow-hidden group bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/20 dark:shadow-white/10"
          >
            <div className="absolute inset-0 bg-white/10 dark:bg-slate-900/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Plus size={20} className="relative z-10" />
            <span className="relative z-10">Nova Redação</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
