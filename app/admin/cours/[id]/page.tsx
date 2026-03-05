"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Sparkles, Layout, FileText, 
  Plus, Type, BrainCircuit, AlignLeft, Trash2
} from "lucide-react";
import { toast } from "react-toastify";

import { chatSession } from "@/utils/GeminiAIModal";
import { getCourseWithChapters, saveChapterAI, deleteChapter } from "@/utils/action";
import ChapterPreviewModal from "./components/ChapterPreviewModal";
import ExerciseTestModal from "./components/ExerciseTestModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal"; // Ton nouveau composant

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null); 
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  // États pour la gestion des modals et de la suppression
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [testChapter, setTestChapter] = useState<any>(null);
  const [chapterToDelete, setChapterToDelete] = useState<any>(null);

  const refreshData = async () => {
    try {
      const data = await getCourseWithChapters(Number(id));
      if (data) setCourse(data);
    } catch (error) {
      toast.error("Erreur de synchronisation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) refreshData();
  }, [id]);

  const handleConfirmDelete = async () => {
    if (!chapterToDelete) return;
    
    try {
      const resp = await deleteChapter(chapterToDelete.id);
      if (resp && resp.success) {
        toast.success("Chapitre supprimé");
        refreshData();
      }
    } catch (error) {
      toast.error("Échec de la suppression");
    } finally {
      setChapterToDelete(null);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenerating(true);

    const formData = new FormData(e.currentTarget);
    const chapterTitle = formData.get("chapterTitle") as string;
    const description = formData.get("description") as string;

    const inputPrompt = `
  Tu es un expert en enseignement supérieur spécialisé en ${course?.option?.name}.
  Sujet : ${course?.title}
  Chapitre : ${chapterTitle}
  Instructions : ${description}

  MISSION : Génère un contenu de cours magistral ultra-complet au format JSON PUR.

  RÈGLES DE FORMATAGE :
  - Pour les données comparatives ou chiffrées, utilise EXCLUSIVEMENT des tableaux Markdown.
  - Ne mets PAS de tableaux si le contenu est purement narratif ou théorique.
  - Utilise des listes à puces pour les énumérations.

  STRUCTURE JSON STRICTE (NE PAS CHANGER LES CLÉS) :
  {
    "introduction": "...",
    "sections": [
      { "titre": "...", "contenu": "...", "exemple": "..." }
    ],
    "conclusion": "...",
    "exercices": {
      "qcm": [
        { 
          "question": "...", 
          "options": ["...", "...", "...", "..."], 
          "reponse": "copier exactement l'option correcte", 
          "explication": "..." 
        }
      ],
      "reflexion": [
        { 
          "enonce": "...", 
          "solution": "..." 
        }
      ]
    }
  }

  QUANTITÉ : 10 QCM et 5 exercices de reflexion.
  LANGUE : Français.
`;
    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const cleanJson = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        
      const resp = await saveChapterAI({
        courseId: Number(id),
        title: chapterTitle,
        content: cleanJson
      });

      if (resp && resp.success) {
        toast.success("Chapitre expert généré !");
        formRef.current?.reset();
        (document.getElementById("add_chapter_modal") as HTMLDialogElement).close();
        setTimeout(() => refreshData(), 500);
      }
    } catch (error) {
      toast.error("Échec de la génération");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-base-100"><span className="loading loading-ring loading-lg text-primary scale-150"></span></div>;

  return (
    <div className="w-full space-y-12 pb-20 px-4 max-w-7xl mx-auto pt-6">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <button onClick={() => router.back()} className="btn btn-circle btn-ghost bg-base-200"><ChevronLeft size={24} /></button>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-[1000] italic uppercase tracking-tighter">Édition <span className="text-primary italic">Module</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic mt-2">{course?.title} • {course?.option?.name}</p>
          </div>
        </div>
        <button onClick={() => (document.getElementById("add_chapter_modal") as HTMLDialogElement).showModal()} className="btn btn-primary h-16 w-full md:w-auto px-10 rounded-[22px] font-[1000] italic uppercase tracking-widest border-none shadow-xl shadow-primary/20">
          <Sparkles size={18} className="mr-2" /> Nouveau Chapitre
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {course?.chapters?.map((chapter: any, index: number) => (
            <motion.div key={chapter.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="group bg-base-100 border-2 border-base-200 rounded-[40px] p-8 hover:border-primary/40 transition-all flex flex-col justify-between h-80 shadow-sm hover:shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                 <span className="text-5xl font-[1000] italic opacity-5">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                 <div className="flex flex-col gap-1 items-end">
                    <button 
                      onClick={() => setChapterToDelete(chapter)}
                      className="btn btn-xs btn-circle btn-ghost text-red-500 hover:bg-red-500 hover:text-white transition-all mb-2"
                    >
                      <Trash2 size={14}/>
                    </button>
                    <span className="badge badge-xs bg-emerald-500/10 text-emerald-600 border-none font-black p-2 text-[8px]">10 QCM</span>
                    <span className="badge badge-xs bg-indigo-500/10 text-indigo-600 border-none font-black p-2 text-[8px]">5 DÉFIS</span>
                 </div>
              </div>
              <h4 className="text-xl font-[1000] uppercase italic tracking-tighter leading-tight line-clamp-2">{chapter.title}</h4>
              <div className="pt-4 border-t border-base-200 flex justify-between items-center">
                <div className="flex gap-2">
                  <button onClick={() => setSelectedChapter(chapter)} className="btn btn-sm btn-square rounded-xl bg-base-200 border-none hover:bg-primary hover:text-white transition-all"><FileText size={18}/></button>
                  <button onClick={() => setTestChapter(chapter)} className="btn btn-sm btn-square rounded-xl bg-amber-500/10 text-amber-600 border-none hover:bg-amber-500 hover:text-white transition-all"><BrainCircuit size={18}/></button>
                </div>
                <span className="text-[8px] font-black uppercase opacity-20 italic">AXON CORE</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button onClick={() => (document.getElementById("add_chapter_modal") as HTMLDialogElement).showModal()} className="border-4 border-dashed border-base-200 rounded-[40px] flex flex-col items-center justify-center p-8 gap-4 group hover:border-primary/40 transition-all opacity-30 h-80">
          <Plus size={32} className="group-hover:rotate-90 transition-transform" />
          <p className="font-[1000] uppercase italic tracking-tighter text-sm">Ajouter</p>
        </button>
      </div>

      <AnimatePresence>
        {selectedChapter && <ChapterPreviewModal chapter={selectedChapter} onClose={() => setSelectedChapter(null)} />}
        {testChapter && <ExerciseTestModal chapter={testChapter} onClose={() => setTestChapter(null)} />}
        {chapterToDelete && (
          <DeleteConfirmModal 
            isOpen={!!chapterToDelete}
            title={chapterToDelete.title}
            onClose={() => setChapterToDelete(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>

      <dialog id="add_chapter_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-md">
        <div className="modal-box bg-base-100 border-2 border-base-200 rounded-t-[40px] sm:rounded-[45px] p-10 max-w-2xl shadow-2xl">
          <h3 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-8 text-center sm:text-left">Intelligence <span className="text-primary italic">Pédagogique</span></h3>
          <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label text-[9px] font-black uppercase opacity-40 italic">Titre du chapitre</label>
              <input name="chapterTitle" type="text" placeholder="ex: Bilan et Compte de Résultat" className="input input-bordered w-full rounded-xl bg-base-200 border-none font-bold italic h-16" required />
            </div>
            <div className="form-control">
              <label className="label text-[9px] font-black uppercase opacity-40 italic">Instructions Spécifiques</label>
              <textarea name="description" placeholder="..." className="textarea w-full rounded-xl bg-base-200 border-none font-bold italic min-h-[140px]"></textarea>
            </div>
            <button type="submit" disabled={generating} className="btn btn-primary w-full h-20 rounded-[28px] font-[1000] italic uppercase tracking-widest shadow-xl border-none">
              {generating ? <span className="loading loading-spinner"></span> : <><Sparkles size={18} className="mr-2" /> Générer le module</>}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>Fermer</button></form>
      </dialog>
    </div>
  );
}