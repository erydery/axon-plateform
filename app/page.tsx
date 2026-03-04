"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { 
  Zap, ArrowRight, Sparkles, LayoutDashboard, 
  GraduationCap, Gavel, Cpu, Menu, X
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "medecine",
    title: "Médecine",
    description: "Anatomie augmentée, cycles cliniques interactifs et examens simulés haute fidélité.",
    icon: GraduationCap,
  },
  {
    id: "droit",
    title: "Droit",
    description: "Cas pratiques dynamiques, analyse de jurisprudence et simulateur de plaidoirie.",
    icon: Gavel,
  },
  {
    id: "ingenierie",
    title: "Ingénierie",
    description: "Mathématiques avancées, physique appliquée et modélisation de systèmes complexes.",
    icon: Cpu,
  },
];

export default function Page() {
  const { isSignedIn, isLoaded } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Empêche les clics fantômes avant que l'auth ne soit prête
  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-base-100 font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      
      {/* 1. NAVBAR : CENTRAGE & RÉACTIVITÉ */}
      <nav className="navbar px-4 md:px-[10%] py-4 md:py-6 border-b-4 border-base-200 sticky top-0 z-50 bg-base-100/95 backdrop-blur-md">
        <div className="flex-1">
          <Link href="/">
            <div className="flex items-center gap-3 md:gap-4 font-[1000] text-2xl md:text-3xl tracking-tighter italic uppercase cursor-pointer group">
              <div className="bg-primary p-2 rounded-xl shadow-lg flex items-center justify-center shrink-0">
                <Zap size={22} className="text-white fill-white" />
              </div>
              AXON
            </div>
          </Link>
        </div>

        <div className="flex-none gap-4">
          <div className="hidden lg:flex gap-8 text-[11px] font-[1000] uppercase italic tracking-widest opacity-40">
            <button className="hover:text-primary transition-colors">Produits</button>
            <button className="hover:text-primary transition-colors">Méthode</button>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {isSignedIn ? (
              <>
                <Link href="/admin">
                  <button className="btn btn-ghost btn-sm md:btn-md font-[1000] italic uppercase tracking-widest text-[9px] md:text-[10px] gap-2 border-2 border-base-200 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <LayoutDashboard size={16} className="text-primary" />
                    <span className="hidden sm:inline">Console</span>
                  </button>
                </Link>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border-4 border-base-200" } }} />
              </>
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/admin">
                <button className="btn btn-primary rounded-xl md:rounded-[20px] px-6 md:px-10 font-[1000] italic border-none uppercase tracking-widest text-[10px] md:text-xs h-12 md:h-14 shadow-lg shadow-primary/20 flex items-center justify-center">
                  Connexion
                </button>
              </SignInButton>
            )}
            <button className="lg:hidden btn btn-ghost btn-circle btn-sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-base-100 border-b-4 border-base-200 overflow-hidden flex flex-col p-6 gap-4 font-[1000] italic uppercase text-xl text-center">
             <Link href="#" className="p-4 bg-base-200 rounded-2xl active:bg-primary active:text-white transition-colors">Produits</Link>
             <Link href="#" className="p-4 bg-base-200 rounded-2xl active:bg-primary active:text-white transition-colors">Méthode</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO : LOGIQUE DE CLIC DÉMARRER FIXÉE */}
      <section className="pt-20 md:pt-40 pb-16 md:pb-32 text-center px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-base-200 border-2 border-base-300 mb-10 font-[1000] tracking-[0.2em] text-[10px] uppercase italic opacity-60">
            <Sparkles size={14} className="text-primary animate-pulse" /> AXON CORE ENGINE V1.0
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[120px] font-[1000] tracking-[-0.05em] uppercase italic mb-10 leading-[0.9] md:leading-[0.85]">
            L'intelligence <br /> 
            <span className="text-primary underline decoration-[8px] md:decoration-[18px] underline-offset-[4px] md:underline-offset-[12px]">Pédagogique.</span>
          </h1>

          <p className="text-lg md:text-2xl lg:text-3xl text-base-content/40 max-w-3xl mx-auto mb-12 md:mb-20 font-bold italic leading-tight uppercase tracking-tighter px-4">
            La console d'apprentissage la plus puissante au monde. <br className="hidden md:block"/> Transformez vos données en excellence académique.
          </p>

          <div className="w-full sm:w-auto px-6 flex justify-center">
            {isSignedIn ? (
              <Link href="/admin" className="w-full sm:w-auto">
                <button className="btn btn-primary w-full sm:w-auto h-20 md:h-24 px-12 md:px-20 rounded-2xl md:rounded-[50px] font-[1000] italic text-xl md:text-3xl gap-4 border-none shadow-2xl shadow-primary/30 flex items-center justify-center active:scale-95 transition-transform">
                  Ouvrir la Console <ArrowRight size={32} />
                </button>
              </Link>
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/admin">
                <button className="btn btn-primary w-full sm:w-auto h-20 md:h-24 px-12 md:px-20 rounded-2xl md:rounded-[50px] font-[1000] italic text-xl md:text-3xl gap-4 border-none shadow-2xl shadow-primary/30 flex items-center justify-center active:scale-95 transition-transform">
                  Démarrer <ArrowRight size={32} />
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </section>

      {/* 3. STATS : GRILLE HARMONISÉE */}
      <section className="py-12 md:py-24 bg-base-200/50 border-y-4 border-base-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-6 text-center">
          {[
            { value: "+92%", label: "Taux de rétention" },
            { value: "4.0x", label: "Optimisation" },
            { value: "∞", label: "Données" },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-6xl md:text-8xl font-[1000] tracking-tighter text-primary italic leading-none">{stat.value}</h3>
              <p className="text-[10px] md:text-[11px] uppercase font-black tracking-[0.3em] opacity-30 italic leading-none">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DOMAINES : CENTRAGE ABSOLU DES ÉLÉMENTS */}
      <section className="py-20 md:py-40 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((f) => (
            <div 
              key={f.id} 
              className="group bg-base-100 border-4 border-base-200 rounded-[45px] md:rounded-[65px] p-10 md:p-14 transition-all hover:border-primary shadow-sm flex flex-col items-center text-center justify-between min-h-[500px] md:min-h-[600px]"
            >
              <div className="flex flex-col items-center">
                <div className="p-6 md:p-8 rounded-[30px] bg-base-200 text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shadow-inner">
                  <f.icon size={44} className="md:w-16 md:h-16" />
                </div>
                <h3 className="text-4xl md:text-6xl font-[1000] uppercase italic mb-6 tracking-tighter leading-none">{f.title}</h3>
                <p className="text-lg md:text-xl opacity-40 font-[1000] italic uppercase leading-tight tracking-tighter max-w-[260px]">
                  {f.description}
                </p>
              </div>
              <button className="btn btn-primary w-full md:w-auto rounded-[25px] md:rounded-[35px] px-12 h-16 md:h-20 font-[1000] italic text-lg uppercase shadow-lg mt-10 flex items-center justify-center gap-3 active:scale-95 transition-all">
                Explorer <ArrowRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA FINAL : FIXÉ AUSSI */}
      <section className="py-24 md:py-48 text-center px-6 bg-base-200/50">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-5xl md:text-9xl font-[1000] italic uppercase tracking-tighter mb-16 leading-[1] md:leading-[0.85]">
            Prêt à dominer <br /> <span className="text-primary underline decoration-[10px] md:decoration-[20px] underline-offset-4 md:underline-offset-8">le Savoir ?</span>
          </h2>
          
          <div className="w-full flex justify-center">
            {isSignedIn ? (
              <Link href="/admin" className="w-full sm:w-auto">
                <button className="btn btn-primary w-full sm:w-auto h-24 md:h-32 px-16 md:px-28 rounded-[40px] md:rounded-[60px] font-[1000] italic text-2xl md:text-4xl border-none shadow-2xl shadow-primary/40 active:scale-95 transition-all flex items-center justify-center">
                  ACCÉDER
                </button>
              </Link>
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/admin">
                <button className="btn btn-primary w-full sm:w-auto h-24 md:h-32 px-16 md:px-28 rounded-[40px] md:rounded-[60px] font-[1000] italic text-2xl md:text-4xl border-none shadow-2xl shadow-primary/40 active:scale-95 transition-all flex items-center justify-center">
                  DÉMARRER
                </button>
              </SignInButton>
            )}
          </div>

          <p className="mt-20 text-[10px] font-black uppercase tracking-[1em] opacity-20 italic">Axon Enterprise System © 2026</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 md:py-24 bg-base-100 border-t-4 border-base-200 text-center">
        <div className="flex flex-col items-center opacity-30 font-[1000] italic uppercase tracking-[0.4em] text-[10px] md:text-xs">
            <div className="flex items-center gap-4 mb-4 justify-center">
              <Zap size={24} className="fill-current shrink-0" /> AXON SYSTEM
            </div>
            <p className="leading-relaxed">© 2026 • Kevin NgolZamba & EssiDev <br /> All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}