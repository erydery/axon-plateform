"use client";

import React, { useRef } from "react";
import { X, BookOpen, LogOut, AlignLeft, Hash, Anchor, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ChapterPreviewModal({ chapter, onClose }: { chapter: any, onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (!chapter) return null;

  let data: any;
  try {
    data = typeof chapter.content === "string" ? JSON.parse(chapter.content) : chapter.content;
  } catch (e) {
    return (
      <dialog className="modal modal-open backdrop-blur-md">
        <div className="modal-box border-t-4 border-error bg-base-100 rounded-3xl p-8 shadow-2xl">
          <h3 className="font-black italic uppercase text-lg text-error">Erreur de structure</h3>
          <button className="btn btn-error btn-sm w-full mt-4 rounded-xl" onClick={onClose}>Fermer</button>
        </div>
      </dialog>
    );
  }

  // Normalisation des données pour supporter toutes les variantes de clés de l'IA
  const sections = data.sections || data.Sections || data.Chapitres || [];
  const introduction = data.introduction || data.intro || data.Introduction || "";
  const conclusion = data.conclusion || data.Conclusion || data.synthèse || "";

  const introText = introduction.trim();
  const firstLetter = introText.charAt(0);
  const restOfIntro = introText.slice(1);

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element && containerRef.current) {
      containerRef.current.scrollTo({
        top: element.offsetTop - 20,
        behavior: "smooth",
      });
    }
  };

  return (
    <dialog className="modal modal-open backdrop-blur-md p-2 md:p-4 z-[100]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal-box max-w-5xl w-full h-[90vh] bg-base-100 rounded-[32px] p-0 border-2 border-base-300 shadow-2xl overflow-hidden flex flex-col relative"
      >
        <motion.div className="absolute top-0 left-0 right-0 h-1.5 bg-primary z-[60] origin-left" style={{ scaleX }} />

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-base-300 bg-base-200/50 backdrop-blur-md flex justify-between items-center shrink-0 z-50">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2.5 rounded-2xl text-primary-content shadow-lg shadow-primary/20">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-[1000] italic uppercase tracking-tighter leading-none">
                {chapter.title}
              </h1>
              <p className="text-[9px] font-black uppercase opacity-40 mt-1.5 italic tracking-[0.2em]">Lecture Interactive</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost bg-base-300/20 hover:bg-error hover:text-white transition-all">
            <X size={18}/>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR DYNAMIQUE */}
          <aside className="hidden lg:flex w-64 border-r border-base-300 bg-base-200/5 flex-col p-6 overflow-y-auto shrink-0">
            <div className="flex items-center gap-2 mb-8 opacity-40 text-primary">
              <AlignLeft size={14} />
              <span className="text-[10px] font-[1000] uppercase tracking-widest italic">Plan de cours</span>
            </div>
            <nav className="space-y-1">
              <button onClick={() => scrollToId('intro')} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase italic hover:bg-primary/10 hover:text-primary transition-all text-left">
                <Hash size={14} className="text-primary" /> Introduction
              </button>
              {sections.map((s: any, i: number) => (
                <button key={i} onClick={() => scrollToId(`section-${i}`)} className="w-full flex items-start gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase italic hover:bg-primary/10 hover:text-primary transition-all text-left opacity-60 group">
                  <span className="opacity-30 group-hover:opacity-100">0{i+1}</span>
                  <span className="truncate">{s.grandTitre || s.titre || s.title || `Partie ${i+1}`}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* ZONE DE LECTURE */}
          <main ref={containerRef} className="flex-1 overflow-y-auto scroll-smooth bg-base-100/30">
            <div className="max-w-2xl mx-auto px-6 md:px-10 py-16 pb-40 space-y-24">
              
              {/* INTRODUCTION */}
              {introText && (
                <section id="intro" className="scroll-mt-10">
                  <div className="flex items-center gap-4 mb-10">
                    <span className="text-5xl font-[1000] italic opacity-10 tracking-tighter text-primary">00</span>
                    <h2 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter border-b-4 border-primary/20 pb-2">
                      Préambule
                    </h2>
                  </div>
                  <div className="prose prose-base md:prose-lg max-w-none prose-p:text-base-content/80 prose-strong:text-primary">
                    <div className="relative">
                      <span className="float-left text-7xl md:text-8xl font-[1000] text-primary mr-4 mt-2 leading-[0.7] select-none italic drop-shadow-sm">
                        {firstLetter}
                      </span>
                      <ReactMarkdown>{restOfIntro}</ReactMarkdown>
                    </div>
                  </div>
                </section>
              )}

              {/* SECTIONS AVEC DÉTECTION ROBUSTE DES EXEMPLES */}
              <div className="space-y-24">
                {sections.map((s: any, i: number) => {
                  const titre = s.grandTitre || s.titre || s.title || `Section ${i+1}`;
                  const corps = s.contenu || s.content || s.text || "";
                  
                  // Détection de l'exemple (on cherche toutes les clés possibles)
                  const exempleContent = s.exemple || s.example || s.illustration || s.cas_pratique || s.Exemple;

                  return (
                    <section key={i} id={`section-${i}`} className="scroll-mt-10 group/sec">
                      <div className="flex items-center gap-4 mb-8">
                        <span className="text-5xl font-[1000] italic opacity-5 tracking-tighter group-hover/sec:opacity-20 transition-opacity">0{i+1}</span>
                        <h2 className="text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter border-b-4 border-base-300 pb-2 group-hover/sec:border-primary/30 transition-colors">
                          {titre}
                        </h2>
                      </div>
                      
                      <div className="prose prose-base md:prose-lg max-w-none prose-p:text-base-content/80 prose-headings:text-base-content prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter">
                        <ReactMarkdown>{corps}</ReactMarkdown>
                      </div>

                      {/* RENDU DE L'EXEMPLE AMÉLIORÉ */}
                      {exempleContent && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="mt-12 bg-base-200/70 p-8 rounded-[35px] border-2 border-primary/10 relative overflow-hidden group/ex shadow-inner"
                        >
                           <div className="absolute -right-4 -top-4 opacity-[0.03] rotate-12 group-hover/ex:opacity-10 group-hover/ex:scale-110 transition-all duration-500">
                             <Lightbulb size={120} />
                           </div>
                           <div className="relative z-10">
                             <div className="flex items-center gap-3 mb-5">
                                <div className="h-1 w-8 bg-primary rounded-full" />
                                <span className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-primary italic">Cas d'application expert</span>
                             </div>
                             <div className="text-sm md:text-base italic font-medium leading-relaxed text-base-content/90 prose-p:mb-4 last:prose-p:mb-0">
                               <ReactMarkdown>{exempleContent}</ReactMarkdown>
                             </div>
                           </div>
                        </motion.div>
                      )}
                    </section>
                  );
                })}
              </div>

              {/* CONCLUSION */}
              {conclusion && (
                <section id="conclusion" className="bg-primary p-10 rounded-[40px] text-primary-content relative shadow-2xl shadow-primary/30 overflow-hidden mt-10">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <Anchor size={100} />
                  </div>
                  <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-primary-content/50" /> Point Clé Final
                  </h3>
                  <div className="text-sm md:text-lg opacity-90 italic font-medium leading-relaxed">
                    <ReactMarkdown>{conclusion}</ReactMarkdown>
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-base-100 flex justify-between items-center shrink-0">
          <p className="text-[9px] font-black uppercase opacity-30 italic hidden md:block">Plateforme d'apprentissage IA • 2026</p>
          <button onClick={onClose} className="btn btn-primary h-12 rounded-2xl px-10 font-[1000] italic uppercase tracking-widest text-[11px] border-none shadow-lg shadow-primary/20">
            <LogOut size={16} className="mr-2" /> Terminer la lecture
          </button>
        </div>
      </motion.div>
    </dialog>
  );
}