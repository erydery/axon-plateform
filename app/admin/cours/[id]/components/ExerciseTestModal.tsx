"use client";

import React, { useState } from "react";
import { X, CheckCircle2, HelpCircle, Eye, EyeOff, Brain, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExerciseTestModal({ chapter, onClose }: { chapter: any, onClose: () => void }) {
  let data: any = {};
  try {
    data = typeof chapter.content === "string" ? JSON.parse(chapter.content) : chapter.content;
  } catch (e) { 
    console.error("Erreur de parsing", e); 
  }

  const [tab, setTab] = useState<"qcm" | "reflexion">("qcm");
  const [showAnswers, setShowAnswers] = useState<number[]>([]);

  const toggleAnswer = (idx: number) => {
    setShowAnswers(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  // Nettoie le texte Markdown (astérisques) pour un affichage propre
  const cleanText = (text: string) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '').replace(/\*/g, '• ');
  };

  const container = data.exercices || data.exercises || {};
  const qcmList = container.qcm || [];
  const reflexionList = container.reflexion || container.reflexions || [];

  return (
    <dialog className="modal modal-open backdrop-blur-sm z-[110]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="modal-box max-w-3xl w-[95%] bg-base-100 rounded-[35px] p-0 border-2 border-base-200 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* HEADER TABS */}
        <div className="p-6 border-b flex justify-between items-center bg-base-200/40">
          <div className="flex bg-base-300/50 p-1.5 rounded-2xl">
            <button 
              onClick={() => setTab("qcm")}
              className={`px-6 py-2 rounded-xl text-[10px] font-[1000] uppercase italic transition-all ${tab === 'qcm' ? 'bg-base-100 text-amber-600 shadow-md' : 'opacity-40'}`}
            >
              Validation QCM ({qcmList.length})
            </button>
            <button 
              onClick={() => setTab("reflexion")}
              className={`px-6 py-2 rounded-xl text-[10px] font-[1000] uppercase italic transition-all ${tab === 'reflexion' ? 'bg-base-100 text-indigo-600 shadow-md' : 'opacity-40'}`}
            >
              Études de Cas ({reflexionList.length})
            </button>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost hover:bg-red-500/10 hover:text-red-500"><X size={20}/></button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {tab === "qcm" ? (
              <motion.div key="qcm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                {qcmList.map((q: any, i: number) => (
                  <div key={i} className="bg-base-200/30 border border-base-200 rounded-[25px] p-6 group transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black uppercase opacity-20 italic tracking-widest">Question 0{i+1}</span>
                      <button onClick={() => toggleAnswer(i)} className="text-[10px] font-black text-amber-600 flex items-center gap-2 uppercase italic bg-amber-500/5 px-3 py-1 rounded-full">
                        {showAnswers.includes(i) ? <><EyeOff size={14}/> Masquer</> : <><Eye size={14}/> Voir la réponse</>}
                      </button>
                    </div>
                    <p className="font-bold text-lg mb-6 italic leading-snug">{q.question}</p>
                    <div className="grid grid-cols-1 gap-3">
                      {(q.options || []).map((opt: string, idx: number) => {
                        const isCorrect = q.reponse === opt || q.answer === opt;
                        const reveal = showAnswers.includes(i);
                        return (
                          <div key={idx} className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold ${reveal && isCorrect ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700' : 'bg-base-100 border-base-200 opacity-60'}`}>
                            <span className="opacity-30 mr-3 italic">{String.fromCharCode(65 + idx)}.</span> {opt}
                          </div>
                        );
                      })}
                    </div>
                    {showAnswers.includes(i) && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-5 bg-emerald-500/5 rounded-2xl border-l-4 border-emerald-500 text-xs italic leading-relaxed text-emerald-800">
                        <span className="font-black uppercase block mb-2 tracking-tighter">Analyse pédagogique :</span>
                        {cleanText(q.explication || q.explanation || "Basé sur les standards du module.")}
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="reflexion" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                {reflexionList.map((p: any, i: number) => (
                  <div key={i} className="border-2 border-dashed border-base-300 rounded-[30px] p-8 relative">
                    <div className="absolute -top-3 left-8 bg-base-100 px-4 flex items-center gap-2 text-indigo-500">
                      <Brain size={16}/>
                      <span className="text-[10px] font-black uppercase italic italic">Défi Réflexif {i+1}</span>
                    </div>
                    <p className="text-xl font-bold italic mb-6 leading-tight pt-2">
                        "{p.enonce || p.question || "Problématique métier à analyser."}"
                    </p>
                    <div className="collapse bg-indigo-500/5 rounded-[20px] border border-indigo-500/10">
                      <input type="checkbox" className="min-h-0" /> 
                      <div className="collapse-title min-h-0 py-4 px-6 text-[11px] font-[1000] uppercase text-indigo-500 flex items-center gap-2 cursor-pointer">
                        <ArrowRight size={16}/> Pistes de résolution expert
                      </div>
                      <div className="collapse-content text-sm italic opacity-80 px-6 pb-6 whitespace-pre-line leading-relaxed border-t border-indigo-500/5 pt-4">
                        {cleanText(p.solution || p.pistesSolution || "Consulter le support de cours.")}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-base-200/20 flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost rounded-2xl font-[1000] uppercase italic text-[11px] px-8">Quitter</button>
          <button className="btn btn-primary rounded-2xl px-10 font-[1000] uppercase italic text-[11px] shadow-lg shadow-primary/20 border-none">Enregistrer</button>
        </div>
      </motion.div>
    </dialog>
  );
}