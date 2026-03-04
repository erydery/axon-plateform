"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSectorsWithCounts } from "@/utils/action";

import AddSectorModal from "./components/AddSectorModal";
import ManageSectorModal from "./components/ManageSectorModal";
import DeleteSectorModal from "./components/DeleteSectorModal";

import { 
  GraduationCap, Gavel, Cpu, Layers, BookOpen, 
  Search, Activity, Trash2, Settings2 
} from "lucide-react";

const STYLE_MAP: Record<string, { icon: any, color: string, bg: string }> = {
  medecine: { icon: GraduationCap, color: "text-rose-500", bg: "bg-rose-500/10" },
  droit: { icon: Gavel, color: "text-blue-500", bg: "bg-blue-500/10" },
  ingenierie: { icon: Cpu, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  default: { icon: Layers, color: "text-primary", bg: "bg-primary/10" }
};

export default function AdminPage() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const refreshData = useCallback(async () => {
    try {
      const data = await getSectorsWithCounts();
      setSectors(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const filteredSectors = sectors.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden p-4 md:p-8 space-y-10">
      
      {/* --- HEADER ULTRA-RESPONSIVE --- */}
      <header className="flex flex-wrap items-center justify-center md:justify-between gap-6 w-full">
        <div className="text-center md:text-left min-w-[280px]">
          <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black italic text-[9px] md:text-[10px] uppercase tracking-[0.4em] mb-2">
            <Activity size={14} className="animate-pulse" /> Live Neon Sync
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter leading-none">
            Filières <span className="text-base-content/20">&</span> Options
          </h2>
        </div>
        
        {/* Le bouton : se place à droite si possible, sinon se centre en dessous sans casser le design */}
        <div className="flex justify-center md:justify-end shrink-0 w-full sm:w-auto">
          <AddSectorModal sectors={sectors} onSuccess={refreshData} />
        </div>
      </header>

      {/* --- BARRE DE RECHERCHE --- */}
      <div className="relative w-full max-w-2xl mx-auto">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="input w-full h-14 pl-14 rounded-2xl bg-base-200/50 border-none font-bold italic text-lg focus:ring-2 focus:ring-primary/20 transition-all" 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- GRILLE DES CARTES --- */}
      <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredSectors.map((sector) => {
              const style = STYLE_MAP[sector.slug] || STYLE_MAP.default;
              const Icon = style.icon;

              return (
                <motion.div 
                  key={sector.id}
                  layout
                  className="w-full bg-base-100 border border-base-200 rounded-[28px] md:rounded-[35px] p-5 md:p-7 flex flex-col md:flex-row items-center md:items-center justify-between gap-6 hover:border-primary/30 transition-all shadow-sm group"
                >
                  {/* GAUCHE : ICONE + TEXTE (Centré sur mobile, à gauche sur desktop) */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 w-full min-w-0 text-center sm:text-left">
                    <div className={`p-5 rounded-2xl ${style.bg} ${style.color} shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon size={28} />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl md:text-3xl font-[1000] uppercase italic tracking-tighter truncate leading-none mb-2">
                        {sector.name}
                      </h3>
                      <div className="flex justify-center sm:justify-start gap-4 text-[10px] md:text-xs font-bold opacity-30 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Layers size={14} /> {sector.optionsCount}</span>
                        <span className="flex items-center gap-1.5"><BookOpen size={14} /> {sector.coursesCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* DROITE : BOUTONS (Full width sur mobile) */}
                  <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-none border-base-200/50">
                    <button 
                      onClick={() => (document.getElementById(`manage_modal_${sector.id}`) as HTMLDialogElement).showModal()}
                      className="btn btn-primary flex-1 md:flex-none h-12 px-6 rounded-xl font-black italic uppercase text-[10px] tracking-widest border-none"
                    >
                      <Settings2 size={16} className="mr-2" /> Gérer
                    </button>
                    
                    <button 
                      onClick={() => (document.getElementById(`delete_modal_${sector.id}`) as HTMLDialogElement).showModal()}
                      className="btn btn-ghost btn-circle h-12 w-12 text-error/30 hover:bg-error/10"
                    >
                      <Trash2 size={20} />
                    </button>

                    <ManageSectorModal sector={sector} onSuccess={refreshData} />
                    <DeleteSectorModal sector={sector} onSuccess={refreshData} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}