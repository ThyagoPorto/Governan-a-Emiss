export interface HallucinationDetails {
  houveAlucinacao: boolean;
  nivel: 'Nenhum' | 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  explicacao: string;
}

export interface PromptImprovement {
  categoriaFalha: string;
  melhoriaSugerida: string;
  acaoRecomendada: string;
  impacto: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
}

export interface CriterionScore {
  pontos: number;
  max: number;
  motivo?: string;
}

export interface DetailedCriteriaScores {
  respostaCorreta: CriterionScore;
  semAlucinacao: CriterionScore;
  aderenciaPrompt: CriterionScore;
  clareza: CriterionScore;
  seguranca: CriterionScore;
  personaEmis: CriterionScore;
}

export interface CriterionDetail {
  key: keyof DetailedCriteriaScores;
  label: string;
  max: number;
  pontos: number;
  status: 'conforme' | 'parcial' | 'divergente';
  motivo?: string;
}

export interface EvaluationResult {
  id: string; // unique ID
  timestamp: string; // ISO date
  rawText: string; // original copied convo
  clienteMsg: string; // extracted client messages
  emisMsg: string; // extracted Emis messages
  clienteIdentificado?: string; // name/CNPJ if found
  
  resumoExecutivo: string;
  scoreGeral: number; // 0-100
  classificacao: 'Excelente' | 'Muito Bom' | 'Aceitável' | 'Crítico' | 'Falha Grave';
  
  // Criteria Breakdown
  respostaCorreta: boolean;
  semAlucinacao: boolean;
  aderenciaPrompt: boolean;
  clareza: boolean;
  seguranca: boolean;
  personaEmis: boolean;
  pontuacaoDetalhada?: DetailedCriteriaScores;
  
  // Specific checks
  houveAlucinacao: boolean;
  alucinacaoDetalhe: HallucinationDetails;
  
  seguiuOriginalPrompt: boolean;
  resolveuDuvida: boolean;
  categoriaErro: 'Nenhuma' | 'Conhecimento' | 'Alucinação' | 'Comunicação' | 'Escopo' | 'Segurança' | 'Diagnóstico' | 'Fluxo de Atendimento' | 'Ambiguidade' | 'Encerramento' | 'Persona';
  nivelDeRisco: 'Nenhum' | 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  
  // Prompt engineering
  promptMelhoria: PromptImprovement;
  
  // Topic and Business intelligence
  tema: 'Certificados' | 'NF-e' | 'MDF-e' | 'NFS-e' | 'Tributação' | 'Participantes' | 'Produtos' | 'Natureza de Operação' | 'Rejeições SEFAZ' | 'Módulo de Segurança' | 'Cancelamento' | 'Carta de Correção' | 'Inutilização' | 'IBS/CBS' | 'Importação' | 'Acesso ao Emissor' | 'Localização de Notas' | 'Baixar Xml' | 'Baixar XML' | 'Fora do Escopo' | 'Fora de Escopo' | 'Relatório Excel';
  
  // IA Governance indicators
  foraDoEscopo: boolean;
  riscoSeguranca: boolean;
  encaminhadoSuporte: boolean;
  
  // Client Risk indicators
  sinaisRiscoCliente: {
    duvidasRepetidas: boolean;
    falhasConsecutivas: boolean;
    errosEmissao: boolean;
    rejeicoesSefaz: boolean;
    problemasCertificados: boolean;
  };
  riscoClienteClassificacao: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  observacao?: string;
}

export interface FeatureFriction {
  featureName: string;
  volume: number;
  impactClient: number; // 1-10
  impactSupport: number; // 1-10
  impactCS: number; // 1-10
  tendency: 'Crescimento' | 'Estável' | 'Queda';
}

export interface FrictionHeatmapItem {
  hour: string; // coordinate 1
  dayOfWeek: string; // coordinate 2
  intensity: number; // 1-100
}

