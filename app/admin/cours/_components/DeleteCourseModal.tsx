"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { toast } from "react-toastify";
import { deleteCourse } from "@/utils/action";

interface DeleteProps {
  courseId: number;
  courseTitle: string;
  onSuccess: () => void;
}

export default function DeleteCourseModal({ courseId, courseTitle, onSuccess }: DeleteProps) {
  const [loading, setLoading] = useState(false);
  const modalId = `delete_modal_${courseId}`;

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteCourse(courseId);

    if (res.success) {
      toast.success("Cours supprimé avec succès");
      (document.getElementById(modalId) as HTMLDialogElement).close();
      onSuccess(); 
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  return (
    <>
      
      <button 
        onClick={() => (document.getElementById(modalId) as HTMLDialogElement).showModal()}
        className="btn btn-sm btn-square rounded-xl bg-base-200 border-none hover:bg-error hover:text-white transition-all shadow-sm"
      >
        <Trash2 size={16} />
      </button>


      <dialog id={modalId} className="modal modal-bottom sm:modal-middle backdrop-blur-md">
        <div className="modal-box bg-base-100 border-2 border-base-200 rounded-[40px] p-8 max-w-md shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-5 bg-error/10 text-error rounded-full animate-pulse">
              <AlertTriangle size={40} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter">Confirmation</h3>
              <p className="text-sm opacity-60 font-medium">
                Es-tu sûr de vouloir supprimer <br />
                <span className="text-base-content font-bold underline">"{courseTitle}"</span> ?
                <br />Cette action est irréversible.
              </p>
            </div>

            <div className="flex gap-4 w-full pt-4">
              <form method="dialog" className="flex-1">
                <button className="btn btn-ghost w-full rounded-2xl font-bold uppercase italic tracking-widest text-xs">
                  Annuler
                </button>
              </form>
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="btn btn-error flex-1 rounded-2xl font-[1000] uppercase italic tracking-widest text-xs text-white shadow-lg shadow-error/20"
              >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}