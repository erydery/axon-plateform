"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, RefreshCcw, Palette, Zap, 
  Database, Brain, Activity, ShieldCheck 
} from "lucide-react";
import { toast } from "react-toastify";

const DAISY_THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", 
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", 
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", 
  "night", "coffee", "winter", "dim", "nord", "sunset"
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [performance, setPerformance] = useState({
    reduceMotion: true,
    lazyLoad: true
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") || "light";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Configurations sauvegardées !");
    }, 1000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 md:space-y-12 pb-20 px-4 pt-4 md:pt-8">
      
      {/* HEADER : Empilé sur mobile, aligné sur desktop */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b-2 md:border-b-4 border-base-200 pb-6 md:pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-tight">
            Settings <span className="text-primary text-3xl sm:text-5xl md:text-7xl block lg:inline">Global</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-black uppercase opacity-40 tracking-widest italic flex items-center gap-2">
            <Activity size={12} className="text-primary" /> System Architecture & UI
          </p>
        </div>
        
        {/* Bouton large sur mobile pour l'accessibilité */}
        <button 
          onClick={handleSave}
          disabled={loading}
          className="btn btn-primary w-full lg:w-auto h-16 md:h-20 px-8 md:px-12 rounded-2xl md:rounded-[30px] font-[1000] italic uppercase tracking-widest shadow-xl border-none transition-all active:scale-95"
        >
          {loading ? <span className="loading loading-spinner"></span> : <><Save size={20} /> Sauvegarder</>}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* SECTION THÈMES : Adaptative */}
        <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
          <div className="bg-base-100 border-2 border-base-200 rounded-[30px] md:rounded-[50px] p-6 md:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
                  <Palette size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-[1000] italic uppercase tracking-tighter">Apparence</h2>
              </div>
              <div className="badge badge-secondary badge-outline font-black uppercase text-[10px] tracking-tighter italic">
                {currentTheme}
              </div>
            </div>

            {/* Grille : 2 colonnes sur mobile, 3 sur tablette, 4 sur desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {DAISY_THEMES.map((theme) => (
                <button 
                  key={theme} 
                  onClick={() => changeTheme(theme)}
                  className={`group flex flex-col gap-2 p-3 rounded-xl md:rounded-[20px] transition-all border-2 ${currentTheme === theme ? 'border-primary bg-base-200' : 'border-base-200 hover:border-primary/30'}`}
                >
                  <div className="flex gap-0.5 w-full h-8 overflow-hidden rounded-md" data-theme={theme}>
                    <div className="flex-1 bg-primary" />
                    <div className="flex-1 bg-secondary" />
                    <div className="flex-1 bg-accent" />
                  </div>
                  <span className="text-[9px] md:text-[11px] font-[1000] uppercase italic truncate text-left">
                    {theme}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE STATS & PERF : Toujours en haut sur mobile */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 md:order-2">
          
          {/* PERF CARD */}
          <div className="bg-neutral text-neutral-content rounded-[30px] md:rounded-[40px] p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Zap size={20} className="text-warning" />
              <h2 className="font-[1000] italic uppercase tracking-tight text-md">Performance</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-black uppercase italic">Animations</span>
                <input 
                  type="checkbox" className="toggle toggle-warning toggle-sm" 
                  checked={performance.reduceMotion}
                  onChange={(e) => setPerformance({...performance, reduceMotion: e.target.checked})}
                />
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-black uppercase italic">Lazy Load</span>
                <input 
                  type="checkbox" className="toggle toggle-warning toggle-sm" 
                  checked={performance.lazyLoad}
                  onChange={(e) => setPerformance({...performance, lazyLoad: e.target.checked})}
                />
              </div>
            </div>
          </div>

          {/* DB STATUS : Design compact */}
          <div className="bg-base-100 border-2 border-base-200 rounded-[30px] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 font-[1000] italic uppercase text-sm">
              <Database size={18} className="text-primary" /> Infrastructure
            </div>
            <div className="flex flex-row lg:flex-col xl:flex-row items-center gap-6">
               <div className="radial-progress text-primary font-black italic text-[10px]" style={{"--value": 42, "--size": "4rem"} as any}>42%</div>
               <div className="flex-1">
                 <p className="text-[10px] font-black uppercase italic tracking-tighter leading-tight text-primary">Neon Database</p>
                 <p className="text-[9px] font-bold opacity-40">8.4 / 20 MB</p>
               </div>
            </div>
          </div>

          <div className="hidden lg:flex bg-base-200/50 rounded-[30px] p-6 items-center gap-4 border border-base-300">
             <ShieldCheck className="text-success" size={24} />
             <p className="font-[1000] italic uppercase text-[10px] opacity-60">Admin Security Active</p>
          </div>

        </div>
      </div>
    </div>
  );
}