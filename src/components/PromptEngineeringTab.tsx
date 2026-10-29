import React from "react";
import { EvaluationResult } from "../types";
import { Sliders, AlertTriangle } from "lucide-react";

interface PromptEngineeringProps {
  evaluations: EvaluationResult[];
}

export const PromptEngineeringTab: React.FC<PromptEngineeringProps> = ({ evaluations }) => {
  // Aggregate failure categories from evaluated interactions
  const failureCounts: { [key: string]: number } = {
    "Conhecimento": 0,
    "Alucinação": 0,
    "Comunicação": 0,
    "Escopo": 0,
    "Segurança": 0,
    "Diagnóstico": 0,
    "Fluxo de Atendimento": 0,
    "Ambiguidade": 0,
    "Encerramento": 0,
    "Persona": 0
  };

  evaluations.forEach(e => {
    if (e.categoriaErro && failureCounts[e.categoriaErro] !== undefined) {
      failureCounts[e.categoriaErro] += 1;
    }
  });

  const failureEntries = Object.entries(failureCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white font-sans tracking-tight">Centro de Engenharia de Prompt</h2>
          <p className="text-slate-400 text-xs mt-1">
            Ferramentas para evolução contínua e auditoria em tempo real de falhas mapeadas por categoria de desvio detectado no Prompt Oficial da Emis.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 bg-slate-900 text-white font-semibold text-xs py-1.5 px-3 rounded-lg border border-slate-800 shadow-sm">
          <Sliders size={14} className="text-blue-400" />
          <span>Prompt Workshop v3.5</span>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-white tracking-tight flex items-center border-b border-slate-800 pb-2">
          <AlertTriangle className="text-amber-400 mr-2" size={16} />
          Mapeamento de Falhas Detectadas no Prompt
        </h3>

        <div className="space-y-4">
          {failureEntries.map(([category, count]) => {
            const maxVal = Math.max(...Object.values(failureCounts));
            const pct = maxVal > 0 ? Math.round((count / maxVal) * 100) : 0;
            
            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-250">{category}</span>
                  <span className={`font-mono text-xs font-bold ${count > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                    {count} {count === 1 ? 'falha' : 'falhas'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      count > 0 ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]" : "bg-slate-800"
                    }`}
                    style={{ width: `${count > 0 ? pct : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
