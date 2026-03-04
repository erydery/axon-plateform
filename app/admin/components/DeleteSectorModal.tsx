"use client";

import React, { useState } from "react";
import { deleteSector } from "@/utils/action";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteProps {
  sector: any;
  onSuccess: () => void;
}

export default function DeleteSectorModal({ sector, onSuccess }: DeleteProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteSector(sector.id);
    if (res.success) {
      (document.getElementById(`delete_modal_${sector.id}`) as HTMLDialogElement).close();
      onSuccess();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <dialog id={`delete_modal_${sector.id}`} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-base-100 border-2 border-error/20 rounded-[40px] p-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-6 bg-error/10 text-error rounded-full animate-pulse">
            <AlertTriangle size={48} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter text-error">Action Critique</h3>
            <p className="font-bold opacity-60">
              Voulez-vous vraiment supprimer la filière <span className="text-base-content underline decoration-error/40 italic">"{sector.name}"</span> ?
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 pt-4">
              ⚠️ Cette action supprimera également toutes les options et cours associés.
            </p>
          </div>

          <div className="flex gap-4 w-full pt-4">
            <form method="dialog" className="flex-1">
              <button className="btn btn-ghost w-full rounded-2xl font-black italic uppercase">Annuler</button>
            </form>
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="btn btn-error flex-[2] rounded-2xl font-black italic uppercase text-white shadow-xl shadow-error/20 border-none"
            >
              {loading ? <span className="loading loading-spinner"></span> : "Supprimer définitivement"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}