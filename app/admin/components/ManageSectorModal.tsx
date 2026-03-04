"use client";

import React, { useState } from "react";
import { updateSector, deleteOption, updateOption, createOption } from "@/utils/action"; 
import { toast } from "react-toastify";
import { 
  X, Trash2, Save, Layers, 
  BarChart3, BookOpen, Check, Plus, Loader2, PencilLine
} from "lucide-react";

interface ManageSectorProps {
  sector: any;
  onSuccess: () => void | Promise<void>;
}

export default function ManageSectorModal({ sector, onSuccess }: ManageSectorProps) {
  const [loadingSector, setLoadingSector] = useState(false);
  const [addingOption, setAddingOption] = useState(false);
  const [newName, setNewName] = useState(sector.name);
  
  const [editingOptId, setEditingOptId] = useState<number | null>(null);
  const [tempOptName, setTempOptName] = useState("");
  const [quickAddName, setQuickAddName] = useState("");

  const [updatingOptId, setUpdatingOptId] = useState<number | null>(null);
  const [deletingOptId, setDeletingOptId] = useState<number | null>(null);

  const handleUpdateSector = async () => {
    if (!newName.trim()) return toast.warn("Nom requis");
    setLoadingSector(true);
    const res = await updateSector(sector.id, newName);
    if (res.success) {
      toast.success("Mis à jour");
      onSuccess();
    }
    setLoadingSector(false);
  };

  const handleQuickAdd = async () => {
    if (!quickAddName.trim()) return;
    setAddingOption(true);
    const res = await createOption(quickAddName, sector.id);
    if (res.success) {
      toast.success("Option ajoutée");
      setQuickAddName("");
      onSuccess();
    }
    setAddingOption(false);
  };

  const handleSaveOptionRename = async (id: number) => {
    if (!tempOptName.trim()) { setEditingOptId(null); return; }
    setUpdatingOptId(id);
    try {
        const res = await updateOption(id, tempOptName);
        if (res.success) {
          toast.success("Renommé");
          setEditingOptId(null);
          onSuccess();
        }
    } finally { setUpdatingOptId(null); }
  };

  const handleDeleteOpt = async (id: number, name: string) => {
    if (confirm(`Supprimer "${name}" ?`)) {
      setDeletingOptId(id);
      const res = await deleteOption(id);
      if (res.success) {
        toast.info("Supprimé");
        onSuccess();
      }
      setDeletingOptId(null);
    }
  };

  return (
    <dialog id={`manage_modal_${sector.id}`} className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
      {/* On ajoute max-h-[90vh] pour s'assurer qu'il ne dépasse JAMAIS l'écran */}
      <div className="modal-box max-w-2xl bg-base-100 rounded-[32px] p-0 border border-base-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER - FIXE */}
        <div className="flex justify-between items-center p-6 border-b border-base-200 bg-base-100 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-content shadow-md">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">{sector.name}</h3>
              <p className="text-[11px] font-bold opacity-40 uppercase tracking-[0.2em] mt-1.5 text-primary">Administration</p>
            </div>
          </div>
          <form method="dialog">
            <button className="btn btn-ghost btn-circle"><X size={24} /></button>
          </form>
        </div>

        {/* CORPS DU MODAL - SCROLLABLE */}
        <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar flex-1">

          {/* STATS */}
          <div className="grid grid-cols-2 gap-5">
            <div className="p-5 bg-base-200/40 rounded-2xl border border-base-200 flex items-center gap-5">
               <Layers className="text-primary opacity-40" size={28} />
               <div>
                  <p className="text-[11px] font-black opacity-50 uppercase mb-1">Options</p>
                  <p className="text-3xl font-[1000] italic leading-none">{sector.options?.length || 0}</p>
               </div>
            </div>
            <div className="p-5 bg-base-200/40 rounded-2xl border border-base-200 flex items-center gap-5">
               <BookOpen className="text-emerald-500 opacity-40" size={28} />
               <div>
                  <p className="text-[11px] font-black opacity-50 uppercase mb-1">Cours</p>
                  <p className="text-3xl font-[1000] italic leading-none text-emerald-500">{sector.coursesCount || 0}</p>
               </div>
            </div>
          </div>

          {/* NOM DE LA FILIÈRE */}
          <section className="space-y-4">
            <label className="text-[12px] font-black uppercase tracking-widest opacity-50 ml-1">Nom de la Filière</label>
            <div className="flex gap-3">
              <input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className="input flex-1 rounded-2xl bg-base-200 border-none font-bold italic h-14 text-xl px-6 focus:ring-2 focus:ring-primary/20 transition-all" 
              />
              <button onClick={handleUpdateSector} disabled={loadingSector} className="btn btn-primary h-14 w-14 rounded-2xl">
                {loadingSector ? <Loader2 size={24} className="animate-spin"/> : <Save size={24}/>}
              </button>
            </div>
          </section>

          {/* GESTION DES OPTIONS */}
          <section className="space-y-5 bg-base-200/20 p-6 rounded-[32px] border border-base-200">
            <h4 className="text-[12px] font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
               Unités de formation
            </h4>

            {/* AJOUT RAPIDE */}
            <div className="relative">
              <input 
                value={quickAddName}
                onChange={(e) => setQuickAddName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                placeholder="Nouvelle option..."
                className="input w-full h-14 bg-base-100 border-2 border-dashed border-base-300 rounded-2xl px-6 pr-14 font-bold italic text-lg shadow-sm"
              />
              <button 
                onClick={handleQuickAdd}
                disabled={addingOption || !quickAddName.trim()}
                className="absolute right-2 top-2 h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-md"
              >
                {addingOption ? <Loader2 size={18} className="animate-spin" /> : <Plus size={24} />}
              </button>
            </div>

            {/* LISTE DES OPTIONS */}
            <div className="space-y-3">
              {sector.options?.map((opt: any) => {
                const isUpdating = updatingOptId === opt.id;
                return (
                  <div key={opt.id} className="flex items-center justify-between p-4 bg-base-100 rounded-2xl border border-base-200/60 group hover:border-primary/40 transition-all">
                    <div className="flex-1 mr-4">
                      {editingOptId === opt.id ? (
                        <div className="flex items-center gap-3">
                          <input 
                            autoFocus
                            disabled={isUpdating}
                            value={tempOptName}
                            onChange={(e) => setTempOptName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveOptionRename(opt.id)}
                            className="input input-sm w-full bg-base-200 font-bold italic h-11 rounded-xl text-lg px-4"
                          />
                          <button onClick={() => handleSaveOptionRename(opt.id)} className="btn btn-primary btn-md btn-circle">
                            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Check size={20}/>}
                          </button>
                        </div>
                      ) : (
                        <div onDoubleClick={() => { setEditingOptId(opt.id); setTempOptName(opt.name); }} className="flex items-center gap-4 cursor-pointer">
                          <PencilLine size={18} className="opacity-10 group-hover:text-primary group-hover:opacity-100" />
                          <span className="text-base font-black italic uppercase tracking-tight">{opt.name}</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleDeleteOpt(opt.id, opt.name)} disabled={deletingOptId === opt.id} className="btn btn-ghost btn-md btn-circle text-error/30 hover:text-error opacity-0 group-hover:opacity-100 transition-all">
                      {deletingOptId === opt.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={20} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* FOOTER - FIXE */}
        <div className="p-4 bg-base-100 text-center border-t border-base-200 shrink-0">
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.5em]">System Dashboard v2.0</p>
        </div>
      </div>
    </dialog>
  );
}