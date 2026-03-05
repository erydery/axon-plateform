"use client";

import React, { useRef } from "react";
import { X, BookOpen, LogOut, Lightbulb, Hash } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; 
import { motion, useScroll, useSpring } from "framer-motion";

export default function ChapterPreviewModal({ chapter, onClose }: { chapter: any, onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (!chapter) return null;

  let data: any;
  try {
    data = typeof chapter.content === "string" ? JSON.parse(chapter.content) : chapter.content;
  } catch (e) {
    return <div className="modal modal-open"><div className="modal-box text-error font-black italic">ERREUR DE FORMAT JSON</div></div>;
  }

  // CONFIGURATION DU RENDU (SUPPORT TABLEAUX)
  const MarkdownConfig = {
    remarkPlugins: [remarkGfm],
    components: {
      table: ({ children }: any) => (
        <div className="my-10 overflow-hidden border-2 border-base-300 rounded-[30px] bg-base-100 shadow-xl">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full border-separate border-spacing-0">
              {children}
            </table>
          </div>
        </div>
      ),
      thead: ({ children }: any) => <thead className="bg-primary text-primary-content uppercase italic font-black text-[10px] tracking-widest">{children}</thead>,
      th: ({ children }: any) => <th className="p-5 text-center">{children}</th>,
      td: ({ children }: any) => <td className="p-5 font-bold italic opacity-80 text-center border-t border-base-200">{children}</td>,
      ul: ({ children }: any) => <ul className="space-y-4 my-8 list-none px-4">{children}</ul>,
      li: ({ children }: any) => (
        <li className="flex gap-4 items-start">
          <div className="mt-2 h-2.5 w-2.5 rounded-full bg-primary shrink-0 shadow-lg shadow-primary/40" />
          <span className="text-base-content/90 font-medium italic leading-relaxed">{children}</span>
        </li>
      ),
      blockquote: ({ children }: any) => (
        <div className="my-10 border-l-[12px] border-primary bg-primary/5 p-10 rounded-r-[40px] italic font-bold text-xl opacity-90 shadow-inner">
          {children}
        </div>
      )
    }
  };

  const sections = data.sections || [];

  return (
    <dialog className="modal modal-open backdrop-blur-md z-[100] p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="modal-box max-w-6xl w-full h-[90vh] bg-base-100 rounded-[45px] p-0 border-2 border-base-200 shadow-2xl overflow-hidden flex flex-col relative">
        <motion.div className="absolute top-0 left-0 right-0 h-2 bg-primary z-[60] origin-left" style={{ scaleX }} />

        <div className="px-8 py-6 border-b border-base-300 bg-base-200/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-5">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg"><BookOpen size={24} /></div>
            <div>
              <h1 className="text-xl font-[1000] italic uppercase tracking-tighter leading-none">{chapter.title}</h1>
              <p className="text-[9px] font-black uppercase opacity-40 mt-1.5 italic tracking-widest">Contenu Expert Axon</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost bg-base-300/50 hover:bg-error hover:text-white transition-colors"><X size={20}/></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden lg:flex w-72 border-r border-base-300 bg-base-200/10 flex-col p-8 overflow-y-auto shrink-0">
            <p className="text-[9px] font-black uppercase opacity-30 mb-6 italic tracking-widest underline underline-offset-8 decoration-primary">Sommaire Technique</p>
            <nav className="space-y-3">
              {sections.map((s: any, i: number) => (
                <div key={i} className="flex items-start gap-4 px-2 py-1 text-[10px] font-black uppercase italic opacity-60">
                  <span className="text-primary">0{i+1}</span>
                  <span className="truncate">{s.titre}</span>
                </div>
              ))}
            </nav>
          </aside>

          <main ref={containerRef} className="flex-1 overflow-y-auto bg-base-100/50 scroll-smooth">
            <div className="max-w-3xl mx-auto px-8 py-20 pb-48 space-y-28">
              
              <section id="intro">
                <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter border-b-8 border-primary/10 pb-4 mb-12">Préambule</h2>
                <div className="prose prose-lg max-w-none italic leading-relaxed text-base-content/80">
                  <ReactMarkdown {...MarkdownConfig}>{data.introduction}</ReactMarkdown>
                </div>
              </section>

              {sections.map((s: any, i: number) => (
                <section key={i} className="group">
                  <div className="flex items-center gap-6 mb-10">
                    <span className="text-6xl font-[1000] italic opacity-5 group-hover:opacity-20 transition-opacity">0{i+1}</span>
                    <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter border-b-4 border-base-200 pb-2 group-hover:border-primary transition-all">
                      {s.titre}
                    </h2>
                  </div>
                  <div className="prose prose-lg max-w-none mb-12">
                    <ReactMarkdown {...MarkdownConfig}>{s.contenu}</ReactMarkdown>
                  </div>

                  

                  {s.exemple && (
                    <div className="mt-12 bg-base-200/60 p-10 rounded-[45px] border-4 border-primary/5 relative shadow-inner overflow-hidden">
                       <div className="absolute -right-6 -top-6 opacity-[0.05] rotate-12"><Lightbulb size={150} /></div>
                       <div className="flex items-center gap-3 mb-6 relative z-10">
                          <div className="w-10 h-1 bg-primary rounded-full" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Cas d'application</span>
                       </div>
                       <div className="italic font-bold text-base-content/80 relative z-10 leading-relaxed">
                         <ReactMarkdown {...MarkdownConfig}>{s.exemple}</ReactMarkdown>
                       </div>
                    </div>
                  )}
                </section>
              ))}

              <section className="bg-primary p-12 rounded-[55px] text-primary-content shadow-2xl shadow-primary/30 mt-20 relative overflow-hidden">
                <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter mb-8">Synthèse Expert</h3>
                <div className="text-xl italic font-bold opacity-90 leading-relaxed">
                  <ReactMarkdown {...MarkdownConfig}>{data.conclusion}</ReactMarkdown>
                </div>
              </section>
            </div>
          </main>
        </div>

        <div className="p-8 border-t bg-base-100 flex justify-between items-center shrink-0">
          <p className="text-[10px] font-black uppercase opacity-20 italic tracking-widest">Axon Intellect • 2026</p>
          <button onClick={onClose} className="btn btn-primary h-14 rounded-2xl px-12 font-[1000] italic uppercase tracking-widest text-xs border-none shadow-xl">
            <LogOut size={18} className="mr-3" /> Quitter la leçon
          </button>
        </div>
      </motion.div>
    </dialog>
  );
}