import React from "react";
import { EvaluationResult } from "../types";
import { ShieldAlert, AlertTriangle, CheckCircle, Sliders, Users, FileText } from "lucide-react";

interface ClientRiskProps {
  evaluations: EvaluationResult[];
}

export const ClientRiskTab: React.FC<ClientRiskProps> = ({ evaluations }) => {
  // Extract clients who have active risk signals
  const riskClients = evaluations.filter(e => {
    const s = e.sinaisRiscoCliente;
    return s.duvidasRepetidas || s.falhasConsecutivas || s.errosEmissao || s.rejeicoesSefaz || s.problemasCertificados;
  });

  const criticalRiskCount = riskClients.filter(c => c.riscoClienteClassificacao === "Crítico").length;
  const highRiskCount = riskClients.filter(c => c.riscoClienteClassificacao === "Alto").length;
  const mediumRiskCount = riskClients.filter(c => c.riscoClienteClassificacao === "Médio").length;

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white font-sans tracking-tight">Índice de Risco do Cliente</h2>
          <p className="text-slate-400 text-xs mt-1">
            Mapeamento preditivo de clientes (contabilidades ou faturistas corporativos) com maior atratividade fiscal ou probabilidade latente de churn.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold text-xs py-1.5 px-3 rounded-lg shadow-sm">
          <ShieldAlert size={14} />
          <span>Monitoramento Operacional</span>
        </div>
      </div>

      {/* Overview stats of risk */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total sob Risco</span>
          <h3 className="text-2xl font-extrabold text-white">{riskClients.length}</h3>
          <p className="text-[10px] text-slate-400">com sinais detectados</p>
        </div>

        <div className="bg-rose-500/10 p-5 rounded-xl border border-rose-500/20 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Risco Crítico</span>
          <h3 className="text-2xl font-extrabold text-rose-400">{criticalRiskCount}</h3>
          <p className="text-[10px] text-rose-300">ação imediata CS</p>
        </div>

        <div className="bg-amber-500/10 p-5 rounded-xl border border-amber-500/20 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Risco Alto</span>
          <h3 className="text-2xl font-extrabold text-amber-400">{highRiskCount}</h3>
          <p className="text-[10px] text-amber-300">revisar auditoria</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Risco Médio / Baixo</span>
          <h3 className="text-2xl font-extrabold text-slate-400">{mediumRiskCount}</h3>
          <p className="text-[10px] text-slate-550 text-slate-500">sob monitoração periódica</p>
        </div>
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sign List Definitions */}
        <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-white tracking-tight flex items-center border-b border-slate-800 pb-2">
            <Sliders className="text-blue-400 mr-2" size={16} />
            Mapeadores de Gatilho de Risco (Sinais)
          </h3>

          <div className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-lg space-y-1 border border-slate-850">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Sinal 1</span>
              <h4 className="font-bold text-white text-xs">Muitas Dúvidas Repetidas</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                O cliente pesquisa o mesmo termo operatório em intervalos menores de 48 horas, sugerindo atrito linguístico grave ou falta de capacitação.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg space-y-1 border border-slate-850">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Sinal 2</span>
              <h4 className="font-bold text-white text-xs">Muitas Falhas Consecutivas</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Múltiplos retornos ou incidentes negativos de avaliação do bot no mesmo expediente.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg space-y-1 border border-slate-850">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Sinal 3</span>
              <h4 className="font-bold text-white text-xs">Rejeições SEFAZ Recorrentes</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Incidência crítica de rejeições cadastrais, fiscais ou certificado A1/A3 desconectado ou inativo.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Actives Clients Board */}
        <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-white tracking-tight flex items-center border-b border-slate-800 pb-2">
            <Users className="text-blue-400 mr-2" size={16} />
            Painel Geral de Clientes sob Monitoramento
          </h3>

          <div className="divide-y divide-slate-800/80 font-sans h-[350px] overflow-y-auto pr-1 text-slate-350">
            {riskClients.map((client) => {
              const s = client.sinaisRiscoCliente;
              
              return (
                <div key={client.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        client.riscoClienteClassificacao === "Crítico" ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' :
                        client.riscoClienteClassificacao === "Alto" ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'bg-slate-950 text-slate-500 border border-slate-850'
                      }`}>
                        {client.riscoClienteClassificacao}
                      </span>
                      <span className="font-bold text-xs text-slate-200 truncate block max-w-[170px]" title={client.clienteIdentificado}>
                        {client.clienteIdentificado || "Cliente Não Detalhado"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {s.duvidasRepetidas && <span className="text-[9px] bg-slate-950 text-slate-450 border border-slate-850 px-1 py-0.2 rounded font-mono">Dúvida Repetida</span>}
                      {s.falhasConsecutivas && <span className="text-[9px] bg-slate-950 text-slate-450 border border-slate-850 px-1 py-0.2 rounded font-mono">Falhas Consecutivas</span>}
                      {s.errosEmissao && <span className="text-[9px] bg-slate-950 text-slate-450 border border-slate-850 px-1 py-0.2 rounded font-mono">Erro Emissão</span>}
                      {s.rejeicoesSefaz && <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 py-0.2 rounded font-mono">Rejeição SEFAZ</span>}
                      {s.problemasCertificados && <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 py-0.2 rounded font-mono">Certificado</span>}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 block font-mono">Último Score:</span>
                    <span className={`font-mono text-xs font-bold leading-none ${client.scoreGeral < 70 ? 'text-rose-450' : 'text-slate-300'}`}>{client.scoreGeral}%</span>
                  </div>
                </div>
              );
            })}

            {riskClients.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-xs">
                Nenhum sinal crítico ou operacional detectado nos clientes sob faturamento.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
