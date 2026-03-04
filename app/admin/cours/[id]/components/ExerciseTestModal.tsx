"use client";

import React, { useState } from "react";
import { X, CheckCircle2, HelpCircle, Eye, EyeOff, Brain, ListChecks, ArrowRight, MessageSquareQuote, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExerciseTestModal({ chapter, onClose }: { chapter: any, onClose: () => void }) {
  let data: any = {};
  try {
    data = typeof chapter.content === "string" ? JSON.parse(chapter.content) : chapter.content;
  } catch (e) { console.error(e); }

  const [tab, setTab] = useState<"qcm" | "reflexion">("qcm");
  const [showAnswers, setShowAnswers] = useState<number[]>([]);

  const toggleAnswer = (idx: number) => {
    setShowAnswers(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const qcmList = data.exercices?.qcm || data.exercises?.qcm || [];
  const reflexionList = data.exercices?.reflexion || data.exercises?.reflexion || [];

  return (
    <dialog className="modal modal-open backdrop-blur-sm z-[110]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="modal-box max-w-3xl w-[95%] bg-base-100 rounded-[30px] p-0 border-2 border-base-200 shadow-2xl flex flex-col max-h-[85vh]"
      >
        
        {/* HEADER COMPACT */}
        <div className="p-5 border-b flex flex-col sm:flex-row justify-between items-center gap-4 bg-base-200/30">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-xl text-white">
              <CheckCircle2 size={18}/>
            </div>
            <div>
              <h3 className="font-black italic uppercase tracking-tighter text-sm">Validation Quiz</h3>
              <p className="text-[9px] opacity-40 uppercase truncate max-w-[150px]">{chapter.title}</p>
            </div>
          </div>
          
          <div className="flex bg-base-300/50 p-1 rounded-xl">
            <button 
              onClick={() => setTab("qcm")}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${tab === 'qcm' ? 'bg-base-100 shadow-sm text-amber-600' : 'opacity-40 hover:opacity-100'}`}
            >
              QCM ({qcmList.length})
            </button>
            <button 
              onClick={() => setTab("reflexion")}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${tab === 'reflexion' ? 'bg-base-100 shadow-sm text-indigo-600' : 'opacity-40 hover:opacity-100'}`}
            >
              Réflexion ({reflexionList.length})
            </button>
          </div>
          
          <button onClick={onClose} className="btn btn-xs btn-circle btn-ghost absolute right-4 top-4 sm:static"><X size={16}/></button>
        </div>

        {/* ZONE DE TEST RÉDUITE */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 custom-scrollbar bg-base-100">
          <AnimatePresence mode="wait">
            {tab === "qcm" ? (
              <motion.div key="qcm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {qcmList.map((q: any, i: number) => (
                  <div key={i} className="bg-base-200/40 border border-base-200 rounded-2xl p-5 hover:border-amber-500/20 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black uppercase opacity-30 italic">Question 0{i+1}</span>
                      <button onClick={() => toggleAnswer(i)} className="text-[10px] font-bold text-amber-600 flex items-center gap-1 hover:underline">
                        {showAnswers.includes(i) ? <><EyeOff size={12}/> Masquer</> : <><Eye size={12}/> Voir Réponse</>}
                      </button>
                    </div>
                    
                    <p className="font-bold text-base mb-4 leading-tight">{q.question}</p>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt: string, idx: number) => {
                        const isCorrect = q.reponse === opt || q.answer === opt;
                        const reveal = showAnswers.includes(i);
                        return (
                          <div key={idx} className={`p-3 rounded-xl border text-sm transition-all ${reveal && isCorrect ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 font-bold' : 'bg-base-100 border-base-200 opacity-70'}`}>
                            <span className="opacity-40 mr-2 text-[10px]">{String.fromCharCode(65 + idx)}.</span> {opt}
                          </div>
                        );
                      })}
                    </div>

                    {showAnswers.includes(i) && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-emerald-500/5 rounded-xl border-l-2 border-emerald-500 text-[11px] italic">
                        <span className="font-black uppercase text-emerald-600 block mb-1">Explication :</span>
                        {q.explication || q.explanation}
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="reflexion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {reflexionList.map((p: any, i: number) => (
                  <div key={i} className="border-2 border-dashed border-base-300 rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-indigo-500 mb-3 opacity-50">
                      <Brain size={14}/>
                      <span className="text-[9px] font-black uppercase italic tracking-widest">Réflexion {i+1}</span>
                    </div>
                    <p className="text-lg font-bold italic mb-4">"{p.enonce || p.question}"</p>
                    <div className="collapse bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                      <input type="checkbox" className="min-h-0" /> 
                      <div className="collapse-title min-h-0 py-3 px-4 text-[10px] font-black uppercase text-indigo-500 flex items-center gap-2">
                        <ArrowRight size={14}/> Pistes de correction
                      </div>
                      <div className="collapse-content text-xs italic opacity-70 px-4 pb-4">
                        {p.pistesSolution || p.solution}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER COMPACT */}
        <div className="p-5 border-t bg-base-200/20 flex justify-between items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 opacity-30 italic">
            <AlertCircle size={12}/>
            <p className="text-[9px] font-bold uppercase tracking-tighter">Preview Admin</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={onClose} className="btn btn-sm rounded-xl font-bold uppercase italic text-[10px] flex-1">Retour</button>
            <button className="btn btn-sm btn-primary rounded-xl px-6 font-black uppercase italic text-[10px] flex-1 shadow-lg shadow-primary/20">Publier</button>
          </div>
        </div>
      </motion.div>
    </dialog>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 opacity-20 text-center">
      <HelpCircle size={40} className="mb-2" />
      <p className="font-black italic uppercase text-sm">{message}</p>
    </div>
  );
}