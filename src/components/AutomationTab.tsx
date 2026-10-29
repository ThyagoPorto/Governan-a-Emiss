import React from "react";
import { EvaluationResult } from "../types";
import { Zap, HelpCircle, Activity, Lightbulb, Users, TrendingUp } from "lucide-react";

interface AutomationProps {
  evaluations: EvaluationResult[];
}

export const AutomationTab: React.FC<AutomationProps> = ({ evaluations }) => {
  const total = evaluations.length;

  // Resolved without human: resolveuDuvida === true AND encaminhadoSuporte === false
  const resolvedWithoutHuman = evaluations.filter(e => e.resolveuDuvida && !e.encaminhadoSuporte).length;
  const humanEscalated = evaluations.filter(e => e.encaminhadoSuporte).length;
  const unresolved = evaluations.filter(e => !e.resolveuDuvida && !e.encaminhadoSuporte).length;

  // Real automation rate
  const automationRate = total > 0 ? Math.round((resolvedWithoutHuman / total) * 100) : 0;

  // Classifications
  let classification = "Atenção (Necessita de ajustes)";
  let badgeColor = "bg-rose-500/10 text-rose-400 border border-rose-500/25";
  let explanation = "Abaixo de 70%. Alto índice de encaminhamento ao suporte técnico físico ou lacunas críticas na base de conhecimento da Emis.";

  if (automationRate >= 90) {
    classification = "Excelente (Escala plena)";
    badgeColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
    explanation = "Acima de 90%. Alta precisão nas diretrizes, resolução na primeira mensagem e baixíssima dependência do e-mail de suporte.";
  } else if (automationRate >= 80) {
    classification = "Muito Bom (Alta performance)";
    badgeColor = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25";
    explanation = "Entre 80% e 89%. Ótima condução de ambiguidades e soluções fiscais imediatas com poucos escalonamentos recorrentes.";
  } else if (automationRate >= 70) {
    classification = "Bom (Operação segura)";
    badgeColor = "bg-blue-500/10 text-blue-400 border border-blue-500/25";
    explanation = "Entre 70% e 79%. Nível estável de automação, mas ainda com margem para redução de dependência no suporte de N1 em casos complexos.";
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white font-sans tracking-tight">Índice de Automação Real (IAR)</h2>
          <p className="text-slate-400 text-xs mt-1">
            Fórmula matemática auditável com base em resoluções confirmadas e contenção definitiva sem intervenção de agentes de suporte humano.
          </p>
        </div>
        <span className={`px-2.5 py-1.5 rounded-lg border font-bold text-xs ${badgeColor}`}>
          Calibração: {automationRate}%
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Math & Gauges */}
        <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-6">
          
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white tracking-tight flex items-center">
              <Zap className="text-blue-400 mr-2" size={16} />
              Cálculo e Algoritmo do IAR
            </h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
              <p className="font-bold text-slate-200 text-center text-sm mb-2">Fórmula Oficial:</p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center font-bold text-blue-400">
                IAR = (Interações Resolvidas Sem Suporte ÷ Total de Interações) × 100
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                *Considera apenas interações conclusivas que dispensaram envio de e-mail ao suporte técnico corporativo (suporten1@sieg.com).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Mapeamento Dinâmico de Tráfego</h4>
            
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-350">Resolvidas Sem Humano (Contidas na Emis)</span>
                  <span className="font-bold text-white font-mono">{resolvedWithoutHuman} interações ({automationRate}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${automationRate}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-350">Escalonadas para Suporte Técnico Físico</span>
                  <span className="font-bold text-slate-200 font-mono">{humanEscalated} interações ({total > 0 ? Math.round((humanEscalated/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-slate-600 h-full rounded-full" style={{ width: `${total > 0 ? (humanEscalated/total)*100 : 0}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-350">Abandonadas ou Fora de Escopo Não Resolvido</span>
                  <span className="font-bold text-slate-200 font-mono">{unresolved} interações ({total > 0 ? Math.round((unresolved/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${total > 0 ? (unresolved/total)*100 : 0}%` }}></div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Classification Rules & Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm tracking-tight flex items-center">
              <Activity className="text-emerald-400 mr-2" size={16} />
              Classificação do Status de Automação
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start space-x-2.5">
                <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${automationRate >= 90 ? 'bg-emerald-400' : 'bg-slate-700'}`}></span>
                <div>
                  <p className="font-bold">Excelente (&gt;= 90%)</p>
                  <p className="text-[10px] text-slate-400">Escalamiento e falhas fiscais próximas a zero.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${automationRate >= 80 && automationRate < 90 ? 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`}></span>
                <div>
                  <p className="font-bold">Muito Bom (80% a 89%)</p>
                  <p className="text-[10px] text-slate-400">Atendimento fluido com poucas intercorrências táticas.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${automationRate >= 70 && automationRate < 80 ? 'bg-blue-400/85' : 'bg-slate-700'}`}></span>
                <div>
                  <p className="font-bold">Bom (70% a 79%)</p>
                  <p className="text-[10px] text-slate-400">Estabilidade saudável, mas com margem operacional.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${automationRate < 70 ? 'bg-rose-500 animate-pulse' : 'bg-slate-700'}`}></span>
                <div>
                  <p className="font-bold">Atenção (&lt; 70%)</p>
                  <p className="text-[10px] text-slate-400">Excesso de faturas enviadas para suporten1@sieg.com.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Suggestion */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider flex items-center">
              <Lightbulb size={14} className="text-amber-400 mr-1.5" />
              Diretrizes de Alavancagem
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Para escalar o IAR para a faixa <strong className="text-white">Excelente</strong>, recomenda-se a aplicação do pacote de engenharia de prompt para <strong className="text-white">Carta de Correção</strong>. Ao munir a Emis com respostas taxativas sobre vedações tributárias antes do usuário errar na SEFAZ, reduz-se em até 35% as faturas direcionadas para canais manuais do suporte corporativo.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
