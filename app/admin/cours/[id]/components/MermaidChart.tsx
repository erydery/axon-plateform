"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialisation avec des paramètres de tolérance élevés
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  securityLevel: "loose", // Permet d'être moins strict sur les caractères
  themeVariables: {
    primaryColor: "#7c3aed",
    primaryTextColor: "#ffffff",
    lineColor: "#64748b",
    fontSize: "14px",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    useMaxWidth: true,
  },
});

export default function MermaidChart({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const generateDiagram = async () => {
      if (!chart || chart === "null") return;

      // 1. Nettoyage profond du texte envoyé par l'IA
      let cleanChart = chart
        .replace(/```mermaid/g, "")
        .replace(/```/g, "")
        .replace(/&quot;/g, '"') // Décodage des guillemets HTML
        .trim();

      // 2. Vérification de sécurité : Si l'IA n'a pas mis de mot-clé, on en force un
      if (!cleanChart.startsWith("graph") && !cleanChart.startsWith("flowchart") && !cleanChart.startsWith("sequenceDiagram")) {
        cleanChart = `graph TD\n${cleanChart}`;
      }

      try {
        setError(false);
        const uniqueId = `axon-mermaid-${Math.random().toString(36).substring(2, 9)}`;
        
        // Utilisation de la méthode render avec gestion de promesse
        const renderResult = await mermaid.render(uniqueId, cleanChart);
        
        // Dans certaines versions, renderResult est l'objet { svg }, dans d'autres c'est juste le string
        const svgContent = typeof renderResult === "string" ? renderResult : renderResult.svg;
        setSvg(svgContent);
      } catch (err) {
        console.error("Détail Erreur Mermaid:", err);
        setError(true);
      }
    };

    generateDiagram();
  }, [chart]);

  if (!chart || chart === "null") return null;

  return (
    <div className="my-10 w-full flex flex-col items-center">
      <div className="w-full bg-base-200/40 rounded-[35px] p-8 border-2 border-base-200 shadow-inner flex items-center justify-center min-h-[200px]">
        {error ? (
          <div className="flex flex-col items-center text-center gap-3 opacity-50 italic">
            <div className="badge badge-error badge-outline font-black text-[8px]">SYNTAX_ERROR</div>
            <p className="text-xs font-bold">Le schéma contient des caractères incompatibles.</p>
            <p className="text-[10px] opacity-60">Astuce : Utilisez des mots simples dans le titre du chapitre.</p>
          </div>
        ) : (
          <div 
            className="mermaid-render w-full flex justify-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: svg }} 
          />
        )}
      </div>
    </div>
  );
}