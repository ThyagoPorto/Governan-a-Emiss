import React from "react";
import { EvaluationResult } from "../types";
import { 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  Percent, 
  TrendingUp, 
  FileText, 
  ChevronRight,
  ShieldAlert,
  Sliders,
  ChevronDown,
  UserCheck
} from "lucide-react";

interface OverviewProps {
  evaluations: EvaluationResult[];
  onSelectInteraction: (id: string) => void;
  onNavigateToTab: (index: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const OverviewTab: React.FC<OverviewProps> = ({ 
  evaluations, 
  onSelectInteraction,
  onNavigateToTab,
  selectedMonth,
  onMonthChange
}) => {
  // Calculations
  const total = evaluations.length;
  const avgScore = total > 0 
    ? Math.round(evaluations.reduce((acc, curr) => acc + curr.scoreGeral, 0) / total)
    : 0;
    
  const hallucinations = evaluations.filter(e => e.houveAlucinacao).length;
  const hallucinationRate = total > 0 ? Math.round((hallucinations / total) * 100) : 0;
  
  // Real Automation Index: (Resolved without human / Total) * 100
  // Resolved without human is evaluated as: resolveuDuvida === true && encaminhadoSuporte === false
  const autoResolved = evaluations.filter(e => e.resolveuDuvida && !e.encaminhadoSuporte).length;
  const automationIndex = total > 0 ? Math.round((autoResolved / total) * 100) : 0;
  
  const criticalCases = evaluations.filter(e => e.scoreGeral < 70).length;
  const outOfScope = evaluations.filter(e => e.foraDoEscopo).length;
  const securityWarnings = evaluations.filter(e => e.riscoSeguranca).length;

  // Topic classification distribution
  const topicsMap: { [key: string]: number } = {};
  evaluations.forEach(e => {
    topicsMap[e.tema] = (topicsMap[e.tema] || 0) + 1;
  });
  
  const sortedTopics = Object.entries(topicsMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, percent: total > 0 ? Math.round((count / total) * 100) : 0 }));

  // Average score classification
  let autoClassification = "Atenção";
  if (automationIndex >= 90) autoClassification = "Excelente (Acima de 90%)";
  else if (automationIndex >= 80) autoClassification = "Muito Bom (80% a 89%)";
  else if (automationIndex >= 70) autoClassification = "Bom (70% a 79%)";
  else autoClassification = "Atenção (Abaixo de 70%)";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#0B0F19] rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="max-w-3xl">
          <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
            SIEG DIGITAL ASSISTANT GOVERNANCE
          </span>
          <h2 className="text-2xl font-bold mt-3 font-sans tracking-tight text-white">Control Tower</h2>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Painel consolidado de auditoria contínua, governança e conformidade operacional para a Emis (Assistente do Emissor SIEG). Use esta central para monitorar desvios de prompt, alucinações técnicas e riscos fiscais em tempo real.
          </p>
        </div>
        {/* Month Filter */}
        <div className="shrink-0 self-start md:self-center">
          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Mês de Referência:</span>
            <select
              id="overview-month-filter"
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
        </div>
      </div>

