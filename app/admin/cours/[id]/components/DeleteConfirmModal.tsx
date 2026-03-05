"use client";

import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }: DeleteProps) {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open backdrop-blur-md z-[150]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal-box bg-base-100 border-2 border-base-200 rounded-[35px] p-8 max-w-sm shadow-2xl text-center"
      >
        <div className="bg-red-500/10 text-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        
        <h3 className="text-xl font-[1000] italic uppercase tracking-tighter mb-2">Supprimer ?</h3>
        <p className="text-[10px] font-black uppercase opacity-40 italic mb-8 px-4 leading-relaxed">
          Es-tu sûr de vouloir supprimer <span className="text-red-500">"{title}"</span> ? Cette action est irréversible.
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn flex-1 rounded-xl font-[1000] uppercase italic text-[10px] border-none bg-base-200">
            Annuler
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn flex-1 rounded-xl font-[1000] uppercase italic text-[10px] border-none bg-red-500 text-white shadow-lg shadow-red-500/20">
            Confirmer
          </button>
        </div>
      </motion.div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}