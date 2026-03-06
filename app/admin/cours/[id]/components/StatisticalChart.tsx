"use client";
import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Line, ComposedChart, Scatter 
} from 'recharts';

export default function StatisticalChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  // TRI CRITIQUE : Empêche les lignes de s'entremêler si l'IA génère X dans le désordre
  const sortedData = [...data].sort((a, b) => a.x - b.x);

  return (
    <div className="w-full bg-white p-4 md:p-8 rounded-[40px] shadow-xl border-2 border-base-200 my-10 group overflow-hidden">
      {/* Aspect ratio fluide : s'adapte à la largeur du parent sans hauteur fixe bloquante */}
      <div className="w-full aspect-[16/10] md:aspect-video min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sortedData} margin={{ top: 10, right: 20, bottom: 10, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              stroke="#9ca3af" 
              fontSize={10} 
              tick={{fontWeight: '900'}} 
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              stroke="#9ca3af" 
              fontSize={10} 
              tick={{fontWeight: '900'}} 
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              cursor={{ stroke: '#570df8', strokeWidth: 2 }} 
              contentStyle={{ 
                borderRadius: '20px', 
                border: 'none', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                fontWeight: 'bold' 
              }} 
            />
            <Scatter name="Points" data={sortedData} fill="#570df8" />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#ff52d9" 
              dot={false} 
              strokeWidth={4} 
              animationDuration={2000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-[8px] font-[1000] uppercase opacity-20 italic mt-4 tracking-[0.4em] group-hover:opacity-100 transition-opacity">
        Analyse de Corrélation Axon
      </p>
    </div>
  );
}