export function computeCriteriaScores(evaluation: EvaluationResult): CriterionDetail[] {
  const criteriaDef: { key: keyof DetailedCriteriaScores; boolKey: 'respostaCorreta' | 'semAlucinacao' | 'aderenciaPrompt' | 'clareza' | 'seguranca' | 'personaEmis'; label: string; max: number }[] = [
    { key: 'respostaCorreta', boolKey: 'respostaCorreta', label: 'Resposta Correta', max: 30 },
    { key: 'semAlucinacao', boolKey: 'semAlucinacao', label: 'Sem Alucinação', max: 25 },
    { key: 'aderenciaPrompt', boolKey: 'aderenciaPrompt', label: 'Aderência Prompt', max: 20 },
    { key: 'clareza', boolKey: 'clareza', label: 'Clareza Linguística', max: 10 },
    { key: 'seguranca', boolKey: 'seguranca', label: 'Segurança de Dados', max: 10 },
    { key: 'personaEmis', boolKey: 'personaEmis', label: 'Persona Emis', max: 5 },
  ];

  const target = Math.max(0, Math.min(100, Math.round(evaluation.scoreGeral)));

  // If pontuacaoDetalhada is already provided by Gemini or backend
  if (evaluation.pontuacaoDetalhada) {
    const rawScores = criteriaDef.map(c => {
      const item = evaluation.pontuacaoDetalhada?.[c.key];
      const max = c.max;
      const pontos = typeof item?.pontos === 'number' 
        ? Math.max(0, Math.min(max, Math.round(item.pontos))) 
        : (evaluation[c.boolKey] ? max : 0);
      return {
        key: c.key,
        label: c.label,
        max,
        pontos,
        motivo: item?.motivo,
      };
    });

    let currentSum = rawScores.reduce((acc, curr) => acc + curr.pontos, 0);
    let delta = target - currentSum;

    // Harmonize any small rounding difference so the sum matches target 100%
    if (delta !== 0) {
      for (const r of rawScores) {
        if (delta === 0) break;
        if (delta > 0 && r.pontos < r.max) {
          const add = Math.min(delta, r.max - r.pontos);
          r.pontos += add;
          delta -= add;
        } else if (delta < 0 && r.pontos > 0) {
          const sub = Math.min(Math.abs(delta), r.pontos);
          r.pontos -= sub;
          delta += sub;
        }
      }
    }

    return rawScores.map(r => ({
      ...r,
      status: r.pontos === r.max ? 'conforme' : (r.pontos > 0 ? 'parcial' : 'divergente'),
    }));
  }

  // Dynamic calculation for existing/historical evaluations lacking pontuacaoDetalhada
  const bools = criteriaDef.map(c => ({
    ...c,
    isConforme: Boolean(evaluation[c.boolKey]),
  }));

  const trueSum = bools.filter(b => b.isConforme).reduce((acc, curr) => acc + curr.max, 0);
  const falseList = bools.filter(b => !b.isConforme);
  const falseMaxSum = falseList.reduce((acc, curr) => acc + curr.max, 0);

  const scores: { [key: string]: number } = {};

  if (target >= trueSum) {
    // All conformant criteria receive full points
    bools.filter(b => b.isConforme).forEach(b => { scores[b.key] = b.max; });
    // Divergent criteria split the remaining points up to target
    let remaining = target - trueSum;
    if (falseList.length > 0) {
      falseList.forEach((b, idx) => {
        if (idx === falseList.length - 1) {
          scores[b.key] = Math.min(b.max, Math.max(0, remaining));
        } else {
          const share = Math.round((b.max / (falseMaxSum || 1)) * (target - trueSum));
          const allocated = Math.min(b.max, Math.max(0, share));
          scores[b.key] = allocated;
          remaining -= allocated;
        }
      });
    }
  } else {
    // If target is lower than trueSum, divergent get 0 and conformant absorb the deduction
    falseList.forEach(b => { scores[b.key] = 0; });
    let remaining = target;
    const trueList = bools.filter(b => b.isConforme);
    trueList.forEach((b, idx) => {
      if (idx === trueList.length - 1) {
        scores[b.key] = Math.min(b.max, Math.max(0, remaining));
      } else {
        const share = Math.round((b.max / (trueSum || 1)) * target);
        const allocated = Math.min(b.max, Math.max(0, share));
        scores[b.key] = allocated;
        remaining -= allocated;
      }
    });
  }

  // Fine-tune remainder so sum(scores) strictly equals target
  let currentSum = criteriaDef.reduce((acc, c) => acc + (scores[c.key] || 0), 0);
  let delta = target - currentSum;
  for (const c of criteriaDef) {
    if (delta === 0) break;
    if (delta > 0 && scores[c.key] < c.max) {
      const add = Math.min(delta, c.max - scores[c.key]);
      scores[c.key] += add;
      delta -= add;
    } else if (delta < 0 && scores[c.key] > 0) {
      const sub = Math.min(Math.abs(delta), scores[c.key]);
      scores[c.key] -= sub;
      delta += sub;
    }
  }

  return criteriaDef.map(c => {
    const pontos = scores[c.key] ?? 0;
    return {
      key: c.key,
      label: c.label,
      max: c.max,
      pontos,
      status: pontos === c.max ? 'conforme' : (pontos > 0 ? 'parcial' : 'divergente'),
    };
  });
}

