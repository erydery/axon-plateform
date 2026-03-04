"use client";

import React, { useState } from "react";
import { createSector, createOption } from "@/utils/action";
import { Plus, X } from "lucide-react";

// On définit l'interface pour que TS accepte onSuccess dans le parent
interface AddSectorProps {
  sectors: any[];
  onSuccess: () => void | Promise<void>;
}

export default function AddSectorModal({ sectors, onSuccess }: AddSectorProps) {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"sector" | "option">("sector");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    
    let res;
    if (tab === "sector") {
      res = await createSector(name);
    } else {
      res = await createOption(name, Number(formData.get("sectorId")));
    }

    if (res.success) {
      const modal = document.getElementById("add_modal") as HTMLDialogElement;
      if (modal) modal.close();
      form.reset();
      onSuccess(); // Déclenche le refresh dans page.tsx
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  return (
    <>
      <button 
        onClick={() => (document.getElementById("add_modal") as HTMLDialogElement).showModal()} 
        className="btn btn-primary rounded-2xl font-black italic uppercase text-xs px-8 border-none"
      >
        <Plus size={20} className="mr-2" /> Nouveau
      </button>

      <dialog id="add_modal" className="modal">
        <div className="modal-box bg-base-100 rounded-[40px] p-8 border border-base-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter">Ajouter</h3>
            <form method="dialog"><button className="btn btn-ghost btn-circle btn-sm"><X/></button></form>
          </div>

          <div className="flex gap-2 p-1 bg-base-200 rounded-2xl mb-6">
            <button type="button" onClick={() => setTab("sector")} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase ${tab === "sector" ? "bg-primary text-white shadow-md" : "opacity-40"}`}>Filière</button>
            <button type="button" onClick={() => setTab("option")} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase ${tab === "option" ? "bg-primary text-white shadow-md" : "opacity-40"}`}>Option</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {tab === "option" && (
              <div className="form-control">
                <label className="label text-[10px] font-bold uppercase opacity-40">Filière cible</label>
                <select name="sectorId" className="select select-bordered w-full rounded-xl bg-base-200 border-none font-bold" required>
                  {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
            <div className="form-control">
              <label className="label text-[10px] font-bold uppercase opacity-40">Nom</label>
              <input name="name" type="text" placeholder="Entrez le nom..." className="input input-bordered w-full rounded-xl bg-base-200 border-none font-bold italic" required />
            </div>
            <button disabled={loading} className="btn btn-primary w-full rounded-xl font-black italic uppercase h-14 border-none shadow-lg shadow-primary/20">
              {loading ? <span className="loading loading-spinner"></span> : "Confirmer"}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}