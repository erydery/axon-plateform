import React from 'react';
import { getFullSystemStats } from '@/utils/action';
import { Brain, BookOpen, Layers, Zap, GraduationCap, Activity } from 'lucide-react';

export default async function DashboardPage() {
  const stats = await getFullSystemStats();

  if (!stats) return (
    <div className="flex items-center justify-center min-h-[50vh] font-[1000] italic uppercase opacity-20">
      Chargement des data...
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 md:space-y-10 max-w-7xl mx-auto">
      
      {/* HEADER ADAPTATIF */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-base-200 pb-8">
        <div>
          <h1 className="text-4xl sm:text-6xl font-[1000] italic uppercase tracking-tighter leading-none">
            Analytics <span className="text-primary">Global</span>
          </h1>
          <p className="text-[10px] font-black uppercase opacity-40 mt-3 tracking-widest italic flex items-center gap-2">
            <Activity size={12} className="text-primary shrink-0"/> 
            Monitoring système en temps réel
          </p>
        </div>
      </header>

      {/* GRILLE KPI : 2 colonnes sur mobile, 4 sur desktop */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { label: "Secteurs", val: stats.totals.sectors, icon: Layers, color: "text-blue-500" },
          { label: "Options", val: stats.totals.options, icon: GraduationCap, color: "text-purple-500" },
          { label: "Cours", val: stats.totals.courses, icon: BookOpen, color: "text-amber-500" },
          { label: "Questions IA", val: stats.totals.exercises, icon: Brain, color: "text-emerald-500" }
        ].map((item, i) => (
          <div key={i} className="bg-base-100 border-2 border-base-200 rounded-[25px] md:rounded-[35px] p-5 md:p-8 hover:border-primary/30 transition-all shadow-sm group">
            <item.icon className={`${item.color} mb-3 transition-transform group-hover:scale-110`} size={22} />
            <div className="text-2xl sm:text-3xl md:text-5xl font-[1000] italic tracking-tighter leading-none">
              {item.val}
            </div>
            <div className="text-[8px] md:text-[10px] font-black uppercase opacity-40 tracking-widest mt-2">
              {item.label}
            </div>
          </div>
        ))}
      </section>

      {/* ANALYSE VISUELLE : GRILLE MIXTE */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* BLOC RÉPARTITION : 2 colonnes sur desktop, liste intelligente */}
        <div className="lg:col-span-2 bg-base-100 border-2 border-base-200 rounded-[35px] md:rounded-[50px] p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="text-primary" size={20} />
            <h3 className="text-xl md:text-2xl font-[1000] italic uppercase tracking-tighter">Répartition du contenu</h3>
          </div>
          
          {/* Grille interne : Se split en 2 colonnes sur tablette/desktop pour gagner de la hauteur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {stats.distribution.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end text-[9px] font-[1000] uppercase italic">
                  <span className="truncate pr-4">{item.name}</span>
                  <span className="text-primary shrink-0">{item.value} cours</span>
                </div>
                <div className="h-2.5 w-full bg-base-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(item.value / (stats.totals.courses || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOC IA : Compact et visuel */}
        <div className="bg-primary rounded-[35px] md:rounded-[50px] p-8 md:p-10 text-primary-content flex flex-col justify-between shadow-2xl shadow-primary/20 relative overflow-hidden">
          {/* Déco background */}
          <div className="absolute -right-10 -top-10 opacity-10 rotate-12">
            <Brain size={200} />
          </div>

          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-[1000] italic uppercase tracking-tighter mb-8">Moteur IA</h3>
            
            {/* Grille 2 colonnes sur mobile, 1 sur desktop dans la box */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-white/10 p-5 rounded-[20px] backdrop-blur-md border border-white/10">
                <p className="text-[8px] font-black uppercase opacity-60 tracking-widest mb-1">Précision</p>
                <p className="text-2xl font-[1000] italic">98.4%</p>
              </div>
              <div className="bg-white/10 p-5 rounded-[20px] backdrop-blur-md border border-white/10">
                <p className="text-[8px] font-black uppercase opacity-60 tracking-widest mb-1">Vitesse</p>
                <p className="text-2xl font-[1000] italic">14s/ch</p>
              </div>
            </div>
          </div>

          <div className="mt-10 relative z-10 border-t border-white/10 pt-6">
            <p className="text-[8px] font-[1000] uppercase italic opacity-50 tracking-tighter">
              Modèle : Gemini 1.5 Flash
            </p>
          </div>
        </div>

      </section>

      {/* FOOTER STATUS (Optionnel, utile pour ton Toshiba) */}
      <footer className="flex justify-center md:justify-start">
        <div className="badge badge-outline border-base-300 opacity-30 font-black italic uppercase text-[8px] p-3 rounded-full">
          Système synchronisé • Neon SQL Cloud
        </div>
      </footer>
    </div>
  );
}