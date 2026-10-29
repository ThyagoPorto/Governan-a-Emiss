import React from "react";
import { EvaluationResult } from "../types";
import { 
  Award, 
  CheckSquare, 
  Flame, 
  FileCheck, 
  RefreshCw, 
  ShieldCheck, 
  EyeOff,
  Percent,
  TrendingUp,
  Sliders,
  Sparkles,
  AlertTriangle
} from "lucide-react";

interface AIQualityProps {
  evaluations: EvaluationResult[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const AIQualityTab: React.FC<AIQualityProps> = ({ 
  evaluations,
  selectedMonth,
  onMonthChange
}) => {
  const total = evaluations.length;

  // Average Score
  const avgScore = total > 0 
    ? Math.round(evaluations.reduce((acc, curr) => acc + curr.scoreGeral, 0) / total)
    : 0;

  // Accuracy Rate (Taxa de Acerto) -> evaluations with score >= 85 or respostaCorreta === true
  const correctCount = evaluations.filter(e => e.respostaCorreta).length;
  const accuracyRate = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Hallucination Rate (Taxa de Alucinação)
  const hallucinationCount = evaluations.filter(e => e.houveAlucinacao).length;
  const hallucinationRate = total > 0 ? Math.round((hallucinationCount / total) * 100) : 0;

  // Resolution Rate (Taxa de Resolução)
  const resolutionCount = evaluations.filter(e => e.resolveuDuvida).length;
  const resolutionRate = total > 0 ? Math.round((resolutionCount / total) * 100) : 0;

  // Escalation Rate (Taxa de Escalonamento) -> forwarded to support
  const escalationCount = evaluations.filter(e => e.encaminhadoSuporte).length;
  const escalationRate = total > 0 ? Math.round((escalationCount / total) * 100) : 0;

  // Scope Error Rate (Taxa de Erro de Escopo)
  const scopeErrorCount = evaluations.filter(e => e.categoriaErro === "Escopo" || (e.foraDoEscopo && !e.respostaCorreta)).length;
  const scopeErrorRate = total > 0 ? Math.round((scopeErrorCount / total) * 100) : 0;

  // Security Error Rate (Taxa de Erro de Segurança)
  const securityErrorCount = evaluations.filter(e => e.riscoSeguranca || e.categoriaErro === "Segurança").length;
  const securityErrorRate = total > 0 ? Math.round((securityErrorCount / total) * 100) : 0;

  // Generic Response Rate (Taxa de Resposta Genérica) -> approximated from evaluations with communications or diagnostic errors & score < 85
  const genericResponseCount = evaluations.filter(e => e.scoreGeral >= 70 && e.scoreGeral < 85).length;
  const genericResponseRate = total > 0 ? Math.round((genericResponseCount / total) * 100) : 0;

  // Incomplete Response Rate (Taxa de Resposta Incompleta) -> approximated from non resolved doubts
  const incompleteCount = evaluations.filter(e => !e.resolveuDuvida && e.categoriaErro === "Conhecimento").length;
  const incompleteRate = total > 0 ? Math.round((incompleteCount / total) * 100) : 0;

  // Classifications limits
  let classColor = "text-sky-400 bg-sky-500/10 border-sky-500/20";
  let descriptionClass = "Auditável em conformidade";

  if (avgScore >= 95) {
    classColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    descriptionClass = "EXCELENTE: Alta aderência ao Prompt Oficial e sem riscos fiscais.";
  } else if (avgScore >= 85) {
    classColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    descriptionClass = "MUITO BOM: Pequenos ajustes de escrita ou markdown necessários.";
  } else if (avgScore >= 70) {
    classColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
    descriptionClass = "ACEITÁVEL: Atenção a desvios secundários nos cadastros.";
  } else if (avgScore >= 50) {
    classColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
    descriptionClass = "CRÍTICO: Risco de alucinação de botões ou erro fiscal grave.";
  } else {
    classColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
    descriptionClass = "FALHA GRAVE: Alto desvio operacional ou vazamento de dados críticos.";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-sans tracking-tight">Centro de Qualidade de IA</h2>
          <p className="text-slate-400 text-xs mt-1">
            Auditoria detalhada de KPIs de performance linguística, fiscal e aderência de regras estabelecidas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Filter */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Mês:</span>
            <select
              id="ai-quality-month-filter"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold outline-none cursor-pointer pr-2 focus:ring-1 focus:ring-blue-500"
            >
              <option value="Todos" className="bg-slate-900 text-slate-200">Todos os Meses</option>
              <option value="2026-06" className="bg-slate-900 text-slate-200">Junho 2026</option>
              <option value="2026-07" className="bg-slate-900 text-slate-200">Julho 2026</option>
              <option value="2026-08" className="bg-slate-900 text-slate-200">Agosto 2026</option>
              <option value="2026-09" className="bg-slate-900 text-slate-200">Setembro 2026</option>
              <option value="2026-10" className="bg-slate-900 text-slate-200">Outubro 2026</option>
              <option value="2026-11" className="bg-slate-900 text-slate-200">Novembro 2026</option>
              <option value="2026-12" className="bg-slate-900 text-slate-200">Dezembro 2026</option>
            </select>
          </div>
          <div className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border ${classColor}`}>
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Métrica: {descriptionClass}</span>
          </div>
        </div>
      </div>

      {total === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 px-5 py-4 rounded-xl text-xs flex items-center space-x-3">
          <AlertTriangle className="text-amber-400 shrink-0" size={18} />
          <div>
            <span className="font-bold uppercase tracking-wider block">Nenhuma avaliação encontrada para o período selecionado</span>
            <span className="mt-1 block text-slate-300">Vá até o menu <strong>Governança</strong> para analisar novas conversas e iniciar o levantamento de dados deste mês!</span>
          </div>
        </div>
      )}

      {/* Main Quality Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* KPI 1: Score Médio */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Score</span>
              <h3 className="text-sm font-bold text-slate-350">Score Médio Geral</h3>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Award size={18} />
            </div>
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{avgScore}%</span>
            <span className="text-xs text-slate-500">meta: &gt; 90%</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${avgScore}%` }}></div>
          </div>
        </div>

        {/* KPI 2: Taxa de Acerto */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Precisão</span>
              <h3 className="text-sm font-bold text-slate-350">Taxa de Acerto</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckSquare size={18} />
            </div>
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{accuracyRate}%</span>
            <span className="text-xs text-slate-500">meta: &gt; 85%</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${accuracyRate}%` }}></div>
          </div>
        </div>

        {/* KPI 3: Taxa de Alucinação */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">Alucinações</span>
              <h3 className="text-sm font-bold text-slate-350">Taxa de Alucinação</h3>
            </div>
            <div className={`p-2 rounded-lg ${hallucinationRate > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-500'}`}>
              <Flame size={18} />
            </div>
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{hallucinationRate}%</span>
            <span className="text-xs text-slate-500">meta: 0%</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${hallucinationRate}%` }}></div>
          </div>
        </div>

        {/* KPI 4: Taxa de Resolução */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Eficácia</span>
              <h3 className="text-sm font-bold text-slate-350">Taxa de Resolução</h3>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <FileCheck size={18} />
            </div>
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{resolutionRate}%</span>
            <span className="text-xs text-slate-500">sem reaberturas</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${resolutionRate}%` }}></div>
          </div>
        </div>

        {/* KPI 5: Taxa de Escalonamento */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Suporte</span>
              <h3 className="text-sm font-bold text-slate-350">Taxa de Escalonamento</h3>
            </div>
            <div className="p-2 bg-slate-850 text-slate-400 rounded-lg">
              <RefreshCw size={18} />
            </div>
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{escalationRate}%</span>
            <span className="text-xs text-slate-500">direcionado para N1</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-slate-600 h-full rounded-full" style={{ width: `${escalationRate}%` }}></div>
          </div>
        </div>

        {/* KPI 6: Taxa de Erro de Escopo */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Limites</span>
              <h3 className="text-sm font-bold text-slate-350">Taxa de Erro de Escopo</h3>
            </div>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Sliders size={18} />
            </div>
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{scopeErrorRate}%</span>
            <span className="text-xs text-slate-500">vazamento de assunto</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${scopeErrorRate}%` }}></div>
          </div>
        </div>

        {/* KPI 7: Taxa de Erro de Segurança */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">Segurança</span>
              <h3 className="text-sm font-bold text-slate-350">Taxa de Erro de Segurança</h3>
            </div>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{securityErrorRate}%</span>
            <span className="text-xs text-slate-500">dados confidenciais</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${securityErrorRate}%` }}></div>
          </div>
        </div>

        {/* KPI 8: Taxa de Resposta Genérica */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Redundância</span>
              <h3 className="text-sm font-bold text-slate-350">Taxa de Resposta Genérica</h3>
            </div>
            <div className="p-2 bg-slate-800 text-slate-400 rounded-lg">
              <EyeOff size={18} />
            </div>
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{genericResponseRate}%</span>
            <span className="text-xs text-slate-500">atendimento evasivo</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-slate-700 h-full rounded-full" style={{ width: `${genericResponseRate}%` }}></div>
          </div>
        </div>

        {/* KPI 9: Taxa de Resposta Incompleta */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Lacunas</span>
              <h3 className="text-sm font-bold text-slate-350">Taxa de Resposta Incompleta</h3>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Percent size={18} />
            </div>
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{incompleteRate}%</span>
            <span className="text-xs text-slate-500">lacuna na base</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${incompleteRate}%` }}></div>
          </div>
        </div>

      </div>

      {/* Analysis and Recommendations */}
      <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-sm border border-slate-800">
        <h3 className="font-bold text-base text-white flex items-center">
          <Award className="text-blue-400 mr-2" size={20} />
          Reflexão do Centro de Qualidade de IA
        </h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Os relatórios mostram que a Emis apresenta <strong className="text-white">excelente aderência</strong> no atendimento a <strong className="text-white">Tributação</strong> e <strong className="text-white">Participante do Exterior</strong>. No entanto, quando surgem termos sobre <strong className="text-white">Carta de Correção (CC-e)</strong> ou <strong className="text-white">Menus Inexistentes</strong>, há vazamento de escopo por alucinações involuntárias (temperatura de amostragem alta ou lacunas). Recomenda-se adensar as regras impeditivas do Segmento 3 na base reguladora.
        </p>
      </div>
    </div>
  );
};
