"use client";

import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  BookOpen, 
  Database, 
  Settings, 
  ChevronRight,
  Zap,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser(); 
  const pathname = usePathname();

  const menuItems = [
    { name: "Filières & Options", icon: LayoutDashboard, href: "/admin" },
    { name: "Gestion des Cours", icon: BookOpen, href: "/admin/cours" },
    { name: "Stats Exercices", icon: Database, href: "/admin/exercices" },
  ];

  return (
    <div className="drawer lg:drawer-open bg-base-300 min-h-screen font-sans">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* CONTENU PRINCIPAL */}
      <div className="drawer-content flex flex-col p-4 md:p-8">
        
        {/* Header Mobile */}
        <div className="flex justify-between items-center mb-8 lg:hidden">
          <label htmlFor="admin-drawer" className="btn btn-primary btn-circle drawer-button shadow-lg shadow-primary/20 border-none">
            <Zap size={20} fill="white" />
          </label>
          <h1 className="text-xl font-[1000] italic tracking-tighter text-primary">AXON</h1>
          <div className="scale-110">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Container du contenu blanc */}
        <div className="bg-base-100 rounded-[40px] shadow-2xl p-6 md:p-8 min-h-[85vh] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
          {children}
        </div>
      </div> 

      {/* SIDEBAR */}
      <div className="drawer-side z-50">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label> 
        
        {/* Menu Wrapper - Changement ici : overflow-y-visible pour laisser le menu Clerk s'afficher */}
        <div className="menu p-6 w-80 min-h-full bg-base-200 text-base-content flex flex-col border-r border-base-300 overflow-visible">
          
          <div className="flex-1 overflow-visible">
            {/* Logo Section + Bouton Fermer */}
            <div className="mb-12 px-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20">
                  <Zap size={22} className="text-white fill-white" />
                </div>
                <h1 className="text-2xl font-[1000] italic tracking-tighter uppercase">
                  AXON <span className="text-[10px] font-black opacity-30 tracking-widest ml-1">ADMIN</span>
                </h1>
              </div>

              {/* BOUTON FERMER MOBILE */}
              <label htmlFor="admin-drawer" className="btn btn-ghost btn-circle btn-sm lg:hidden">
                <X size={20} />
              </label>
            </div>

            {/* Menu Links */}
            <ul className="space-y-3 p-0">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold italic uppercase text-[11px] tracking-widest ${
                      pathname === item.href 
                      ? "bg-primary text-white shadow-xl shadow-primary/30" 
                      : "hover:bg-base-300 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                    {pathname === item.href && <ChevronRight size={14} className="ml-auto animate-pulse" />}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="divider opacity-5 my-10"></div>
            
            <Link href="/admin/settings" className="flex items-center gap-4 p-4 rounded-2xl font-bold italic uppercase text-[11px] tracking-widest opacity-50 hover:opacity-100 transition-all hover:bg-base-300">
              <Settings size={18} />
              Paramètres
            </Link>
          </div>

          {/* PROFIL UTILISATEUR (Fixé en bas) */}
          <div className="mt-auto pt-6 overflow-visible">
            <div className="bg-base-100 p-4 rounded-[24px] flex items-center gap-4 border border-base-300 shadow-sm relative overflow-visible">
              <div className="scale-110">
                {/* Le composant UserButton est enveloppé dans une div avec overflow-visible 
                  pour permettre au menu popup de Clerk de s'afficher par-dessus les autres éléments.
                */}
                <UserButton 
                  afterSignOutUrl="/" 
                  appearance={{
                    elements: {
                      userButtonPopoverCard: "z-[1001]"
                    }
                  }}
                />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[9px] font-[1000] uppercase tracking-tighter opacity-30 italic">
                  Compte Admin
                </span>
                <span className="text-xs font-black italic truncate w-32 uppercase tracking-tighter text-primary">
                  {!isLoaded ? (
                    <span className="loading loading-dots loading-xs"></span>
                  ) : (
                    user?.fullName || user?.username || "Administrateur"
                  )}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}