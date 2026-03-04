"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Sparkles, BookOpen, Layout, FileText, 
  Plus, X, Type, BrainCircuit, AlignLeft, MoreVertical, 
  CheckCircle2, Gauge
} from "lucide-react";
import { toast } from "react-toastify";

// Utilitaires et Actions
import { chatSession } from "@/utils/GeminiAIModal";
import { getCourseWithChapters, saveChapterAI } from "@/utils/action";
import ChapterPreviewModal from "./components/ChapterPreviewModal";
import ExerciseTestModal from "./components/ExerciseTestModal";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null); // Ref pour vider le formulaire
  
  // États
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  // États des Modales
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [testChapter, setTestChapter] = useState<any>(null);

  const refreshData = async () => {
    try {
      const data = await getCourseWithChapters(Number(id));
      if (data) setCourse(data);
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) refreshData();
  }, [id]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenerating(true);

    const formData = new FormData(e.currentTarget);
    const chapterTitle = formData.get("chapterTitle") as string;
    const description = formData.get("description") as string;

    const inputPrompt = `
      Spécialité: ${course?.option?.name}, Module: ${course?.title}, Chapitre: ${chapterTitle},
      Objectifs: ${description || "Expert"}.
      MISSION: Génère un JSON pur contenant :
      1. Un cours complet (intro, sections avec exemples, conclusion).
      2. EXACTEMENT 10 QCM (question, options[4], reponse, explication).
      3. EXACTEMENT 5 PROBLÈMES de réflexion (enonce, pistesSolution).
      Structure: { "introduction": "...", "sections": [...], "conclusion": "...", "exercices": { "qcm": [...], "reflexion": [...] } }
    `;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const cleanJson = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
       
      const resp = await saveChapterAI({
        courseId: Number(id),
        title: chapterTitle,
        content: cleanJson
      });

      if (resp) {
        toast.success("Chapitre généré avec succès !");
        
        // 1. On ferme la modale
        (document.getElementById("add_chapter_modal") as HTMLDialogElement).close();
        
        // 2. ON VIDE LE FORMULAIRE ICI
        formRef.current?.reset();
        
        await refreshData();
      }
    } catch (error) {
      toast.error("Erreur lors de la génération IA");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-base-100 p-6">
      <span className="loading loading-ring loading-lg text-primary scale-125 md:scale-150"></span>
    </div>
  );

  return (
    <div className="w-full space-y-8 md:space-y-12 pb-20 px-4 max-w-7xl mx-auto">
      
      {/* HEADER RESPONSIVE */}
      <header className="flex flex-col md:flex-row justify-between items-center md:items-center gap-6 text-center md:text-left pt-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
          <button onClick={() => router.back()} className="btn btn-circle btn-ghost bg-base-200 shadow-sm">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl md:text-5xl font-[1000] italic uppercase tracking-tighter">
              Édition <span className="text-primary italic">Module</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-40 italic mt-2">
              {course?.title} <span className="hidden md:inline">•</span> <br className="md:hidden" /> {course?.option?.name}
            </p>
          </div>
        </div>

        <button 
          onClick={() => (document.getElementById("add_chapter_modal") as HTMLDialogElement).showModal()}
          className="btn btn-primary h-14 md:h-16 w-full md:w-auto px-8 rounded-[22px] font-[1000] italic uppercase tracking-widest border-none shadow-xl shadow-primary/20"
        >
          <Sparkles size={18} className="mr-2" /> Nouveau Chapitre
        </button>
      </header>

      {/* SOMMAIRE */}
      <section className="space-y-6 md:space-y-8">
        <h3 className="text-xl md:text-2xl font-[1000] italic uppercase tracking-tighter flex items-center justify-center md:justify-start gap-3">
          <Layout className="text-primary" size={22} /> Sommaire du cursus
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {course?.chapters?.map((chapter: any, index: number) => (
              <motion.div 
                key={chapter.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-base-100 border-2 border-base-200 rounded-[35px] md:rounded-[40px] p-6 md:p-8 hover:border-primary/40 transition-all flex flex-col justify-between h-72 md:h-80 shadow-sm hover:shadow-xl relative"
              >
                <div className="flex justify-between items-start">
                   <span className="text-4xl md:text-5xl font-[1000] italic opacity-5 group-hover:opacity-20 transition-opacity">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                   </span>
                   <div className="flex flex-col gap-1 items-end">
                      <span className="badge badge-xs bg-emerald-500/10 text-emerald-600 border-none font-black uppercase p-2 text-[8px]">10 QCM</span>
                      <span className="badge badge-xs bg-indigo-500/10 text-indigo-600 border-none font-black uppercase p-2 text-[8px]">5 Défis</span>
                   </div>
                </div>
                
                <h4 className="text-lg md:text-xl font-[1000] uppercase italic tracking-tighter leading-tight line-clamp-2">
                  {chapter.title}
                </h4>

                <div className="pt-4 border-t border-base-200 flex justify-between items-center gap-2">
                   <div className="flex gap-2">
                      <button onClick={() => setSelectedChapter(chapter)} className="btn btn-sm btn-square rounded-xl bg-base-200 border-none hover:bg-primary hover:text-white transition-all">
                        <FileText size={18}/>
                      </button>
                      <button onClick={() => setTestChapter(chapter)} className="btn btn-sm btn-square rounded-xl bg-amber-500/10 text-amber-600 border-none hover:bg-amber-500 hover:text-white transition-all">
                        <BrainCircuit size={18}/>
                      </button>
                   </div>
                   <button className="btn btn-xs btn-ghost font-black italic uppercase tracking-widest text-[8px] opacity-30 hover:opacity-100">
                    Options
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* BOUTON AJOUT VIDE */}
          <button 
            onClick={() => (document.getElementById("add_chapter_modal") as HTMLDialogElement).showModal()}
            className="border-4 border-dashed border-base-200 rounded-[35px] md:rounded-[40px] flex flex-col items-center justify-center p-8 gap-4 group hover:border-primary/40 transition-all opacity-30 hover:opacity-100 h-72 md:h-80"
          >
            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
            <p className="font-[1000] uppercase italic tracking-tighter text-sm">Ajouter</p>
          </button>
        </div>
      </section>

      {/* MODALES */}
      <AnimatePresence>
        {selectedChapter && <ChapterPreviewModal chapter={selectedChapter} onClose={() => setSelectedChapter(null)} />}
        {testChapter && <ExerciseTestModal chapter={testChapter} onClose={() => setTestChapter(null)} />}
      </AnimatePresence>

      {/* MODALE DE GÉNÉRATION AMÉLIORÉE */}
      <dialog id="add_chapter_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-md">
        <div className="modal-box bg-base-100 border-2 border-base-200 rounded-t-[40px] sm:rounded-[45px] p-6 md:p-14 max-w-2xl shadow-2xl overflow-visible">
          
          <div className="mb-8 md:mb-10 text-center sm:text-left">
            <h3 className="text-3xl md:text-4xl font-[1000] italic uppercase tracking-tighter leading-none">
              Intelligence <span className="text-primary italic">Pédagogique</span>
            </h3>
            <p className="text-[9px] font-black uppercase opacity-40 mt-3 tracking-widest italic">
              Cours + 10 QCM + 5 Problèmes
            </p>
          </div>

          <form ref={formRef} onSubmit={onSubmit} className="space-y-4 md:space-y-6">
            <div className="form-control">
              <label className="label text-[9px] font-black uppercase opacity-40 italic">Titre du chapitre</label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                <input name="chapterTitle" type="text" placeholder="ex: Analyse de données" className="input input-bordered w-full pl-12 rounded-xl bg-base-200 border-none font-bold italic h-14 md:h-16" required />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-[9px] font-black uppercase opacity-40 italic">Instructions</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-5 opacity-20" size={18} />
                <textarea name="description" placeholder="Points clés..." className="textarea w-full pl-12 pt-4 rounded-xl bg-base-200 border-none font-bold italic min-h-[120px] md:min-h-[140px]"></textarea>
              </div>
            </div>

            <button type="submit" disabled={generating} className="btn btn-primary w-full h-16 md:h-20 rounded-[22px] md:rounded-[28px] font-[1000] italic uppercase tracking-widest shadow-xl shadow-primary/30">
              {generating ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <><Sparkles size={18} className="mr-2" /> Générer</>
              )}
            </button>
          </form>

          {/* Bouton de fermeture sur mobile */}
          <div className="modal-action sm:hidden">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm opacity-50">Annuler</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Fermer</button>
        </form>
      </dialog>

    </div>
  );
}