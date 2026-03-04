"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, Plus, Search, Layers, 
  Eye, X, Save, Type, Filter
} from "lucide-react";
import { toast } from "react-toastify";
import { createCourse, getCoursesWithDetails, getSectorsData } from "@/utils/action";
import DeleteCourseModal from "./_components/DeleteCourseModal";

export default function CoursesListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  
  // États pour la création
  const [selectedSectorId, setSelectedSectorId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // ÉTATS POUR LE FILTRAGE DE LA LISTE
  const [filterSector, setFilterSector] = useState<string>("all");
  const [filterOption, setFilterOption] = useState<string>("all");

  const refreshData = async () => {
    const [dbCourses, dbSectors] = await Promise.all([
      getCoursesWithDetails(),
      getSectorsData()
    ]);
    setCourses(dbCourses);
    setSectors(dbSectors);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Options pour la modale de création
  const creationOptions = sectors.find(s => s.id.toString() === selectedSectorId)?.options || [];

  // Options pour le filtre de recherche
  const filterOptions = sectors.find(s => s.id.toString() === filterSector)?.options || [];

  // LOGIQUE DE FILTRAGE
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = filterSector === "all" || course.option?.sectorId?.toString() === filterSector;
    const matchesOption = filterOption === "all" || course.optionId?.toString() === filterOption;
    
    return matchesSearch && matchesSector && matchesOption;
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const optionId = Number(formData.get("optionId"));

    try {
      const res = await createCourse(title, optionId);
      if (res.success) {
        toast.success("Cours créé avec succès !");
        form.reset();
        setSelectedSectorId("");
        (document.getElementById("add_course_modal") as HTMLDialogElement).close();
        await refreshData();
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-10 pb-20 px-4 md:px-0">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-4xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-none">
          Répertoire <span className="text-base-content/20">Cours</span>
        </h2>
        <button 
          onClick={() => (document.getElementById("add_course_modal") as HTMLDialogElement).showModal()}
          className="btn btn-primary h-16 px-10 rounded-[22px] font-[1000] italic uppercase text-xs tracking-widest border-none shadow-2xl transition-all hover:scale-105"
        >
          <Plus size={20} className="mr-2 stroke-[3]" /> Nouveau Cours
        </button>
      </header>

      {/* BARRE DE RECHERCHE ET FILTRES */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Recherche */}
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:text-primary transition-all" size={22} />
            <input 
              type="text" 
              placeholder="Rechercher un cours..." 
              className="input w-full h-16 pl-16 rounded-[24px] bg-base-200/50 border-none font-bold italic text-lg focus:ring-4 focus:ring-primary/10 transition-all" 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtre Secteur */}
          <div className="flex gap-2 w-full lg:w-auto">
            <select 
              className="select h-16 rounded-[22px] bg-base-200/50 border-none font-bold italic flex-1 lg:w-48 focus:ring-4 focus:ring-primary/10"
              value={filterSector}
              onChange={(e) => {
                setFilterSector(e.target.value);
                setFilterOption("all"); // Reset l'option quand le secteur change
              }}
            >
              <option value="all">Toutes les Filières</option>
              {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            {/* Filtre Option */}
            <select 
              className="select h-16 rounded-[22px] bg-base-200/50 border-none font-bold italic flex-1 lg:w-48 focus:ring-4 focus:ring-primary/10 disabled:opacity-30"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              disabled={filterSector === "all"}
            >
              <option value="all">Toutes les Options</option>
              {filterOptions.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-base-100 border-2 border-base-200 rounded-[45px] p-8 flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-2xl relative overflow-hidden"
              >
                {/* ... (Reste du contenu de la carte inchangé) ... */}
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-base-200 rounded-[22px] text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                      <BookOpen size={28} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-base-200 w-fit rounded-full">
                      <Layers size={10} className="text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                        {course.option?.sector?.name} • {course.option?.name}
                      </span>
                    </div>
                    <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter leading-[1.1] group-hover:text-primary transition-colors line-clamp-2 h-[3rem]">
                      {course.title}
                    </h3>
                  </div>

                  <div className="pt-6 border-t border-base-200 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase opacity-30 italic">
                      {course.chapters?.length || 0} Chapitres
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/admin/cours/${course.id}`}>
                        <button className="btn btn-sm btn-square rounded-xl bg-base-200 border-none hover:bg-primary hover:text-white transition-all">
                          <Plus size={16} />
                        </button>
                      </Link>
                      <DeleteCourseModal 
                        courseId={course.id} 
                        courseTitle={course.title} 
                        onSuccess={refreshData} 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-30 font-[1000] uppercase italic text-2xl tracking-tighter">
              Aucun cours ne correspond à ces critères
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* MODALE DE CRÉATION (Inchangée) */}
      <dialog id="add_course_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-md">
        <div className="modal-box bg-base-100 border-2 border-base-200 rounded-[40px] md:rounded-[55px] p-6 md:p-12 max-w-2xl shadow-2xl">
          <div className="flex justify-between items-start mb-10">
            <h3 className="text-4xl font-[1000] italic uppercase tracking-tighter leading-none">
              Nouveau <span className="text-primary">Cours</span>
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost opacity-30 hover:opacity-100"><X size={24} /></button>
            </form>
          </div>
          <form onSubmit={handleCreate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label text-[10px] font-black uppercase opacity-40 italic tracking-widest">Filière</label>
                <select className="select select-lg w-full rounded-2xl bg-base-200 border-none font-bold italic" value={selectedSectorId} onChange={(e) => setSelectedSectorId(e.target.value)} required>
                  <option value="">Sélectionner...</option>
                  {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-control">
                <label className="label text-[10px] font-black uppercase opacity-40 italic tracking-widest">Option</label>
                <select name="optionId" className="select select-lg w-full rounded-2xl bg-base-200 border-none font-bold italic" disabled={!selectedSectorId} required>
                  <option value="">Choisir l'option...</option>
                  {creationOptions.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase opacity-40 italic tracking-widest">Titre du Cours</label>
              <div className="relative">
                <Type className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                <input name="title" type="text" placeholder="ex: Pharmacologie Spéciale" className="input input-lg w-full pl-14 rounded-2xl bg-base-200 border-none font-bold italic" required />
              </div>
            </div>
            <div className="modal-action">
              <button type="submit" disabled={loading} className="btn btn-primary w-full h-16 rounded-[25px] font-[1000] italic uppercase tracking-widest border-none shadow-xl shadow-primary/20">
                {loading ? <span className="loading loading-spinner"></span> : <><Save size={20} className="mr-2" /> Créer le cours</>}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}