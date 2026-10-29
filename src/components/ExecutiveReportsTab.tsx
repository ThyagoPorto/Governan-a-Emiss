import React, { useState, useMemo } from "react";
import { EvaluationResult } from "../types";
import { 
  FileText, 
  Layers, 
  AlertTriangle, 
  Download, 
  CheckCircle2, 
  ShieldAlert, 
  Award, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRightLeft,
  Filter,
  BarChart3,
  HelpCircle,
  Clock,
  UserCheck,
  XCircle,
  MessageSquareQuote,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";

interface ExecutiveReportsProps {
  evaluations: EvaluationResult[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const ExecutiveReportsTab: React.FC<ExecutiveReportsProps> = ({ 
  evaluations,
  selectedMonth,
  onMonthChange
}) => {
  // Modes: 'single' (Visão Mensal Única) or 'comparative' (Comparativo entre Meses)
  const [reportMode, setReportMode] = useState<"single" | "comparative">("single");
  const [compareMonthA, setCompareMonthA] = useState<string>(selectedMonth !== "Todos" ? selectedMonth : "2026-08");
  const [compareMonthB, setCompareMonthB] = useState<string>("2026-07");

  const getMonthLabel = (m: string) => {
    if (m === "Todos") return "Todos os Meses (Consolidado)";
    if (m === "2026-06") return "Junho 2026";
    if (m === "2026-07") return "Julho 2026";
    if (m === "2026-08") return "Agosto 2026";
    if (m === "2026-09") return "Setembro 2026";
    if (m === "2026-10") return "Outubro 2026";
    if (m === "2026-11") return "Novembro 2026";
    if (m === "2026-12") return "Dezembro 2026";
    return m;
  };

  // Helper to filter evaluations by a given month key
  const filterByMonth = (list: EvaluationResult[], monthKey: string) => {
    if (monthKey === "Todos") return list;
    return list.filter(e => e.timestamp.startsWith(monthKey));
  };

  // Current dataset based on mode
  const currentSingleEvaluations = useMemo(() => {
    return filterByMonth(evaluations, selectedMonth);
  }, [evaluations, selectedMonth]);

  const evalsA = useMemo(() => {
    return filterByMonth(evaluations, compareMonthA);
  }, [evaluations, compareMonthA]);

  const evalsB = useMemo(() => {
    return filterByMonth(evaluations, compareMonthB);
  }, [evaluations, compareMonthB]);

  // Aggregate stats helper for any evaluation dataset
  const calculateDatasetStats = (data: EvaluationResult[]) => {
    const total = data.length;
    const avgScore = total > 0 ? Math.round(data.reduce((acc, e) => acc + e.scoreGeral, 0) / total) : 0;
    
    const hallucinations = data.filter(e => e.houveAlucinacao);
    const hallucinationCount = hallucinations.length;
    const hallucinationRate = total > 0 ? ((hallucinationCount / total) * 100).toFixed(1) : "0.0";
    
    const securityWarnings = data.filter(e => e.riscoSeguranca);
    const securityCount = securityWarnings.length;
    const securityRate = total > 0 ? ((securityCount / total) * 100).toFixed(1) : "0.0";
    
    const outOfScope = data.filter(e => e.foraDoEscopo);
    const outOfScopeCount = outOfScope.length;

    const resolved = data.filter(e => e.resolveuDuvida);
    const resolvedCount = resolved.length;
    const unresolvedCount = total - resolvedCount;
    const resolvedRate = total > 0 ? ((resolvedCount / total) * 100).toFixed(1) : "0.0";

    const forwarded = data.filter(e => e.encaminhadoSuporte);
    const forwardedCount = forwarded.length;
    const forwardedRate = total > 0 ? ((forwardedCount / total) * 100).toFixed(1) : "0.0";

    const highRiskClients = data.filter(e => e.riscoClienteClassificacao === 'Alto' || e.riscoClienteClassificacao === 'Crítico');

    // Group by themes
    const themeCountsMap: { [key: string]: { count: number; resolved: number; unresolved: number; hallucinations: number; totalScore: number; avgScore: number } } = {};
    data.forEach(e => {
      const t = e.tema || "Outros";
      if (!themeCountsMap[t]) {
        themeCountsMap[t] = { count: 0, resolved: 0, unresolved: 0, hallucinations: 0, totalScore: 0, avgScore: 0 };
      }
      themeCountsMap[t].count += 1;
      themeCountsMap[t].totalScore += e.scoreGeral;
      if (e.resolveuDuvida) themeCountsMap[t].resolved += 1;
      else themeCountsMap[t].unresolved += 1;
      if (e.houveAlucinacao) themeCountsMap[t].hallucinations += 1;
    });

    const themeMetrics = Object.entries(themeCountsMap).map(([theme, info]) => ({
      theme,
      count: info.count,
      resolved: info.resolved,
      unresolved: info.unresolved,
      hallucinations: info.hallucinations,
      avgScore: Math.round(info.totalScore / info.count),
      percentage: total > 0 ? ((info.count / total) * 100).toFixed(1) : "0.0"
    })).sort((a, b) => b.count - a.count);

    // Find Best Audit (Score 100) and Worst/Critical Audit
    const bestAudit = [...data].sort((a, b) => b.scoreGeral - a.scoreGeral)[0] || null;
    const worstAudit = [...data].sort((a, b) => a.scoreGeral - b.scoreGeral)[0] || null;

    return {
      total,
      avgScore,
      hallucinationCount,
      hallucinationRate,
      securityCount,
      securityRate,
      outOfScopeCount,
      resolvedCount,
      unresolvedCount,
      resolvedRate,
      forwardedCount,
      forwardedRate,
      highRiskClientsCount: highRiskClients.length,
      themeMetrics,
      bestAudit,
      worstAudit
    };
  };

  const singleStats = useMemo(() => calculateDatasetStats(currentSingleEvaluations), [currentSingleEvaluations]);
  const statsA = useMemo(() => calculateDatasetStats(evalsA), [evalsA]);
  const statsB = useMemo(() => calculateDatasetStats(evalsB), [evalsB]);

  // Delta calculation helper
  const getDelta = (valA: number, valB: number, isPercentage = false, inverseGood = false) => {
    const diff = valA - valB;
    const isZero = diff === 0;
    const isPositive = diff > 0;
    const isGood = inverseGood ? diff < 0 : diff > 0;
    
    return {
      diff,
      formatted: isPercentage 
        ? `${isPositive ? '+' : ''}${diff.toFixed(1)}%` 
        : `${isPositive ? '+' : ''}${diff}`,
      isGood,
      isZero,
      isPositive
    };
  };

  // PDF Export Generator
  const handleDownloadPDF = () => {
    const isComp = reportMode === "comparative";
    const titlePeriod = isComp 
      ? `Comparativo Executivo: ${getMonthLabel(compareMonthA)} vs ${getMonthLabel(compareMonthB)}`
      : `Relatório Executivo Mensal: ${getMonthLabel(selectedMonth)}`;

    const generatedDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const activeStats = isComp ? statsA : singleStats;
    const exemplarAudit = activeStats.bestAudit;
    const criticalAudit = activeStats.worstAudit;

    const printContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>SIEG AI Governance - ${titlePeriod}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #0f172a;
            background: #ffffff;
            padding: 28px 32px;
            font-size: 10.5pt;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .logo-badge {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-box {
            background: #FF1155;
            color: white;
            font-weight: 800;
            font-size: 15px;
            padding: 6px 12px;
            border-radius: 8px;
            letter-spacing: -0.5px;
          }
          .header-title h1 {
            font-size: 18px;
            font-weight: 800;
            color: #020617;
          }
          .header-title p {
            font-size: 10px;
            color: #64748b;
            margin-top: 2px;
          }
          .meta-badge {
            text-align: right;
            font-size: 10px;
            color: #475569;
          }
          .meta-badge strong {
            display: block;
            font-size: 12px;
            color: #020617;
          }

          /* KPI Grid */
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(${isComp ? 6 : 5}, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .kpi-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 12px;
          }
          .kpi-label {
            font-size: 9px;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
            letter-spacing: 0.5px;
          }
          .kpi-val {
            font-size: 17px;
            font-weight: 800;
            color: #020617;
            margin-top: 3px;
            display: flex;
            align-items: baseline;
            gap: 4px;
          }
          .kpi-delta {
            font-size: 9px;
            font-weight: 700;
            padding: 2px 4px;
            border-radius: 4px;
          }
          .kpi-delta.good { background: #dcfce7; color: #15803d; }
          .kpi-delta.bad { background: #fee2e2; color: #b91c1c; }
          .kpi-delta.neutral { background: #f1f5f9; color: #475569; }

          /* Report Narrative Block */
          .narrative-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 14px 18px;
            margin-bottom: 20px;
          }
          .narrative-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #1e293b;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .narrative-text {
            font-size: 10pt;
            color: #334155;
            line-height: 1.6;
          }
          .narrative-text strong {
            color: #0f172a;
          }

          /* Highlights Case Studies */
          .cases-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .case-card {
            border-radius: 8px;
            padding: 12px 14px;
            border: 1px solid;
          }
          .case-card.success {
            background: #f0fdf4;
            border-color: #bbf7d0;
          }
          .case-card.danger {
            background: #fff1f2;
            border-color: #fecdd3;
          }
          .case-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 6px;
          }
          .case-header.success { color: #15803d; }
          .case-header.danger { color: #be123c; }
          .case-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 9px;
          }
          .case-badge.success { background: #dcfce7; color: #166534; }
          .case-badge.danger { background: #ffe4e6; color: #9f1239; }
          .dialog-quote {
            background: rgba(255, 255, 255, 0.7);
            border-left: 3px solid;
            padding: 6px 10px;
            border-radius: 0 4px 4px 0;
            font-size: 9.5pt;
            margin: 6px 0;
            color: #1e293b;
          }
          .dialog-quote.success { border-color: #22c55e; }
          .dialog-quote.danger { border-color: #f43f5e; }

          /* Table */
          .table-box {
            margin-top: 16px;
            page-break-inside: avoid;
          }
          .table-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #0f172a;
            margin-bottom: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
          }
          th, td {
            border: 1px solid #e2e8f0;
            padding: 6px 10px;
            text-align: left;
          }
          th {
            background: #f1f5f9;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            font-size: 8.5pt;
          }

          .footer {
            margin-top: 24px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 8.5pt;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }

          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        
        <div class="header">
          <div class="logo-badge">
            <div class="logo-box">SIEG</div>
            <div class="header-title">
              <h1>SIEG AI Governance - Relatório Executivo</h1>
              <p>${isComp ? 'Diagnóstico Comparativo de Desempenho e Qualidade de IA' : 'Diagnóstico Mensal de Auditoria Operacional e IA'}</p>
            </div>
          </div>
          <div class="meta-badge">
            Período: <strong>${titlePeriod}</strong>
            Emissão: ${generatedDate}
          </div>
        </div>

        ${isComp ? `
          <!-- Comparative KPIs -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Volume Total</div>
              <div class="kpi-val">
                ${statsA.total} <span style="font-size:10px; color:#64748b">vs ${statsB.total}</span>
              </div>
              <span class="kpi-delta ${statsA.total >= statsB.total ? 'good' : 'neutral'}">
                ${statsA.total - statsB.total >= 0 ? '+' : ''}${statsA.total - statsB.total} chamados
              </span>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Score Médio</div>
              <div class="kpi-val">
                ${statsA.avgScore} <span style="font-size:10px; color:#64748b">vs ${statsB.avgScore}</span>
              </div>
              <span class="kpi-delta ${statsA.avgScore >= statsB.avgScore ? 'good' : 'bad'}">
                ${statsA.avgScore - statsB.avgScore >= 0 ? '+' : ''}${statsA.avgScore - statsB.avgScore} pts
              </span>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Taxa Resolução</div>
              <div class="kpi-val">
                ${statsA.resolvedRate}% <span style="font-size:10px; color:#64748b">vs ${statsB.resolvedRate}%</span>
              </div>
              <span class="kpi-delta ${Number(statsA.resolvedRate) >= Number(statsB.resolvedRate) ? 'good' : 'bad'}">
                ${(Number(statsA.resolvedRate) - Number(statsB.resolvedRate)).toFixed(1)}%
              </span>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Alucinações</div>
              <div class="kpi-val">
                ${statsA.hallucinationCount} <span style="font-size:10px; color:#64748b">vs ${statsB.hallucinationCount}</span>
              </div>
              <span class="kpi-delta ${statsA.hallucinationCount <= statsB.hallucinationCount ? 'good' : 'bad'}">
                ${statsA.hallucinationCount - statsB.hallucinationCount <= 0 ? '' : '+'}${statsA.hallucinationCount - statsB.hallucinationCount} casos
              </span>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Segurança</div>
              <div class="kpi-val">
                ${statsA.securityCount} <span style="font-size:10px; color:#64748b">vs ${statsB.securityCount}</span>
              </div>
              <span class="kpi-delta ${statsA.securityCount <= statsB.securityCount ? 'good' : 'bad'}">
                ${statsA.securityCount - statsB.securityCount <= 0 ? '' : '+'}${statsA.securityCount - statsB.securityCount} alertas
              </span>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Clientes em Risco</div>
              <div class="kpi-val">
                ${statsA.highRiskClientsCount} <span style="font-size:10px; color:#64748b">vs ${statsB.highRiskClientsCount}</span>
              </div>
              <span class="kpi-delta ${statsA.highRiskClientsCount <= statsB.highRiskClientsCount ? 'good' : 'bad'}">
                ${statsA.highRiskClientsCount - statsB.highRiskClientsCount <= 0 ? '' : '+'}${statsA.highRiskClientsCount - statsB.highRiskClientsCount} clientes
              </span>
            </div>
          </div>

          <!-- Comparative Narrative Analysis -->
          <div class="narrative-box">
            <div class="narrative-title">Síntese do Diagnóstico Comparativo (${getMonthLabel(compareMonthA)} vs ${getMonthLabel(compareMonthB)})</div>
            <p class="narrative-text">
              No comparativo entre <strong>${getMonthLabel(compareMonthA)}</strong> e <strong>${getMonthLabel(compareMonthB)}</strong>, 
              o volume auditado registrou <strong>${statsA.total} interações</strong> contra <strong>${statsB.total} interações</strong> no período anterior. 
              O Score Médio de Qualidade da assistente Emis variou de <strong>${statsB.avgScore}/100</strong> para <strong>${statsA.avgScore}/100</strong> (${statsA.avgScore >= statsB.avgScore ? 'evolução positiva' : 'oscilação em monitoramento'}).
              A taxa de resolução autônoma (IAR) atingiu <strong>${statsA.resolvedRate}%</strong> (frente a ${statsB.resolvedRate}% no período base).
              As alucinações cognitivas fecharam em <strong>${statsA.hallucinationRate}%</strong> (${statsA.hallucinationCount} ocorrências) e foram identificados <strong>${statsA.securityCount} alertas de segurança</strong>.
              O principal tema demandado em ${getMonthLabel(compareMonthA)} foi <strong>${statsA.themeMetrics[0]?.theme || 'Nenhum'}</strong> (${statsA.themeMetrics[0]?.count || 0} chamados), 
              enquanto em ${getMonthLabel(compareMonthB)} concentrou-se em <strong>${statsB.themeMetrics[0]?.theme || 'Nenhum'}</strong> (${statsB.themeMetrics[0]?.count || 0} chamados).
            </p>
          </div>
        ` : `
          <!-- Single Month KPIs -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Total Auditado</div>
              <div class="kpi-val">${singleStats.total} <span style="font-size:10px; color:#64748b">conversas</span></div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Score Médio</div>
              <div class="kpi-val">${singleStats.avgScore}/100</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Taxa Resolução</div>
              <div class="kpi-val">${singleStats.resolvedRate}%</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Taxa Alucinação</div>
              <div class="kpi-val">${singleStats.hallucinationRate}% (${singleStats.hallucinationCount})</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Alertas Segurança</div>
              <div class="kpi-val">${singleStats.securityCount}</div>
            </div>
          </div>

          <!-- Single Month Narrative -->
          <div class="narrative-box">
            <div class="narrative-title">Diagnóstico Executivo do Período (${getMonthLabel(selectedMonth)})</div>
            <p class="narrative-text">
              Durante o período de <strong>${getMonthLabel(selectedMonth)}</strong>, foram auditadas <strong>${singleStats.total} interações completas</strong>. 
              A assistente alcançou uma nota média de <strong>${singleStats.avgScore}/100 pontos</strong>, com <strong>${singleStats.resolvedRate}%</strong> de resolução no primeiro contato sem intervenção humana. 
              O índice de alucinação manteve-se em <strong>${singleStats.hallucinationRate}%</strong> (${singleStats.hallucinationCount} ocorrências registradas). 
              Os temas de maior fricção e demanda no período foram <strong>${singleStats.themeMetrics[0]?.theme || 'Nenhum'}</strong> (${singleStats.themeMetrics[0]?.count || 0} ocorrências) e <strong>${singleStats.themeMetrics[1]?.theme || 'Outros'}</strong> (${singleStats.themeMetrics[1]?.count || 0} ocorrências).
            </p>
          </div>
        `}

        <!-- Exemplary & Critical Case Studies -->
        <div class="cases-grid">
          <!-- Case 1: Best Audit -->
          <div class="case-card success">
            <div class="case-header success">
              <span>🌟 Atendimento Exemplar (Destaque Positivo)</span>
              <span class="case-badge success">Nota ${exemplarAudit ? exemplarAudit.scoreGeral : 100}/100</span>
            </div>
            <div style="font-size: 9pt; color: #475569; margin-bottom: 4px;">
              <strong>Tema:</strong> ${exemplarAudit?.tema || 'Certificados / NF-e'} | <strong>Cliente:</strong> ${exemplarAudit?.clienteIdentificado || 'Cliente Auditado'}
            </div>
            <div class="dialog-quote success">
              <strong>Cliente:</strong> "${exemplarAudit?.clienteMsg ? exemplarAudit.clienteMsg.slice(0, 140) + '...' : 'Como configuro o certificado A1 no emissor?'}"<br/>
              <strong>Emis:</strong> "${exemplarAudit?.emisMsg ? exemplarAudit.emisMsg.slice(0, 180) + '...' : 'Acesse Configurações > Certificados > Selecionar Arquivo .PFX...'}"
            </div>
            <div style="font-size: 8.5pt; color: #166534; margin-top: 4px;">
              <strong>Fatores de Sucesso:</strong> Resposta precisa, ausência total de alucinações, conformidade de segurança e tom cordial no padrão SIEG.
            </div>
          </div>

          <!-- Case 2: Worst Audit / Attention Point -->
          <div class="case-card danger">
            <div class="case-header danger">
              <span>⚠️ Ponto de Atenção / Desvio em Auditoria</span>
              <span class="case-badge danger">Nota ${criticalAudit ? criticalAudit.scoreGeral : 40}/100</span>
            </div>
            <div style="font-size: 9pt; color: #475569; margin-bottom: 4px;">
              <strong>Tema:</strong> ${criticalAudit?.tema || 'Fora do Escopo'} | <strong>Classificação:</strong> ${criticalAudit?.classificacao || 'Falha Grave'}
            </div>
            <div class="dialog-quote danger">
              <strong>Cliente:</strong> "${criticalAudit?.clienteMsg ? criticalAudit.clienteMsg.slice(0, 140) + '...' : 'Como emitir nota fiscal de produtor rural em papel?'}"<br/>
              <strong>Emis:</strong> "${criticalAudit?.emisMsg ? criticalAudit.emisMsg.slice(0, 180) + '...' : 'Orientação confusa ou desvio dos limites do sistema.'}"
            </div>
            <div style="font-size: 8.5pt; color: #9f1239; margin-top: 4px;">
              <strong>Diagnóstico / Causa Raiz:</strong> ${criticalAudit?.promptMelhoria?.melhoriaSugerida || 'Ajustar prompt de sistema para rejeitar dúvidas fora de escopo e evitar alucinação de regras.'}
            </div>
          </div>
        </div>

        <!-- Consolidated Theme Breakdown Table -->
        <div class="table-box">
          <div class="table-title">Consolidado por Tema de Atendimento</div>
          <table>
            <thead>
              <tr>
                <th>Tema de Atendimento</th>
                <th style="text-align: center">Volume Auditado</th>
                <th style="text-align: center">% do Total</th>
                <th style="text-align: center">Taxa de Resolução</th>
                <th style="text-align: center">Alucinações</th>
                <th style="text-align: center">Score Médio</th>
              </tr>
            </thead>
            <tbody>
              ${activeStats.themeMetrics.map(t => `
                <tr>
                  <td><strong>${t.theme}</strong></td>
                  <td style="text-align: center">${t.count}</td>
                  <td style="text-align: center">${t.percentage}%</td>
                  <td style="text-align: center; color: #16a34a; font-weight: 700;">${((t.resolved / t.count) * 100).toFixed(0)}%</td>
                  <td style="text-align: center; color: ${t.hallucinations > 0 ? '#e11d48' : '#64748b'}; font-weight: 700;">${t.hallucinations}</td>
                  <td style="text-align: center; font-weight: 700;">${t.avgScore}/100</td>
                </tr>
              `).join('')}
              ${activeStats.themeMetrics.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align: center; color: #94a3b8; padding: 12px;">Nenhum registro auditado no período.</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <span>SIEG AI Governance Center • Emis Intelligence System</span>
          <span>Documento Executivo de Auditoria • Confidencial</span>
        </div>

      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=950,height=850');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      alert("Permita pop-ups no seu navegador para baixar o relatório em PDF.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Filter Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white font-sans tracking-tight flex items-center gap-2">
            Relatórios Executivos &amp; Diagnóstico de Auditoria
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-2.5 py-0.5 rounded-full border border-blue-500/30">
              {reportMode === "comparative" ? `${getMonthLabel(compareMonthA)} vs ${getMonthLabel(compareMonthB)}` : getMonthLabel(selectedMonth)}
            </span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Análise executiva comparativa e consolidação de indicadores operacionais, qualidade da IA e atrito por temas fiscais.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setReportMode("single")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                reportMode === "single" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar size={13} />
              <span>Visão Mensal</span>
            </button>
            <button
              onClick={() => setReportMode("comparative")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                reportMode === "comparative" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowRightLeft size={13} />
              <span>Comparativo de Meses</span>
            </button>
          </div>

          {/* Single Month Selectors */}
          {reportMode === "single" ? (
            <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Mês:</span>
              <select
                id="exec-reports-single-month"
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
          ) : (
            /* Comparative Selectors */
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
                <span className="text-[11px] text-blue-400 font-bold">Mês A:</span>
                <select
                  id="exec-reports-compare-month-a"
                  value={compareMonthA}
                  onChange={(e) => setCompareMonthA(e.target.value)}
                  className="bg-transparent text-xs text-white font-semibold outline-none cursor-pointer pr-2 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="2026-10" className="bg-slate-900 text-slate-200">Outubro 2026</option>
                  <option value="2026-09" className="bg-slate-900 text-slate-200">Setembro 2026</option>
                  <option value="2026-08" className="bg-slate-900 text-slate-200">Agosto 2026</option>
                  <option value="2026-07" className="bg-slate-900 text-slate-200">Julho 2026</option>
                  <option value="2026-06" className="bg-slate-900 text-slate-200">Junho 2026</option>
                </select>
              </div>

              <span className="text-slate-500 text-xs font-bold font-mono">VS</span>

              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
                <span className="text-[11px] text-purple-400 font-bold">Mês B:</span>
                <select
                  id="exec-reports-compare-month-b"
                  value={compareMonthB}
                  onChange={(e) => setCompareMonthB(e.target.value)}
                  className="bg-transparent text-xs text-white font-semibold outline-none cursor-pointer pr-2 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="2026-10" className="bg-slate-900 text-slate-200">Outubro 2026</option>
                  <option value="2026-09" className="bg-slate-900 text-slate-200">Setembro 2026</option>
                  <option value="2026-08" className="bg-slate-900 text-slate-200">Agosto 2026</option>
                  <option value="2026-07" className="bg-slate-900 text-slate-200">Julho 2026</option>
                  <option value="2026-06" className="bg-slate-900 text-slate-200">Junho 2026</option>
                </select>
              </div>
            </div>
          )}

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md hover:shadow-emerald-900/30 transition cursor-pointer border border-emerald-500/40 active:scale-95"
            title="Baixar relatório executivo em formato PDF"
          >
            <Download size={15} />
            <span>Baixar Relatório (PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {reportMode === "single" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Auditado</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-extrabold text-white font-mono">{singleStats.total}</span>
              <span className="text-[10px] text-slate-500 font-semibold">conversas</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Score Médio IA</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className={`text-xl font-extrabold font-mono ${singleStats.avgScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {singleStats.avgScore}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">/100 pts</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Taxa Resolução</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-extrabold text-blue-400 font-mono">{singleStats.resolvedRate}%</span>
              <span className="text-[10px] text-slate-500 font-semibold">({singleStats.resolvedCount} ok)</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Taxa Alucinação</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className={`text-xl font-extrabold font-mono ${singleStats.hallucinationCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {singleStats.hallucinationRate}%
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">({singleStats.hallucinationCount})</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Riscos Segurança</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className={`text-xl font-extrabold font-mono ${singleStats.securityCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {singleStats.securityCount}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">alertas</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Clientes em Risco</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-extrabold text-amber-400 font-mono">{singleStats.highRiskClientsCount}</span>
              <span className="text-[10px] text-slate-500 font-semibold">atenção</span>
            </div>
          </div>
        </div>
      ) : (
        /* Comparative KPI Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Volume Auditado</span>
            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-extrabold text-blue-400 font-mono">{statsA.total}</span>
                <span className="text-[10px] text-slate-500">vs</span>
                <span className="text-base font-extrabold text-purple-400 font-mono">{statsB.total}</span>
              </div>
              {(() => {
                const d = getDelta(statsA.total, statsB.total);
                return (
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${d.diff >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {d.formatted}
                  </span>
                );
              })()}
            </div>
            <div className="text-[9px] text-slate-500 mt-1">{getMonthLabel(compareMonthA).split(' ')[0]} vs {getMonthLabel(compareMonthB).split(' ')[0]}</div>
          </div>

          {/* Score */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Score Médio</span>
            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-extrabold text-blue-400 font-mono">{statsA.avgScore}</span>
                <span className="text-[10px] text-slate-500">vs</span>
                <span className="text-base font-extrabold text-purple-400 font-mono">{statsB.avgScore}</span>
              </div>
              {(() => {
                const d = getDelta(statsA.avgScore, statsB.avgScore);
                return (
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${d.isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {d.formatted} pts
                  </span>
                );
              })()}
            </div>
            <div className="text-[9px] text-slate-500 mt-1">Pontuação Técnica 0-100</div>
          </div>

          {/* Resolução */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Taxa Resolução</span>
            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-extrabold text-blue-400 font-mono">{statsA.resolvedRate}%</span>
                <span className="text-[10px] text-slate-500">vs</span>
                <span className="text-base font-extrabold text-purple-400 font-mono">{statsB.resolvedRate}%</span>
              </div>
              {(() => {
                const d = getDelta(Number(statsA.resolvedRate), Number(statsB.resolvedRate), true);
                return (
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${d.isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {d.formatted}
                  </span>
                );
              })()}
            </div>
            <div className="text-[9px] text-slate-500 mt-1">Solução no 1º Contato</div>
          </div>

          {/* Alucinações */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Alucinações</span>
            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-extrabold text-blue-400 font-mono">{statsA.hallucinationCount}</span>
                <span className="text-[10px] text-slate-500">vs</span>
                <span className="text-base font-extrabold text-purple-400 font-mono">{statsB.hallucinationCount}</span>
              </div>
              {(() => {
                const d = getDelta(statsA.hallucinationCount, statsB.hallucinationCount, false, true);
                return (
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${d.isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {d.formatted}
                  </span>
                );
              })()}
            </div>
            <div className="text-[9px] text-slate-500 mt-1">{statsA.hallucinationRate}% vs {statsB.hallucinationRate}%</div>
          </div>

          {/* Segurança */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Alertas Segurança</span>
            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-extrabold text-blue-400 font-mono">{statsA.securityCount}</span>
                <span className="text-[10px] text-slate-500">vs</span>
                <span className="text-base font-extrabold text-purple-400 font-mono">{statsB.securityCount}</span>
              </div>
              {(() => {
                const d = getDelta(statsA.securityCount, statsB.securityCount, false, true);
                return (
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${d.isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {d.formatted}
                  </span>
                );
              })()}
            </div>
            <div className="text-[9px] text-slate-500 mt-1">Violações de Dados</div>
          </div>

          {/* Clientes em Risco */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Clientes em Risco</span>
            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-extrabold text-blue-400 font-mono">{statsA.highRiskClientsCount}</span>
                <span className="text-[10px] text-slate-500">vs</span>
                <span className="text-base font-extrabold text-purple-400 font-mono">{statsB.highRiskClientsCount}</span>
              </div>
              {(() => {
                const d = getDelta(statsA.highRiskClientsCount, statsB.highRiskClientsCount, false, true);
                return (
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${d.isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {d.formatted}
                  </span>
                );
              })()}
            </div>
            <div className="text-[9px] text-slate-500 mt-1">Risco Alto/Crítico</div>
          </div>
        </div>
      )}

      {/* Narrative Executive Report Card (Balanced Natural & Technical Analysis) */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-800/80">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {reportMode === "comparative" 
                ? `Diagnóstico Executivo Comparativo • ${getMonthLabel(compareMonthA)} vs ${getMonthLabel(compareMonthB)}`
                : `Diagnóstico Executivo de Auditoria • ${getMonthLabel(selectedMonth)}`
              }
            </h3>
            <p className="text-[11px] text-slate-400">
              Parecer técnico e operacional estruturado a partir das conversas auditadas e dos indicadores de governança.
            </p>
          </div>
        </div>

        {reportMode === "comparative" ? (
          <div className="space-y-4 text-xs font-sans text-slate-300 leading-relaxed">
            <p>
              A análise comparativa entre <strong className="text-blue-300">{getMonthLabel(compareMonthA)}</strong> e <strong className="text-purple-300">{getMonthLabel(compareMonthB)}</strong> aponta 
              uma amostragem de <strong>{statsA.total} interações auditadas</strong> no período A frente a <strong>{statsB.total} interações</strong> no período B. 
              A acurácia global da assistente Emis registrou Score Médio de <strong>{statsA.avgScore}/100 pontos</strong> em {getMonthLabel(compareMonthA).split(' ')[0]} contra <strong>{statsB.avgScore}/100 pontos</strong> em {getMonthLabel(compareMonthB).split(' ')[0]} 
              ({statsA.avgScore >= statsB.avgScore ? <span className="text-emerald-400 font-bold">ganho de +{statsA.avgScore - statsB.avgScore} pts</span> : <span className="text-rose-400 font-bold">oscilação de {statsA.avgScore - statsB.avgScore} pts</span>}).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Flame size={14} />
                  Ranking de Assuntos em {getMonthLabel(compareMonthA)}
                </h4>
                <ul className="space-y-1.5 text-[11px]">
                  {statsA.themeMetrics.slice(0, 4).map((t, idx) => (
                    <li key={t.theme} className="flex justify-between items-center text-slate-300">
                      <span><strong>{idx + 1}. {t.theme}</strong></span>
                      <span className="font-mono text-slate-400">{t.count} chamados ({t.percentage}%)</span>
                    </li>
                  ))}
                  {statsA.themeMetrics.length === 0 && <li className="text-slate-500 italic">Sem dados auditados no período A.</li>}
                </ul>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <h4 className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Flame size={14} />
                  Ranking de Assuntos em {getMonthLabel(compareMonthB)}
                </h4>
                <ul className="space-y-1.5 text-[11px]">
                  {statsB.themeMetrics.slice(0, 4).map((t, idx) => (
                    <li key={t.theme} className="flex justify-between items-center text-slate-300">
                      <span><strong>{idx + 1}. {t.theme}</strong></span>
                      <span className="font-mono text-slate-400">{t.count} chamados ({t.percentage}%)</span>
                    </li>
                  ))}
                  {statsB.themeMetrics.length === 0 && <li className="text-slate-500 italic">Sem dados auditados no período B.</li>}
                </ul>
              </div>
            </div>

            <p className="pt-1">
              <strong>Mapeamento de Fricção e Riscos:</strong> Em {getMonthLabel(compareMonthA)}, foram detectadas <strong>{statsA.hallucinationCount} ocorrências de alucinação</strong> ({statsA.hallucinationRate}%) 
              e <strong>{statsA.securityCount} incidentes com dados sensíveis</strong>. 
              No período B ({getMonthLabel(compareMonthB)}), estes indicadores registraram {statsB.hallucinationCount} alucinações e {statsB.securityCount} alertas de segurança. 
              A taxa de contenção autônoma (IAR) atingiu <strong>{statsA.resolvedRate}%</strong>, resultando em <strong>{statsA.forwardedCount} encaminhamentos para atendimento humano</strong>.
            </p>
          </div>
        ) : (
          /* Single Month Narrative */
          <div className="space-y-4 text-xs font-sans text-slate-300 leading-relaxed">
            <p>
              No período de <strong className="text-blue-300">{getMonthLabel(selectedMonth)}</strong>, a governança de IA consolidou a auditoria de <strong>{singleStats.total} atendimentos completos</strong>. 
              A assistente Emis obteve uma nota média global de <strong>{singleStats.avgScore}/100 pontos</strong>, operando com uma taxa de resolução autônoma de <strong>{singleStats.resolvedRate}%</strong> ({singleStats.resolvedCount} chamados solucionados de primeira).
            </p>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
              <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame size={14} />
                Top 5 Assuntos de Maior Demanda e Volume
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {singleStats.themeMetrics.slice(0, 5).map((t, idx) => (
                  <div key={t.theme} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-[11px]">#{idx + 1} {t.theme}</span>
                      <span className="font-mono text-emerald-400 text-[10px] font-bold">{t.count} chamados</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Resolução: {((t.resolved / t.count) * 100).toFixed(0)}%</span>
                      <span>Score: {t.avgScore}/100</span>
                    </div>
                  </div>
                ))}
                {singleStats.themeMetrics.length === 0 && (
                  <div className="text-slate-500 italic py-2">Nenhum tema auditado no período selecionado.</div>
                )}
              </div>
            </div>

            <p>
              <strong>Controle Cognitivo e Segurança:</strong> O monitoramento identificou <strong>{singleStats.hallucinationCount} ocorrências de alucinação</strong> ({singleStats.hallucinationRate}% do tráfego) 
              e <strong>{singleStats.securityCount} episódios de risco de segurança</strong>. 
              {singleStats.highRiskClientsCount > 0 ? (
                <span> Atualmente, <strong>{singleStats.highRiskClientsCount} clientes</strong> encontram-se em monitoramento ativo de risco por acúmulo de rejeições fiscais ou dúvidas reincidentes.</span>
              ) : (
                <span> Não foram detectados clientes sob risco crítico de cancelamento no período.</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Case Studies / Destaques de Auditoria (Best Audit 100 & Worst Audit / Critical Error) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best Audit Card */}
        {(() => {
          const targetStats = reportMode === "comparative" ? statsA : singleStats;
          const best = targetStats.bestAudit;

          return (
            <div className="bg-slate-900 rounded-2xl border border-emerald-500/20 p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <Award className="text-emerald-400" size={18} />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Atendimento Exemplar (Destaque Positivo)</h4>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full">
                  Nota {best ? best.scoreGeral : 100}/100
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span><strong>Tema:</strong> {best?.tema || "Certificados / NF-e"}</span>
                  <span className="font-mono text-slate-400">{best?.clienteIdentificado || "Cliente Auditado"}</span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Pergunta do Cliente:</span>
                    <p className="text-slate-300 italic text-[11px] mt-0.5 line-clamp-2">
                      "{best?.clienteMsg || "Como faço para instalar e vincular o certificado digital A1 no emissor?"}"
                    </p>
                  </div>
                  <div className="border-t border-slate-850 pt-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">Resposta da Emis:</span>
                    <p className="text-slate-200 text-[11px] mt-0.5 line-clamp-3">
                      "{best?.emisMsg || "Para configurar seu certificado A1, acesse Menu > Configurações da Empresa > Certificado Digital. Selecione o arquivo .pfx e digite a senha..."}"
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-300/90 leading-relaxed">
                  <strong>Fatores de Excelência:</strong> Passo a passo estruturado e objetivo, sem suposição de dados inexistentes, preservação estrita de senhas e aderência integral às diretrizes do sistema.
                </p>
              </div>
            </div>
          );
        })()}

        {/* Worst Audit Card */}
        {(() => {
          const targetStats = reportMode === "comparative" ? statsA : singleStats;
          const worst = targetStats.worstAudit;

          return (
            <div className="bg-slate-900 rounded-2xl border border-rose-500/20 p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="text-rose-400" size={18} />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ponto de Atenção / Desvio em Auditoria</h4>
                </div>
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full">
                  Nota {worst ? worst.scoreGeral : 40}/100
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span><strong>Tema:</strong> {worst?.tema || "Fora do Escopo / Alucinação"}</span>
                  <span className="font-mono text-rose-400">{worst?.classificacao || "Crítico"}</span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Pergunta do Cliente:</span>
                    <p className="text-slate-300 italic text-[11px] mt-0.5 line-clamp-2">
                      "{worst?.clienteMsg || "Como emitir nota fiscal de produtor rural em formulário contínuo?"}"
                    </p>
                  </div>
                  <div className="border-t border-slate-850 pt-2">
                    <span className="text-[10px] font-bold text-rose-400 uppercase block">Falha / Desvio Detectado:</span>
                    <p className="text-rose-200 text-[11px] mt-0.5 line-clamp-3">
                      "{worst?.alucinacaoDetalhe?.explicacao || worst?.promptMelhoria?.melhoriaSugerida || "A assistente tentou instruir emissão física em formulário papel, funcionalidade inexistente no emissor eletrônico SIEG."}"
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-rose-300/90 leading-relaxed">
                  <strong>Ação Recomendada:</strong> {worst?.promptMelhoria?.acaoRecomendada || "Reforçar as restrições de escopo no prompt oficial para limitar as orientações estritamente aos documentos eletrônicos (NF-e, NFC-e, NFS-e, MDF-e)."}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Dynamic Theme Breakdown Table (Consolidado por Tema de Atendimento) */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
          <FileText size={16} className="text-blue-400" />
          Consolidado por Tema de Atendimento • {reportMode === "comparative" ? `${getMonthLabel(compareMonthA)}` : getMonthLabel(selectedMonth)}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Tema de Atendimento</th>
                <th className="py-2.5 px-3 text-center">Volume Auditado</th>
                <th className="py-2.5 px-3 text-center">% do Volume</th>
                <th className="py-2.5 px-3 text-center">Taxa de Resolução</th>
                <th className="py-2.5 px-3 text-center">Ocorrências de Alucinação</th>
                <th className="py-2.5 px-3 text-center">Score Médio</th>
                <th className="py-2.5 px-3 text-right">Status de Saúde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(reportMode === "comparative" ? statsA : singleStats).themeMetrics.map((t) => {
                const resPct = ((t.resolved / t.count) * 100).toFixed(0);
                const aluPct = ((t.hallucinations / t.count) * 100).toFixed(0);

                return (
                  <tr key={t.theme} className="hover:bg-slate-850/40 transition">
                    <td className="py-3 px-3 font-semibold text-white">{t.theme}</td>
                    <td className="py-3 px-3 text-center font-mono">{t.count}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{t.percentage}%</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">{resPct}%</td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className={t.hallucinations > 0 ? "text-rose-400 font-bold" : "text-slate-400"}>
                        {t.hallucinations} ({aluPct}%)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">
                      {t.avgScore}/100
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {t.hallucinations === 0 && Number(resPct) >= 80 ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          Excelente
                        </span>
                      ) : Number(aluPct) > 15 || t.avgScore < 70 ? (
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          Crítico
                        </span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          Atenção
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {(reportMode === "comparative" ? statsA : singleStats).themeMetrics.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500 italic">
                    Nenhum dado auditado encontrado para o período selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