      {/* Primary KPI Grid */}
      {total === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 px-5 py-4 rounded-xl text-xs flex items-center space-x-3">
          <AlertTriangle className="text-amber-400 shrink-0" size={18} />
          <div>
            <span className="font-bold uppercase tracking-wider block">Nenhuma avaliação encontrada para o período selecionado</span>
            <span className="mt-1 block text-slate-300">Vá até o menu <strong>Governança</strong> para analisar novas conversas e iniciar o levantamento de dados deste mês!</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigateToTab("Governança")}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-sm transition-all duration-250 cursor-pointer hover:bg-slate-900/90"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interações Avaliadas</p>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-sans">{total}</h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span className="text-emerald-400 font-semibold flex items-center mr-1">
              +100%
            </span>
            <span>auditoria ativa</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigateToTab("Qualidade da IA")}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-sm transition-all duration-250 cursor-pointer hover:bg-slate-900/90"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score de Qualidade Médio</p>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-sans">{avgScore}%</h3>
            </div>
            <div className={`p-2.5 rounded-xl ${avgScore >= 85 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span className={`font-semibold mr-1.5 px-1.5 py-0.5 rounded text-[10px] ${
              avgScore >= 95 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
              avgScore >= 85 ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
              avgScore >= 70 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
            }`}>
              {avgScore >= 95 ? 'Excelente' : avgScore >= 85 ? 'Muito Bom' : avgScore >= 70 ? 'Aceitável' : 'Crítico'}
            </span>
            <span>com base no prompt</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm transition-all duration-250"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Automação Real</p>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-sans">{automationIndex}%</h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <Percent size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span className="font-semibold text-slate-400 mr-2">{autoClassification}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigateToTab("Qualidade da IA")}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-sm transition-all duration-250 cursor-pointer hover:bg-slate-900/90"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Taxa de Alucinação</p>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-sans">{hallucinationRate}%</h3>
            </div>
            <div className={`p-2.5 rounded-xl ${hallucinations > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-500'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span className="font-semibold text-slate-400 mr-1">{hallucinations} casos</span>
            <span>alucinações graves</span>
          </div>
        </div>
      </div>

      {/* Critical Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guard Risk card 1 */}
        <div 
          onClick={() => onNavigateToTab("Qualidade da IA")}
          className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/20 flex items-center space-x-3 cursor-pointer hover:bg-rose-500/10 transition-colors"
        >
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
            <ShieldAlert size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Falha Grave / Desvios Críticos</p>
            <p className="text-lg font-bold text-rose-200 mt-0.5">{criticalCases} interações</p>
          </div>
        </div>

        {/* Guard Risk card 2 */}
        <div 
          onClick={() => onNavigateToTab("Governança")}
          className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 flex items-center space-x-3 cursor-pointer hover:bg-amber-500/10 transition-colors"
        >
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Sliders size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Erros de Escopo Aberto</p>
            <p className="text-lg font-bold text-amber-200 mt-0.5">{outOfScope} interações</p>
          </div>
        </div>

        {/* Guard Risk card 3 */}
        <div 
          onClick={() => onNavigateToTab("Governança")}
          className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20 flex items-center space-x-3 cursor-pointer hover:bg-blue-500/10 transition-colors"
        >
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <UserCheck size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Risco de Segurança Exposto</p>
            <p className="text-lg font-bold text-blue-200 mt-0.5">{securityWarnings} alertas de segurança</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Topics Distribution Section */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Distribuição de Temas Mais Acessados</h3>
          <span className="text-slate-500 text-xs font-medium font-mono">Módulos do Emissor</span>
        </div>

        <div className="space-y-4 h-[300px] overflow-y-auto pr-1">
          {sortedTopics.length > 0 ? (
            sortedTopics.map((topic, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-350">{topic.name}</span>
                  <span className="text-slate-500 font-medium font-mono">
                    {topic.count} {topic.count === 1 ? 'chamado' : 'chamados'} ({topic.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                    style={{ width: `${topic.percent}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">Nenhum tema mapeado ainda.</div>
          )}
        </div>
      </div>

      {/* Recent Evaluations Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Histórico de Auditorias Recentes</h3>
            <p className="text-slate-500 text-xs">Exibindo o log de auditorias individuais e conformidade</p>
          </div>
          <button 
            onClick={() => onNavigateToTab("Governança")}
            className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center"
          >
            Acessar Centro de Auditoria <ChevronRight size={14} className="ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/65 border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <th className="py-3.5 px-6">Registro</th>
                <th className="py-3.5 px-6">Tema</th>
                <th className="py-3.5 px-6">Cliente</th>
                <th className="py-3.5 px-6 text-center">Score Geral</th>
                <th className="py-3.5 px-6">Alucinação</th>
                <th className="py-3.5 px-6">Resolução</th>
                <th className="py-3.5 px-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {evaluations.slice(0, 5).map((e) => (
                <tr key={e.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-bold text-slate-300 font-mono text-[10px]">{e.id}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        {new Date(e.timestamp).toLocaleDateString("pt-BR")} às {new Date(e.timestamp).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-blue-400 font-mono">
                    {e.tema}
                  </td>
                  <td className="py-4 px-6 text-slate-350 truncate max-w-[200px]" title={e.clienteIdentificado}>
                    {e.clienteIdentificado || "Não identificado"}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block font-sans font-extrabold px-2.5 py-1 rounded-full text-xs ${
                      e.scoreGeral >= 95 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      e.scoreGeral >= 85 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      e.scoreGeral >= 70 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {e.scoreGeral}%
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                      e.houveAlucinacao 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {e.houveAlucinacao ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                      e.resolveuDuvida 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-slate-800 text-slate-400 border-slate-700/60'
                    }`}>
                      {e.resolveuDuvida ? 'Resolvido' : 'Não Resolvido'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => onSelectInteraction(e.id)}
                      className="text-xs bg-blue-600 text-white font-bold px-3 py-1.5 rounded-md hover:bg-blue-700 cursor-pointer focus:outline-none transition-colors"
                    >
                      Inspecionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
