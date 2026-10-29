import React, { useState } from "react";
import { FeatureFriction, FrictionHeatmapItem, EvaluationResult } from "../types";
import { MOCK_FRICTION_METRICS } from "../data";
import { Sparkles, BarChart, Calendar, Award, AlertCircle } from "lucide-react";

interface ProductIntelligenceProps {
  evaluations?: EvaluationResult[];
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

interface WeekConfig {
  id: string;
  label: string;
  days: { day: string; dateStr: string }[];
}

const WEEKS_JUNE: WeekConfig[] = [
  {
    id: "w1",
    label: "Semana 1 (01/06 - 06/06)",
    days: [
      { day: "Segunda", dateStr: "01/06" },
      { day: "Terça", dateStr: "02/06" },
      { day: "Quarta", dateStr: "03/06" },
      { day: "Quinta", dateStr: "04/06" },
      { day: "Sexta", dateStr: "05/06" },
      { day: "Sábado", dateStr: "06/06" }
    ]
  },
  {
    id: "w2",
    label: "Semana 2 (08/06 - 13/06)",
    days: [
      { day: "Segunda", dateStr: "08/06" },
      { day: "Terça", dateStr: "09/06" },
      { day: "Quarta", dateStr: "10/06" },
      { day: "Quinta", dateStr: "11/06" },
      { day: "Sexta", dateStr: "12/06" },
      { day: "Sábado", dateStr: "13/06" }
    ]
  },
  {
    id: "w3",
    label: "Semana 3 (15/06 - 20/06)",
    days: [
      { day: "Segunda", dateStr: "15/06" },
      { day: "Terça", dateStr: "16/06" },
      { day: "Quarta", dateStr: "17/06" },
      { day: "Quinta", dateStr: "18/06" },
      { day: "Sexta", dateStr: "19/06" },
      { day: "Sábado", dateStr: "20/06" }
    ]
  },
  {
    id: "w4",
    label: "Semana 4 (22/06 - 27/06)",
    days: [
      { day: "Segunda", dateStr: "22/06" },
      { day: "Terça", dateStr: "23/06" },
      { day: "Quarta", dateStr: "24/06" },
      { day: "Quinta", dateStr: "25/06" },
      { day: "Sexta", dateStr: "26/06" },
      { day: "Sábado", dateStr: "27/06" }
    ]
  },
  {
    id: "w5",
    label: "Semana 5 (29/06 - 04/07)",
    days: [
      { day: "Segunda", dateStr: "29/06" },
      { day: "Terça", dateStr: "30/06" },
      { day: "Quarta", dateStr: "01/07" },
      { day: "Quinta", dateStr: "02/07" },
      { day: "Sexta", dateStr: "03/07" },
      { day: "Sábado", dateStr: "04/07" }
    ]
  }
];

const WEEKS_JULY: WeekConfig[] = [
  {
    id: "w1",
    label: "Semana 1 (29/06 - 04/07)",
    days: [
      { day: "Segunda", dateStr: "29/06" },
      { day: "Terça", dateStr: "30/06" },
      { day: "Quarta", dateStr: "01/07" },
      { day: "Quinta", dateStr: "02/07" },
      { day: "Sexta", dateStr: "03/07" },
      { day: "Sábado", dateStr: "04/07" }
    ]
  },
  {
    id: "w2",
    label: "Semana 2 (06/07 - 11/07)",
    days: [
      { day: "Segunda", dateStr: "06/07" },
      { day: "Terça", dateStr: "07/07" },
      { day: "Quarta", dateStr: "08/07" },
      { day: "Quinta", dateStr: "09/07" },
      { day: "Sexta", dateStr: "10/07" },
      { day: "Sábado", dateStr: "11/07" }
    ]
  },
  {
    id: "w3",
    label: "Semana 3 (13/07 - 18/07)",
    days: [
      { day: "Segunda", dateStr: "13/07" },
      { day: "Terça", dateStr: "14/07" },
      { day: "Quarta", dateStr: "15/07" },
      { day: "Quinta", dateStr: "16/07" },
      { day: "Sexta", dateStr: "17/07" },
      { day: "Sábado", dateStr: "18/07" }
    ]
  },
  {
    id: "w4",
    label: "Semana 4 (20/07 - 25/07)",
    days: [
      { day: "Segunda", dateStr: "20/07" },
      { day: "Terça", dateStr: "21/07" },
      { day: "Quarta", dateStr: "22/07" },
      { day: "Quinta", dateStr: "23/07" },
      { day: "Sexta", dateStr: "24/07" },
      { day: "Sábado", dateStr: "25/07" }
    ]
  },
  {
    id: "w5",
    label: "Semana 5 (27/07 - 01/08)",
    days: [
      { day: "Segunda", dateStr: "27/07" },
      { day: "Terça", dateStr: "28/07" },
      { day: "Quarta", dateStr: "29/07" },
      { day: "Quinta", dateStr: "30/07" },
      { day: "Sexta", dateStr: "31/07" },
      { day: "Sábado", dateStr: "01/08" }
    ]
  }
];

const WEEKS_AUGUST: WeekConfig[] = [
  {
    id: "w1",
    label: "Semana 1 (03/08 - 08/08)",
    days: [
      { day: "Segunda", dateStr: "03/08" },
      { day: "Terça", dateStr: "04/08" },
      { day: "Quarta", dateStr: "05/08" },
      { day: "Quinta", dateStr: "06/08" },
      { day: "Sexta", dateStr: "07/08" },
      { day: "Sábado", dateStr: "08/08" }
    ]
  },
  {
    id: "w2",
    label: "Semana 2 (10/08 - 15/08)",
    days: [
      { day: "Segunda", dateStr: "10/08" },
      { day: "Terça", dateStr: "11/08" },
      { day: "Quarta", dateStr: "12/08" },
      { day: "Quinta", dateStr: "13/08" },
      { day: "Sexta", dateStr: "14/08" },
      { day: "Sábado", dateStr: "15/08" }
    ]
  },
  {
    id: "w3",
    label: "Semana 3 (17/08 - 22/08)",
    days: [
      { day: "Segunda", dateStr: "17/08" },
      { day: "Terça", dateStr: "18/08" },
      { day: "Quarta", dateStr: "19/08" },
      { day: "Quinta", dateStr: "20/08" },
      { day: "Sexta", dateStr: "21/08" },
      { day: "Sábado", dateStr: "22/08" }
    ]
  },
  {
    id: "w4",
    label: "Semana 4 (24/08 - 29/08)",
    days: [
      { day: "Segunda", dateStr: "24/08" },
      { day: "Terça", dateStr: "25/08" },
      { day: "Quarta", dateStr: "26/08" },
      { day: "Quinta", dateStr: "27/08" },
      { day: "Sexta", dateStr: "28/08" },
      { day: "Sábado", dateStr: "29/08" }
    ]
  },
  {
    id: "w5",
    label: "Semana 5 (31/08 - 05/09)",
    days: [
      { day: "Segunda", dateStr: "31/08" },
      { day: "Terça", dateStr: "01/09" },
      { day: "Quarta", dateStr: "02/09" },
      { day: "Quinta", dateStr: "03/09" },
      { day: "Sexta", dateStr: "04/09" },
      { day: "Sábado", dateStr: "05/09" }
    ]
  }
];

const WEEKS_SEPTEMBER: WeekConfig[] = [
  {
    id: "w1",
    label: "Semana 1 (31/08 - 05/09)",
    days: [
      { day: "Segunda", dateStr: "31/08" },
      { day: "Terça", dateStr: "01/09" },
      { day: "Quarta", dateStr: "02/09" },
      { day: "Quinta", dateStr: "03/09" },
      { day: "Sexta", dateStr: "04/09" },
      { day: "Sábado", dateStr: "05/09" }
    ]
  },
  {
    id: "w2",
    label: "Semana 2 (07/09 - 12/09)",
    days: [
      { day: "Segunda", dateStr: "07/09" },
      { day: "Terça", dateStr: "08/09" },
      { day: "Quarta", dateStr: "09/09" },
      { day: "Quinta", dateStr: "10/09" },
      { day: "Sexta", dateStr: "11/09" },
      { day: "Sábado", dateStr: "12/09" }
    ]
  },
  {
    id: "w3",
    label: "Semana 3 (14/09 - 19/09)",
    days: [
      { day: "Segunda", dateStr: "14/09" },
      { day: "Terça", dateStr: "15/09" },
      { day: "Quarta", dateStr: "16/09" },
      { day: "Quinta", dateStr: "17/09" },
      { day: "Sexta", dateStr: "18/09" },
      { day: "Sábado", dateStr: "19/09" }
    ]
  },
  {
    id: "w4",
    label: "Semana 4 (21/09 - 26/09)",
    days: [
      { day: "Segunda", dateStr: "21/09" },
      { day: "Terça", dateStr: "22/09" },
      { day: "Quarta", dateStr: "23/09" },
      { day: "Quinta", dateStr: "24/09" },
      { day: "Sexta", dateStr: "25/09" },
      { day: "Sábado", dateStr: "26/09" }
    ]
  },
  {
    id: "w5",
    label: "Semana 5 (28/09 - 03/10)",
    days: [
      { day: "Segunda", dateStr: "28/09" },
      { day: "Terça", dateStr: "29/09" },
      { day: "Quarta", dateStr: "30/09" },
      { day: "Quinta", dateStr: "01/10" },
      { day: "Sexta", dateStr: "02/10" },
      { day: "Sábado", dateStr: "03/10" }
    ]
  }
];

const WEEKS_OCTOBER: WeekConfig[] = [
  {
    id: "w1",
    label: "Semana 1 (28/09 - 03/10)",
    days: [
      { day: "Segunda", dateStr: "28/09" },
      { day: "Terça", dateStr: "29/09" },
      { day: "Quarta", dateStr: "30/09" },
      { day: "Quinta", dateStr: "01/10" },
      { day: "Sexta", dateStr: "02/10" },
      { day: "Sábado", dateStr: "03/10" }
    ]
  },
  {
    id: "w2",
    label: "Semana 2 (05/10 - 10/10)",
    days: [
      { day: "Segunda", dateStr: "05/10" },
      { day: "Terça", dateStr: "06/10" },
      { day: "Quarta", dateStr: "07/10" },
      { day: "Quinta", dateStr: "08/10" },
      { day: "Sexta", dateStr: "09/10" },
      { day: "Sábado", dateStr: "10/10" }
    ]
  },
  {
    id: "w3",
    label: "Semana 3 (12/10 - 17/10)",
    days: [
      { day: "Segunda", dateStr: "12/10" },
      { day: "Terça", dateStr: "13/10" },
      { day: "Quarta", dateStr: "14/10" },
      { day: "Quinta", dateStr: "15/10" },
      { day: "Sexta", dateStr: "16/10" },
      { day: "Sábado", dateStr: "17/10" }
    ]
  },
  {
    id: "w4",
    label: "Semana 4 (19/10 - 24/10)",
    days: [
      { day: "Segunda", dateStr: "19/10" },
      { day: "Terça", dateStr: "20/10" },
      { day: "Quarta", dateStr: "21/10" },
      { day: "Quinta", dateStr: "22/10" },
      { day: "Sexta", dateStr: "23/10" },
      { day: "Sábado", dateStr: "24/10" }
    ]
  },
  {
    id: "w5",
    label: "Semana 5 (26/10 - 31/10)",
    days: [
      { day: "Segunda", dateStr: "26/10" },
      { day: "Terça", dateStr: "27/10" },
      { day: "Quarta", dateStr: "28/10" },
      { day: "Quinta", dateStr: "29/10" },
      { day: "Sexta", dateStr: "30/10" },
      { day: "Sábado", dateStr: "31/10" }
    ]
  }
];

export const ProductIntelligenceTab: React.FC<ProductIntelligenceProps> = ({ 
  evaluations = [],
  selectedMonth: propSelectedMonth,
  onMonthChange
}) => {
  const [localMonth, setLocalMonth] = useState<string>("2026-08");
  const selectedMonth = propSelectedMonth && propSelectedMonth !== "Todos" ? propSelectedMonth : localMonth;
  const setSelectedMonth = (val: string) => {
    setLocalMonth(val);
    if (onMonthChange) onMonthChange(val);
  };
  const [selectedWeek, setSelectedWeek] = useState<string>("w1");
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("todas");

  // Helper functions for Date and Time Category Extraction
  const getEvaluationWeekday = (timestamp: string): string => {
    const date = new Date(timestamp);
    const day = date.getDay();
    switch (day) {
      case 1: return "Segunda";
      case 2: return "Terça";
      case 3: return "Quarta";
      case 4: return "Quinta";
      case 5: return "Sexta";
      case 6: return "Sábado";
      default: return "Segunda"; // fallback
    }
  };

  const getEvaluationHourRange = (timestamp: string): string => {
    const date = new Date(timestamp);
    const h = date.getHours();
    if (h >= 8 && h < 10) return "08:00 - 10:00";
    if (h >= 10 && h < 12) return "10:00 - 12:00";
    if (h >= 12 && h < 14) return "12:00 - 14:00";
    if (h >= 14 && h < 16) return "14:00 - 16:00";
    if (h >= 16 && h <= 20) return "16:00 - 18:00"; 
    return "12:00 - 14:00"; // balanced fallback
  };

  const getEvaluationDateStr = (timestamp: string): string => {
    const date = new Date(timestamp);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}`;
  };

  // Dynamically compute active weeks and days based on month
  const currentWeeksList = selectedMonth === "2026-06" 
    ? WEEKS_JUNE 
    : selectedMonth === "2026-07" 
    ? WEEKS_JULY 
    : selectedMonth === "2026-08" 
    ? WEEKS_AUGUST 
    : selectedMonth === "2026-09"
    ? WEEKS_SEPTEMBER
    : WEEKS_OCTOBER;
  const activeWeekConfig = currentWeeksList.find(w => w.id === selectedWeek) || currentWeeksList[0];
  const daysWithDates = activeWeekConfig.days;

  const hours = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00"
  ];

  // Dynamically calculate the top 5 friction themes of a given day, strictly synchronized with audited records
  const getDayFrictionThemes = (day: string, dateStr: string) => {
    // Filter evaluations matching this specific date (e.g. "03/08", "31/08")
    const dayEvals = evaluations.filter(e => getEvaluationDateStr(e.timestamp) === dateStr);

    if (dayEvals.length > 0) {
      // Group by theme and calculate counts and friction points
      const counts: { [key: string]: { count: number; frictionPoints: number; avgScore: number } } = {};
      
      dayEvals.forEach(e => {
        let theme = e.tema || "NF-e";
        // Standardize theme names to match clean display layouts used elsewhere
        if (theme === "Módulo de Segurança") theme = "Mód. Segurança";
        if (theme === "Localização de Notas") theme = "Localização";
        if (theme === "Rejeições SEFAZ") theme = "Rejeição SEFAZ";
        if (theme === "Acesso ao Emissor") theme = "Acesso Emissor";
        if (theme === "Carta de Correção") theme = "C. Correção";
        if (theme === "Inutilização") theme = "Inutilização";

        if (!counts[theme]) {
          counts[theme] = { count: 0, frictionPoints: 0, avgScore: 0 };
        }
        counts[theme].count += 1;
        
        let points = 1;
        if (e.scoreGeral < 80) points += 2;
        if (e.classificacao === "Crítico" || e.classificacao === "Falha Grave") points += 3;
        if (e.houveAlucinacao) points += 4;
        if (e.riscoSeguranca) points += 5;
        if (e.foraDoEscopo) points += 2;
        
        counts[theme].frictionPoints += points;
        counts[theme].avgScore += e.scoreGeral;
      });

      // Convert grouping to sorted list
      const themesList = Object.entries(counts).map(([themeName, info]) => {
        const avgScore = info.avgScore / info.count;
        // Formula for intensity representing the severity of friction and volume
        const intensity = Math.min(100, Math.max(10, Math.round((info.frictionPoints / (info.count * 15)) * 70 + (info.count * 8))));
        
        return {
          themeName,
          count: info.count,
          frictionPoints: info.frictionPoints,
          avgScore,
          intensity
        };
      });

      // Sort criteria to align with user expectations:
      // 1. Audit count DESC (Highest volume of audits first)
      // 2. Friction Points DESC (Most problematic first)
      // 3. Average Score ASC (Lowest score = highest friction first)
      themesList.sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        if (b.frictionPoints !== a.frictionPoints) return b.frictionPoints - a.frictionPoints;
        return a.avgScore - b.avgScore;
      });

      // Pad up to 5 elements representing the col positions of the friction matrix (1º to 5º Atrito)
      const result = [];
      for (let i = 0; i < 5; i++) {
        if (i < themesList.length) {
          result.push({
            themeName: themesList[i].themeName,
            intensity: themesList[i].intensity
          });
        } else {
          result.push({
            themeName: "-",
            intensity: 0
          });
        }
      }
      return result;
    }

    // When there are no audited records for this day, return '-' (traço) for all 5 slots
    return [
      { themeName: "-", intensity: 0 },
      { themeName: "-", intensity: 0 },
      { themeName: "-", intensity: 0 },
      { themeName: "-", intensity: 0 },
      { themeName: "-", intensity: 0 }
    ];
  };

  // Convert Intensity percentage to clean CSS Tailwind styles
  const getIntensityColor = (intensity: number, themeName: string) => {
    if (themeName === "-" || !themeName) return "bg-[#070a16]/50 text-slate-600 border border-slate-900";
    
    // Higher precision styles for theme matching visual appearance
    if (themeName === "Baixar Xml") {
      return "bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold shadow-[0_0_12px_rgba(244,63,94,0.15)]";
    }
    if (themeName === "Certificados") {
      return "bg-rose-500/15 text-rose-350 border border-rose-500/30 font-bold";
    }
    if (themeName === "Mód. Segurança" || themeName === "Módulo de Segurança") {
      return "bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold";
    }
    if (themeName === "Tributação" || themeName === "IBS/CBS") {
      return "bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold";
    }
    if (themeName === "Rejeição SEFAZ" || themeName === "Rejeições SEFAZ") {
      return "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold";
    }
    if (themeName === "Localização") {
      return "bg-[#070a16] text-slate-350 border border-slate-800";
    }
    if (themeName === "Fora do Escopo") {
      return "bg-[#070a16] text-slate-400 border border-slate-850";
    }

    // Dynamic mapping for any newly audited evaluation rows
    if (intensity >= 90) return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
    if (intensity >= 75) return "bg-rose-500/10 text-rose-300 border border-rose-500/20";
    if (intensity >= 50) return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    if (intensity >= 30) return "bg-[#070a16] text-slate-400 border border-slate-850";
    return "bg-[#070a16]/50 text-slate-500 border border-slate-900";
  };

  // Unified mapping from themes to feature group naming
  const getFeatureNameFromTheme = (theme: string): string => {
    const themeToFeatureMap: { [key: string]: string } = {
      "Certificados": "Renovação e Configuração de Certificados (A1/A3)",
      "Módulo de Segurança": "Módulo de Segurança",
      "Mód. Segurança": "Módulo de Segurança",
      "Rejeições SEFAZ": "Rejeições Cadastrais SEFAZ",
      "Rejeição SEFAZ": "Rejeições Cadastrais SEFAZ",
      "IBS/CBS": "Reforma Tributária (IBS/CBS)",
      "Tributação": "Reforma Tributária (IBS/CBS)",
      "Localização de Notas": "Consulta e Localização de Notas",
      "Localização": "Consulta e Localização de Notas",
      "Baixar Xml": "Download e Configuração de XML (Baixar Xml)",
      "Fora do Escopo": "Atendimentos Fora do Escopo Operacional",
      "Relatório Excel": "Relatórios de Exportação de Dados (Excel)",
      "Acesso ao Emissor": "Instabilidade no Acesso ao Emissor",
      "Acesso Emissor": "Instabilidade no Acesso ao Emissor",
      "Carta de Correção": "Correções de NF-e (Carta de Correção)",
      "C. Correção": "Correções de NF-e (Carta de Correção)",
      "Inutilização": "Inutilização de Notas",
      "NF-e": "Instabilidade de Emissão NF-e",
      "MDF-e": "Emissão de MDF-e",
      "Participantes": "Cadastro de Participantes",
      "Produtos": "Gerenciamento de Produtos",
      "Importação": "Importação de Notas",
      "Natureza de Operação": "Natureza de Operação",
      "Cancelamento": "Cancelamento de Notas"
    };
    return themeToFeatureMap[theme] || theme;
  };

  const BASELINE_METRICS: { [key: string]: { volume: number; impactClient: number; impactSupport: number; impactCS: number; tendency: string } } = {
    "Certificados": { volume: 175, impactClient: 8, impactSupport: 8, impactCS: 7, tendency: "Estável" },
    "Módulo de Segurança": { volume: 215, impactClient: 9, impactSupport: 9, impactCS: 8, tendency: "Crescimento" },
    "Rejeições SEFAZ": { volume: 140, impactClient: 6, impactSupport: 9, impactCS: 6, tendency: "Queda" },
    "IBS/CBS": { volume: 98, impactClient: 9, impactSupport: 7, impactCS: 8, tendency: "Crescimento" },
    "Localização de Notas": { volume: 76, impactClient: 4, impactSupport: 5, impactCS: 4, tendency: "Estável" },
    "Baixar Xml": { volume: 60, impactClient: 5, impactSupport: 6, impactCS: 5, tendency: "Crescimento" },
    "Fora do Escopo": { volume: 40, impactClient: 3, impactSupport: 4, impactCS: 3, tendency: "Estável" },
    "Relatório Excel": { volume: 30, impactClient: 2, impactSupport: 3, impactCS: 2, tendency: "Estável" },
  };

  // Build the dynamic Ranking of Atritos fully synchronized with the Heatmap de Fricção
  const getDynamicFrictionRanking = () => {
    // 1. Identify which days are active in the current filter
    const activeDays = selectedDayFilter === "todas"
      ? daysWithDates
      : daysWithDates.filter(d => d.day === selectedDayFilter);

    // 2. Aggregate calculated friction cells from the heatmap per active day to ensure strict synchronization
    const aggregatedThemes: { [key: string]: { totalIntensity: number; countInHeatmap: number } } = {};

    activeDays.forEach(({ day, dateStr }) => {
      const themesOfCurrentDay = getDayFrictionThemes(day, dateStr);
      themesOfCurrentDay.forEach((cell) => {
        if (cell.themeName && cell.themeName !== "-") {
          if (!aggregatedThemes[cell.themeName]) {
            aggregatedThemes[cell.themeName] = { totalIntensity: 0, countInHeatmap: 0 };
          }
          aggregatedThemes[cell.themeName].totalIntensity += cell.intensity;
          aggregatedThemes[cell.themeName].countInHeatmap += 1;
        }
      });
    });

    // 3. Map themes that actually appeared in the Heatmap to their ranking metrics
    const rankingResults = Object.entries(aggregatedThemes).map(([themeName, agg]) => {
      const featureName = getFeatureNameFromTheme(themeName);
      
      const keyForBase = themeName === "Mód. Segurança" ? "Módulo de Segurança" :
                         themeName === "Localização" ? "Localização de Notas" :
                         themeName === "Rejeição SEFAZ" ? "Rejeições SEFAZ" : themeName;

      const base = BASELINE_METRICS[keyForBase] || BASELINE_METRICS[featureName] || {
        impactClient: 5,
        impactSupport: 5,
        impactCS: 5,
        tendency: "Estável"
      };

      // Set volume strictly proportional to total intensity from active heatmap slots
      const volume = Math.round(agg.totalIntensity * 4.5);

      return {
        featureName,
        themeName,
        volume,
        impactClient: base.impactClient,
        impactSupport: base.impactSupport,
        impactCS: base.impactCS,
        tendency: base.tendency
      };
    });

    // 4. Sort descending strictly by volumetry (intensity) from Heatmap de Fricção
    rankingResults.sort((a, b) => b.volume - a.volume);

    return rankingResults;
  };

  const sortedFrictionIndex = getDynamicFrictionRanking();

  const topFrictionFeature = sortedFrictionIndex[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white font-sans tracking-tight">Centro de Inteligência de Produto</h2>
          <p className="text-slate-400 text-xs mt-1">
            Mapeamento de funcionalidades que geram maior atrito para os usuários, heatmap de horários de pressão e classificação de jornadas críticas.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold text-xs py-1.5 px-3 rounded-lg shadow-sm">
          <Calendar size={14} />
          <span>Fricção Monitorada</span>
        </div>
      </div>

      {/* Primary Highlight: Jornada com Maior Dificuldade */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-sm border border-slate-800">
        <div className="max-w-2xl space-y-2">
          <span className="bg-rose-500/15 text-rose-400 text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-500/20 uppercase tracking-widest">
            JORNADA DE MAIOR DIFICULDADE (SISTÊMICA)
          </span>
          <h3 className="text-xl font-bold font-sans tracking-tight mt-1 text-white">
            {topFrictionFeature ? topFrictionFeature.featureName : "Sem dados de atrito registrados no período"}
          </h3>
          <p className="text-slate-100 text-xs leading-relaxed opacity-90">
            {topFrictionFeature ? (
              topFrictionFeature.featureName.includes("Módulo de Segurança") ? (
                "A infraestrutura desktop responsável pela comunicação local com as Secretarias de Fazenda estaduais (Módulo de Segurança) concentra o principal foco de fricção e escalonamentos de faturas. A dependência direta dos drivers de certificados físicos e o preenchimento manual do Token geram picos no suporte."
              ) : topFrictionFeature.featureName.includes("Certificados") ? (
                "A expiração silenciosa dos certificados tipo A1 e a falta de drivers atualizados para leitores de cartão A3 geram bloqueios recorrentes de emissão e demandam abertura de chamados urgentes ao suporte técnico no encerramento fiscal diário."
              ) : topFrictionFeature.featureName.includes("Rejeições") ? (
                "Rejeições como duplicidades, CFOPs incorretos e enquadramentos indevidos de inscritos estaduais geram impedimentos severos que demandam contato de contingência direta com a contabilidade."
              ) : topFrictionFeature.featureName.includes("Consulta") || topFrictionFeature.featureName.includes("Localização") ? (
                "Dúvidas sobre o paradeiro de notas emitidas em modalidade de contingência off-line demandam suporte recorrente de localização e sincronização forçada de arquivos XML."
              ) : (
                "A infraestrutura de comunicação concentrada na emissão síncrona com as Secretarias de Fazenda estaduais representa o principal gargalo operacional e escalonamentos de faturas devido a instabilidades de rede."
              )
            ) : (
              "Não há atendimentos ou auditorias registradas para a semana e período selecionados. Realize novas auditorias na aba Governança para alimentar o mapa de calor e os rankings operacionais."
            )}
          </p>
          {topFrictionFeature && (
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
              <span className="text-rose-400 font-bold">Vol. Mensal Estimado: ~{topFrictionFeature.volume} chamados</span>
              <span className="text-slate-500">|</span>
              <span className="text-rose-300 font-bold">Impacto ao Cliente: {topFrictionFeature.impactClient}/10</span>
              <span className="text-slate-500">|</span>
              <span className="text-rose-350 font-bold">Impacto ao Suporte: {topFrictionFeature.impactSupport}/10</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Heatmap de Atrito */}
        <div className="lg:col-span-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-white font-sans tracking-tight flex items-center">
              <Calendar className="text-blue-400 mr-2" size={16} />
              Heatmap de Fricção (Maior Volumetria para Menor)
            </h3>
            
            {/* Monthly and weekly/weekday filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter by Month */}
              <div className="flex items-center space-x-1 bg-slate-955 border border-slate-800 rounded-lg py-1 px-2.5">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Mês:</span>
                <select
                  id="product-month-select"
                  value={selectedMonth}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedMonth(val);
                    // Reset to week 2 of the selected month as default
                    setSelectedWeek("w2");
                  }}
                  className="bg-transparent border-none text-[10px] font-bold text-slate-300 focus:outline-none cursor-pointer outline-none"
                >
                  <option value="2026-06" className="bg-slate-900 text-slate-200">Junho 2026</option>
                  <option value="2026-07" className="bg-slate-900 text-slate-200">Julho 2026</option>
                  <option value="2026-08" className="bg-slate-900 text-slate-200">Agosto 2026</option>
                  <option value="2026-09" className="bg-slate-900 text-slate-200">Setembro 2026</option>
                  <option value="2026-10" className="bg-slate-900 text-slate-200">Outubro 2026</option>
                </select>
              </div>

              {/* Filter by Week */}
              <div className="flex items-center space-x-1 bg-slate-955 border border-slate-800 rounded-lg py-1 px-2.5">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Semana:</span>
                <select
                  id="product-week-select"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="bg-transparent border-none text-[10px] font-bold text-slate-300 focus:outline-none cursor-pointer outline-none max-w-[120px] sm:max-w-none truncate"
                >
                  {currentWeeksList.map((w) => (
                    <option key={w.id} value={w.id} className="bg-slate-900 text-slate-200">
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Weekday */}
              <div className="flex items-center space-x-1 bg-slate-955 border border-slate-800 rounded-lg py-1 px-2.5">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Dia:</span>
                <select
                  id="product-day-select"
                  value={selectedDayFilter}
                  onChange={(e) => setSelectedDayFilter(e.target.value)}
                  className="bg-transparent border-none text-[10px] font-bold text-slate-300 focus:outline-none cursor-pointer outline-none"
                >
                  <option value="todas" className="bg-slate-900 text-slate-200">Todos os Dias</option>
                  <option value="Segunda" className="bg-slate-900 text-slate-200">Segunda</option>
                  <option value="Terça" className="bg-slate-900 text-slate-200">Terça</option>
                  <option value="Quarta" className="bg-slate-900 text-slate-200">Quarta</option>
                  <option value="Quinta" className="bg-slate-900 text-slate-200">Quinta</option>
                  <option value="Sexta" className="bg-slate-900 text-slate-200">Sexta</option>
                  <option value="Sábado" className="bg-slate-900 text-slate-200">Sábado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Table Matrix Header: Hourly info removed based on user request, replaced with volume rank */}
              <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-800">
                <div className="text-left">Data / Canal</div>
                <div className="text-rose-455 font-extrabold flex items-center justify-center">1º Atrito</div>
                <div className="text-rose-400/80 font-bold flex items-center justify-center">2º Atrito</div>
                <div className="text-amber-500/85 font-medium flex items-center justify-center">3º Atrito</div>
                <div className="text-slate-400 font-medium flex items-center justify-center">4º Atrito</div>
                <div className="text-slate-550 font-normal flex items-center justify-center">5º Atrito</div>
              </div>

              {/* Table Matrix Body: Rows are now Weekday Dates */}
              <div className="space-y-2 mt-2">
                {daysWithDates.map(({ day, dateStr }) => {
                  const isCurrentFilter = selectedDayFilter === "todas" || selectedDayFilter === day;

                  return (
                    <div 
                      key={day} 
                      className={`grid grid-cols-6 gap-2 items-center text-center transition-opacity duration-300 ${
                        isCurrentFilter ? "opacity-100" : "opacity-25"
                      }`}
                    >
                      {/* Left: Row Header is now Weekday and Date (Adjustment 2) */}
                      <div className="text-[10px] font-bold text-slate-400 font-mono text-left py-1 flex flex-col justify-center leading-tight">
                        <span className="text-white font-semibold text-xs">{dateStr}</span>
                        <span className="text-slate-500 font-sans text-[9px] uppercase tracking-wider">{day}</span>
                      </div>

                      {/* Remaining cols are the dynamically evaluated cards, sorted from highest-volume (intensity) to lowest-volume */}
                      {(() => {
                        // Retrieve the 5 top friction themes of the day
                        const rowCells = getDayFrictionThemes(day, dateStr);

                        return rowCells.map((cell, idx) => {
                          const cellKey = `${day}-slot-${idx}-${cell.themeName}`;
                          return (
                            <div 
                              key={cellKey} 
                              className={`py-3 px-1 text-[9px] font-extrabold rounded-lg transition-all duration-200 hover:scale-[1.03] flex items-center justify-center text-center leading-tight min-h-[48px] select-none ${getIntensityColor(cell.intensity, cell.themeName)}`}
                              title={cell.themeName !== "-" ? `Fricção em ${cell.themeName}: ${cell.intensity}%` : "Sem fricção registrada"}
                            >
                              {cell.themeName}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-medium text-slate-400">
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 bg-rose-500/20 border border-rose-500/30 rounded"></div>
              <span>Crítico (&gt;= 90% Fricção)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 bg-rose-500/10 border border-rose-500/20 rounded"></div>
              <span>Alto (75% - 89% Fricção)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 bg-amber-500/10 border border-amber-500/20 rounded"></div>
              <span>Médio (50% - 74% Fricção)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 bg-[#070a16] border border-slate-900 rounded"></div>
              <span>Baixo (&lt; 50% Fricção)</span>
            </div>
          </div>
        </div>

        {/* Right: Ranking de Atritos por Funcionalidade */}
        <div className="lg:col-span-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white font-sans tracking-tight flex items-center">
              <BarChart className="text-blue-400 mr-2" size={16} />
              Ranking de Atritos
            </h3>
            <span className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full">Por Volumetria</span>
          </div>

          <div className="space-y-4 h-[280px] overflow-y-auto pr-1">
            {sortedFrictionIndex.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-sans">
                Nenhum incidente de fricção cadastrado no momento.
              </div>
            ) : (
              sortedFrictionIndex.map((feat, idx) => {
                const maxVal = sortedFrictionIndex[0].volume;
                const pct = maxVal > 0 ? Math.round((feat.volume / maxVal) * 100) : 0;

                return (
                  <div key={feat.featureName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <span className={`font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded min-w-[24px] text-center ${
                          idx === 0 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : 
                          idx <= 2 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : 
                          "bg-slate-800/80 text-slate-400 border border-slate-700/50"
                        }`}>
                          {idx + 1}º
                        </span>
                        <span className="font-semibold text-slate-200 max-w-[200px] truncate" title={feat.featureName}>
                          {feat.featureName}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          idx === 0 ? "bg-rose-500" : idx <= 2 ? "bg-amber-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
