import React, { useState, useEffect } from "react";
import { EvaluationResult, computeCriteriaScores } from "../types";
import { 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Filter, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle,
  HelpCircle,
  Terminal,
  Search,
  Pencil,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

interface GovernanceTabProps {
  evaluations: EvaluationResult[];
  onAddEvaluation: (result: EvaluationResult) => void;
  onEditEvaluation: (result: EvaluationResult) => void;
  onDeleteEvaluation: (id: string) => void;
  selectedInteractionId: string | null;
  onSelectInteraction: (id: string | null) => void;
}

export const GovernanceTab: React.FC<GovernanceTabProps> = ({ 
  evaluations, 
  onAddEvaluation,
  onEditEvaluation,
  onDeleteEvaluation,
  selectedInteractionId,
  onSelectInteraction
}) => {
  const [inputText, setInputText] = useState("");
  const [auditDate, setAuditDate] = useState(() => {
    const today = new Date();
    // Adjust for timezone offset to get correct local date string (YYYY-MM-DD)
    const tzoffset = today.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
    return localISOTime;
  });
  const [auditTime, setAuditTime] = useState(() => {
    const today = new Date();
    const hrs = String(today.getHours()).padStart(2, "0");
    const mins = String(today.getMinutes()).padStart(2, "0");
    return `${hrs}:${mins}`; // HH:MM
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(null);
  const selectedEvaluation = evaluations.find(e => e.id === selectedInteractionId) || currentResult;
  const [apiError, setApiError] = useState<string | null>(null);

  // Operational observation & score overrides
  const [provisionalObservacao, setProvisionalObservacao] = useState("");
  const [provisionalScore, setProvisionalScore] = useState<number | "">("");
  const [provisionalSavedMsg, setProvisionalSavedMsg] = useState(false);

  // Edit record states
  const [editingResult, setEditingResult] = useState<EvaluationResult | null>(null);

  // Delete confirmation state
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editTema, setEditTema] = useState<EvaluationResult['tema']>("NF-e");

  const startEditing = (e: EvaluationResult) => {
    setEditingResult(e);
    const dateObj = new Date(e.timestamp);
    const tzoffset = dateObj.getTimezoneOffset() * 60000;
    const localDate = new Date(dateObj.getTime() - tzoffset);
    setEditDate(localDate.toISOString().slice(0, 10));
    
    const hrs = String(dateObj.getHours()).padStart(2, "0");
    const mins = String(dateObj.getMinutes()).padStart(2, "0");
    setEditTime(`${hrs}:${mins}`);
    setEditTema(e.tema);
  };

  const saveEditing = () => {
    if (!editingResult) return;
    
    let updatedTimestamp = editingResult.timestamp;
    if (editDate) {
      const timeStr = editTime || "00:00";
      const comb = new Date(`${editDate}T${timeStr}:00`);
      if (!isNaN(comb.getTime())) {
        updatedTimestamp = comb.toISOString();
      }
    }
    
    const updated: EvaluationResult = {
      ...editingResult,
      timestamp: updatedTimestamp,
      tema: editTema
    };
    
    onEditEvaluation(updated);
    setEditingResult(null);
  };

  // Filter states
  const [filterTema, setFilterTema] = useState("todos");
  const [filterClass, setFilterClass] = useState("todos");
  const [filterDate, setFilterDate] = useState("");
  const [filterScore, setFilterScore] = useState("todos");

  // Pagination states & logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Reset pagination when filter parameters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterTema, filterClass, filterDate, filterScore]);

  // Unique scores from evaluations for exact filter options
  const uniqueScores = Array.from(new Set(evaluations.map(e => e.scoreGeral)))
    .filter((s): s is number => typeof s === 'number' && !isNaN(s))
    .sort((a, b) => b - a);

  // Filtered list
  const filteredEvaluations = evaluations.filter(e => {
    if (filterTema !== "todos") {
      const matchTema = e.tema === filterTema || 
        (filterTema === "Fora do Escopo" && (e.tema === "Fora de Escopo" || e.tema === "Fora do Escopo")) ||
        (filterTema === "Baixar Xml" && (e.tema === "Baixar XML" || e.tema === "Baixar Xml"));
      if (!matchTema) return false;
    }
    if (filterClass !== "todos" && e.classificacao !== filterClass) return false;
    if (filterDate) {
      const d = new Date(e.timestamp);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const localDateStr = `${year}-${month}-${day}`;
      if (localDateStr !== filterDate) return false;
    }
    if (filterScore !== "todos") {
      if (filterScore === "100" && e.scoreGeral !== 100) return false;
      else if (filterScore === "90-100" && (e.scoreGeral < 90 || e.scoreGeral > 100)) return false;
      else if (filterScore === "80-89" && (e.scoreGeral < 80 || e.scoreGeral > 89)) return false;
      else if (filterScore === "70-79" && (e.scoreGeral < 70 || e.scoreGeral > 79)) return false;
      else if (filterScore === "50-69" && (e.scoreGeral < 50 || e.scoreGeral > 69)) return false;
      else if (filterScore === "<70" && e.scoreGeral >= 70) return false;
      else if (filterScore === "<50" && e.scoreGeral >= 50) return false;
      else if (filterScore.startsWith("exact-")) {
        const target = Number(filterScore.replace("exact-", ""));
        if (e.scoreGeral !== target) return false;
      }
    }
    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvaluations.slice(indexOfFirstItem, indexOfLastItem);

  const startRange = filteredEvaluations.length === 0 ? 0 : indexOfFirstItem + 1;
  const endRange = Math.min(indexOfLastItem, filteredEvaluations.length);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, activePage - 2);
      let end = Math.min(totalPages, activePage + 2);
      if (start === 1) {
        end = maxVisiblePages;
      } else if (end === totalPages) {
        start = totalPages - maxVisiblePages + 1;
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const handleEvaluate = async () => {
    if (!inputText.trim()) {
      setApiError("Por favor, cole uma conversa para analisar.");
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setCurrentResult(null);

    try {
      let customTimestamp = new Date().toISOString();
      if (auditDate) {
        const timeStr = auditTime || "00:00";
        const comb = new Date(`${auditDate}T${timeStr}:00`);
        if (!isNaN(comb.getTime())) {
          customTimestamp = comb.toISOString();
        }
      }

      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: inputText,
          timestamp: customTimestamp
        }),
      });

      if (!response.ok) {
        let serverError = "Resposta com erro no servidor de auditoria.";
        try {
          const errBody = await response.json();
          if (errBody && errBody.error) {
            serverError = errBody.error;
          }
        } catch (_) {}
        throw new Error(serverError);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setCurrentResult(data.result);
      setProvisionalObservacao("");
      setProvisionalScore(data.result.scoreGeral);
      setProvisionalSavedMsg(false);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Não foi possível realizar o processamento remetente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProvisionalObservation = () => {
    if (currentResult) {
      const updatedScore = provisionalScore !== "" ? Number(provisionalScore) : currentResult.scoreGeral;
      
      // Map score to classification
      let updatedClass: 'Excelente' | 'Muito Bom' | 'Aceitável' | 'Crítico' | 'Falha Grave' = 'Excelente';
      if (updatedScore >= 95) updatedClass = 'Excelente';
      else if (updatedScore >= 85) updatedClass = 'Muito Bom';
      else if (updatedScore >= 70) updatedClass = 'Aceitável';
      else if (updatedScore >= 50) updatedClass = 'Crítico';
      else updatedClass = 'Falha Grave';

      setCurrentResult({
        ...currentResult,
        scoreGeral: updatedScore,
        classificacao: updatedClass,
        observacao: provisionalObservacao
      });
      
      setProvisionalSavedMsg(true);
      setTimeout(() => {
        setProvisionalSavedMsg(false);
      }, 3000);
    }
  };

  const handleSaveResultToMainDb = () => {
    if (currentResult) {
      // Auto-apply unsaved provisional inputs for total robustness
      const updatedScore = provisionalScore !== "" ? Number(provisionalScore) : currentResult.scoreGeral;
      let updatedClass: 'Excelente' | 'Muito Bom' | 'Aceitável' | 'Crítico' | 'Falha Grave' = 'Excelente';
      if (updatedScore >= 95) updatedClass = 'Excelente';
      else if (updatedScore >= 85) updatedClass = 'Muito Bom';
      else if (updatedScore >= 70) updatedClass = 'Aceitável';
      else if (updatedScore >= 50) updatedClass = 'Crítico';
      else updatedClass = 'Falha Grave';

      const finalResult: EvaluationResult = {
        ...currentResult,
        scoreGeral: updatedScore,
        classificacao: updatedClass,
        observacao: provisionalObservacao
      };

      onAddEvaluation(finalResult);
      onSelectInteraction(finalResult.id); // Autofocus expanded details
      setInputText(""); // Reset text
      setCurrentResult(null); // Clear active analysis area
      setProvisionalObservacao("");
      setProvisionalScore("");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-white font-sans tracking-tight">Centro de Governança de IA</h2>
        <p className="text-slate-400 text-xs mt-1">
          Módulo ativo de auditorias para conversas copiadas manualmente. Cole conversas, rode testes preditivos e anexe auditorias ao banco.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Audit Evaluator */}
        <div className="lg:col-span-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white tracking-tight flex items-center">
              <Terminal className="text-blue-400 mr-2" size={16} />
              Entrada de Conversas (Copiado Manualmente)
            </h3>
            <div className="flex items-center space-x-3 text-slate-300">
              <div className="flex items-center space-x-1 px-2.5 py-1 bg-slate-950 border border-slate-850 rounded-lg">
                <span className="text-[9px] uppercase font-extrabold text-slate-500 tracking-wider">Data:</span>
                <input 
                  type="date"
                  value={auditDate}
                  onChange={(e) => setAuditDate(e.target.value)}
                  className="bg-transparent text-white border-0 text-[11px] font-semibold font-mono tracking-tight focus:outline-none focus:ring-0 w-[115px] cursor-pointer text-center"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-500">Conversa Copiada (formato CLIENTE: [...] EMIS: [...])</label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-44 p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-100"
              placeholder={`CLIENTE:\n[Mensagem do cliente...]\n\nEMIS:\n[Resposta da Emis...]`}
            />
          </div>

          {apiError && (
            <div className="p-3 bg-rose-500/15 text-rose-400 rounded-xl border border-rose-500/25 text-xs font-semibold leading-relaxed">
              {apiError}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button 
              onClick={handleEvaluate}
              disabled={isLoading}
              className="w-full md:w-auto bg-slate-950 border border-slate-850 text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-slate-850 hover:border-slate-800 flex items-center justify-center space-x-1.5 focus:outline-none cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processando Auditoria...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-emerald-450 animate-pulse" />
                  <span>Auditar Atendimento</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Result Area if exists */}
          {currentResult && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                <span className="text-[10px] uppercase font-extrabold text-blue-400 tracking-wider flex items-center">
                  <Sparkles className="text-blue-400 mr-1.5" size={12} />
                  Resultado Provisório
                </span>
                <span className="text-slate-500 text-[10px]">Não sincronizado</span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-white text-xs font-sans">Score Geral Prometido</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Cálculo de conformidade do emissor</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-white font-mono">{currentResult.scoreGeral}%</span>
                  <p className="text-[10px] font-bold text-blue-400">{currentResult.classificacao}</p>
                </div>
              </div>

              <div className="text-xs text-slate-300 font-medium bg-slate-900 p-3 rounded-lg border border-slate-850 leading-relaxed">
                <span className="font-bold text-white">Resumo Executivo:</span> {currentResult.resumoExecutivo}
              </div>

              {/* Observação do Auditor (Correção / Erro da IA) */}
              <div className="pt-2 border-t border-slate-900 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                    Observação do Auditor (Opcional - Correção de Desvio)
                  </span>
                  {currentResult.observacao && (
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-550/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      Salvo
                    </span>
                  )}
                </div>

                <textarea
                  value={provisionalObservacao}
                  onChange={(e) => setProvisionalObservacao(e.target.value)}
                  className="w-full h-16 p-2 bg-slate-900 border border-slate-850 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-550 text-slate-200 resize-none placeholder:text-slate-500"
                  placeholder="Se percebeu algum erro na auditoria de IA, detalhe a sua observação aqui para nosso treinamento..."
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-450">Corrigir Score (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={provisionalScore}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setProvisionalScore("");
                        } else {
                          const num = Math.max(0, Math.min(100, Number(val)));
                          setProvisionalScore(num);
                        }
                      }}
                      className="w-14 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveProvisionalObservation}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg flex items-center justify-center cursor-pointer transition focus:outline-none"
                  >
                    Salvar Observação
                  </button>
                </div>

                {provisionalSavedMsg && (
                  <p className="text-[9px] text-emerald-450 font-bold text-right animate-pulse">
                    ✓ Observação e score salvos no resultado provisório!
                  </p>
                )}
              </div>

              <button 
                onClick={handleSaveResultToMainDb}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-blue-500/10 font-sans"
              >
                <Plus size={14} />
                <span>Anexar Log ao Banco Geral de Governança</span>
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Active Interactive Auditor & Log Inspect Panel */}
        <div className="lg:col-span-6 space-y-6">
          
          {selectedEvaluation ? (
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-5">
              
              {/* Header Box */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[9px] bg-blue-500/15 text-blue-400 font-bold px-2.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest font-mono">
                    Auditoria ID: {selectedEvaluation.id}
                  </span>
                  <h3 className="text-md font-bold text-white font-sans mt-1">Conformidade e Monitoria</h3>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-xl font-mono font-extrabold text-emerald-400">{selectedEvaluation.scoreGeral}%</p>
                  <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">{selectedEvaluation.classificacao}</p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Resumo Executivo</p>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                  {selectedEvaluation.resumoExecutivo}
                </p>
              </div>

              {/* Criteria breakdown */}
              {(() => {
                const criteriaDetails = computeCriteriaScores(selectedEvaluation);
                const totalPoints = criteriaDetails.reduce((acc, c) => acc + c.pontos, 0);

                return (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Análise de Critérios (Ponderada)</p>
                      <span className="text-[10px] font-mono text-slate-400">
                        Total Ponderado: <strong className="text-emerald-400">{totalPoints}p</strong> / 100p
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                      {criteriaDetails.map((criterion) => {
                        const isConforme = criterion.status === 'conforme';
                        const isParcial = criterion.status === 'parcial';

                        // Opção 2: Pontuação Parcial nos Cards
                        // Se conforme: Conforme [30p]
                        // Se parcial (ex: markdown): Divergente [12/20p] em amber
                        // Se divergente (0p): Divergente [0/20p] em rose
                        const badgeLabel = isConforme
                          ? `Conforme [${criterion.max}p]`
                          : isParcial
                            ? `Divergente [${criterion.pontos}/${criterion.max}p]`
                            : `Divergente [0/${criterion.max}p]`;

                        const colorClass = isConforme
                          ? "text-emerald-400"
                          : isParcial
                            ? "text-amber-400"
                            : "text-rose-400";

                        const titleText = isConforme
                          ? `Critério 100% conforme: ${criterion.pontos} de ${criterion.max} pontos obtidos.`
                          : isParcial
                            ? `Critério com pontuação parcial: ${criterion.pontos} de ${criterion.max} pontos obtidos.${criterion.motivo ? ` (${criterion.motivo})` : ''}`
                            : `Critério não atendido: 0 de ${criterion.max} pontos.${criterion.motivo ? ` (${criterion.motivo})` : ''}`;

                        return (
                          <div 
                            key={criterion.key}
                            title={titleText}
                            className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-850 hover:border-slate-750 transition-colors"
                          >
                            <span className="text-slate-400">{criterion.label}:</span>
                            <span className={`font-bold ${colorClass}`}>
                              {badgeLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Composição exata da soma */}
                    <div className="bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-850/80 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>
                        Composição: <span className="text-slate-300">{criteriaDetails.map(c => `${c.pontos}p`).join(' + ')}</span>
                      </span>
                      <span className="font-semibold text-emerald-400">
                        = {totalPoints} pontos ({selectedEvaluation.scoreGeral}%)
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Technical indicators */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Indicador Técnico</p>
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between"><span className="text-slate-450">Resolveu a Dúvida:</span><span className="font-bold text-slate-200">{selectedEvaluation.resolveuDuvida ? 'Sim' : 'Não'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-450">Fora do Escopo:</span><span className="font-bold text-slate-200">{selectedEvaluation.foraDoEscopo ? 'Sim' : 'Não'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-455 text-slate-450">Rejeição Sefaz:</span><span className="font-bold text-slate-200">{selectedEvaluation.sinaisRiscoCliente.rejeicoesSefaz ? 'Sim' : 'Não'}</span></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Erros e Riscos</p>
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between"><span className="text-slate-455 text-slate-450">Categoria de Erro:</span><span className="font-bold text-rose-400">{selectedEvaluation.categoriaErro || "Nenhum"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-455 text-slate-450">Nível de Risco:</span><span className="font-bold text-rose-450 text-rose-400">{selectedEvaluation.nivelDeRisco || "Nenhum"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-455 text-slate-450">Alerte Suporte (N1):</span><span className="font-bold text-slate-200">{selectedEvaluation.encaminhadoSuporte ? 'Sim' : 'Não'}</span></div>
                  </div>
                </div>
              </div>

              {/* Suggested Improvement */}
              <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-850">
                <p className="text-[10px] uppercase font-bold text-emerald-450 tracking-wider font-sans">Engenharia de Prompt: Melhoria Recomendada</p>
                <p className="text-xs font-semibold mt-1 text-slate-200">{selectedEvaluation.promptMelhoria.melhoriaSugerida}</p>
                <p className="text-[10px] text-slate-450 mt-1">Ação: {selectedEvaluation.promptMelhoria.acaoRecomendada}</p>
              </div>

              {/* Option to clear analysis selection */}
              {selectedInteractionId && (
                <div className="flex justify-end border-t border-slate-800 pt-3">
                  <button 
                    onClick={() => onSelectInteraction(null)}
                    className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer underline focus:outline-none"
                  >
                    Fechar Inspeção
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-900 p-12 rounded-2xl border border-dashed border-slate-800 text-center flex flex-col items-center justify-center space-y-3 h-full min-h-[300px]">
              <CheckCircle size={36} className="text-slate-700" />
              <h3 className="font-bold text-slate-455 text-sm font-sans">Nenhum Registro Inspecionado</h3>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed font-sans">
                Selecione uma linha no histórico abaixo ou rode uma auditoria no avaliador à esquerda para inspecionar os detalhes finos do Atendimento.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Audit Log database explorer */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden text-white">
        <div className="p-6 border-b border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-sans tracking-tight">Banco Integrado de Auditorias</h3>
            <p className="text-slate-404 text-slate-400 text-xs">Explore todos os diálogos avaliados do emissor</p>
          </div>

          {/* Filtering bar */}
          <div className="flex flex-wrap gap-4 text-xs font-medium font-sans">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-500 font-bold">Filtrar Tema</label>
              <select 
                value={filterTema} 
                onChange={(e) => setFilterTema(e.target.value)}
                className="block w-44 bg-slate-950 border border-slate-850 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-slate-700 text-slate-200"
              >
                <option value="todos">Todos os temas</option>
                <option value="Certificados">Certificados</option>
                <option value="NF-e">NF-e</option>
                <option value="MDF-e">MDF-e</option>
                <option value="NFS-e">NFS-e</option>
                <option value="Tributação">Tributação</option>
                <option value="Participantes">Participantes</option>
                <option value="Produtos">Produtos</option>
                <option value="Rejeições SEFAZ">Rejeições SEFAZ</option>
                <option value="IBS/CBS">IBS/CBS</option>
                <option value="Acesso ao Emissor">Acesso ao Emissor</option>
                <option value="Localização de Notas">Localização de Notas</option>
                <option value="Baixar Xml">Baixar Xml</option>
                <option value="Inutilização">Inutilização</option>
                <option value="Fora do Escopo">Fora do Escopo</option>
                <option value="Relatório Excel">Relatório Excel</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-500 font-bold">Classificação</label>
              <select 
                value={filterClass} 
                onChange={(e) => setFilterClass(e.target.value)}
                className="block w-36 bg-slate-950 border border-slate-850 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-slate-700 text-slate-200"
              >
                <option value="todos">Todas</option>
                <option value="Excelente">Excelente</option>
                <option value="Muito Bom">Muito Bom</option>
                <option value="Aceitável">Aceitável</option>
                <option value="Crítico">Crítico</option>
                <option value="Falha Grave">Falha Grave</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-500 font-bold">Data Auditoria</label>
              <div className="flex items-center gap-1.5">
                <input 
                  type="date"
                  value={filterDate} 
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="block w-40 bg-slate-950 border border-slate-850 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-slate-700 text-slate-200 text-xs cursor-pointer select-none"
                  style={{ colorScheme: "dark" }}
                />
                {filterDate && (
                  <button 
                    type="button"
                    onClick={() => setFilterDate("")}
                    className="bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer focus:outline-none"
                    title="Limpar data"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-500 font-bold">SCORE</label>
              <div className="flex items-center gap-1.5">
                <select 
                  value={filterScore} 
                  onChange={(e) => setFilterScore(e.target.value)}
                  className="block w-40 bg-slate-950 border border-slate-850 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-slate-700 text-slate-200"
                >
                  <option value="todos">Todos os scores</option>
                  <optgroup label="Faixas de Score">
                    <option value="100">Nota 100 (Máxima)</option>
                    <option value="90-100">90 - 100 (Excelente)</option>
                    <option value="80-89">80 - 89 (Muito Bom)</option>
                    <option value="70-79">70 - 79 (Aceitável)</option>
                    <option value="50-69">50 - 69 (Atenção)</option>
                    <option value="<70">Abaixo de 70 (&lt; 70)</option>
                    <option value="<50">Abaixo de 50 (&lt; 50)</option>
                  </optgroup>
                  {uniqueScores.length > 0 && (
                    <optgroup label="Notas Específicas">
                      {uniqueScores.map(score => (
                        <option key={score} value={`exact-${score}`}>
                          Nota {score}%
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
                {filterScore !== "todos" && (
                  <button 
                    type="button"
                    onClick={() => setFilterScore("todos")}
                    className="bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer focus:outline-none"
                    title="Limpar filtro de score"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-850 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <th className="py-3.5 px-6">Identificador</th>
                <th className="py-3.5 px-6">Data Auditoria</th>
                <th className="py-3.5 px-6">Tema</th>
                <th className="py-3.5 px-6">Cliente Parceiro</th>
                <th className="py-3.5 px-6 text-center">Score</th>
                <th className="py-3.5 px-6">Inspeções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {currentItems.map((e) => (
                <tr key={e.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-white">{e.id}</td>
                  <td className="py-4 px-6 text-slate-400">
                    {new Date(e.timestamp).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-4 px-6 font-semibold text-blue-400 font-mono">{e.tema}</td>
                  <td className="py-4 px-6 text-slate-300 truncate max-w-[150px]" title={e.clienteIdentificado}>
                    {e.clienteIdentificado || "Não identificado"}
                  </td>
                  <td className="py-4 px-6 text-center font-bold font-mono">
                    <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                      e.scoreGeral >= 95 ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20" :
                      e.scoreGeral >= 85 ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      e.scoreGeral >= 70 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-rose-500/10 text-rose-455 text-rose-400 border border-rose-500/20"
                    }`}>
                      {e.scoreGeral}%
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onSelectInteraction(e.id)}
                        className="bg-slate-950 hover:bg-blue-600/10 border border-slate-850 hover:border-blue-500/20 text-slate-400 hover:text-blue-400 p-1.5 rounded-lg cursor-pointer focus:outline-none transition-all duration-150"
                        title="Ver Audit Trail"
                      >
                        <Eye size={13} />
                      </button>

                      <button 
                        onClick={() => startEditing(e)}
                        className="bg-slate-950 hover:bg-amber-600/10 border border-slate-850 hover:border-amber-500/20 text-slate-400 hover:text-amber-400 p-1.5 rounded-lg cursor-pointer focus:outline-none transition-all duration-150"
                        title="Editar Registro"
                      >
                        <Pencil size={13} />
                      </button>

                      <button 
                        onClick={() => {
                          setDeleteConfirmationId(e.id);
                        }}
                        className="bg-slate-950 hover:bg-rose-600/10 border border-slate-850 hover:border-rose-500/20 text-slate-400 hover:text-rose-450 p-1.5 rounded-lg cursor-pointer focus:outline-none transition-all duration-150"
                        title="Excluir Registro"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEvaluations.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                    Nenhuma auditoria encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filteredEvaluations.length > 0 && (
          <div className="bg-[#0c1220]/70 px-6 py-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-sans text-slate-400">
              Mostrando <span className="font-bold text-slate-200">{startRange}</span> a{" "}
              <span className="font-bold text-slate-200">{endRange}</span> de{" "}
              <span className="font-bold text-slate-200">{filteredEvaluations.length}</span> atendimentos auditados
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center space-x-1.5 pb-1 sm:pb-0">
                {/* Chevrons Left */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={activePage === 1}
                  className="p-2 rounded-lg border border-slate-850 bg-slate-950 hover:bg-slate-850 disabled:opacity-30 disabled:hover:bg-slate-950 text-slate-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                  title="Primeira Página"
                >
                  <ChevronsLeft size={13} />
                </button>
                
                {/* Chevron Left */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={activePage === 1}
                  className="p-2 rounded-lg border border-slate-850 bg-slate-950 hover:bg-slate-850 disabled:opacity-30 disabled:hover:bg-slate-955 text-slate-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                  title="Página Anterior"
                >
                  <ChevronLeft size={13} />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus:outline-none flex items-center justify-center ${
                      pageNum === activePage
                        ? "bg-blue-600 border border-blue-500 text-white shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                        : "border border-slate-850 bg-slate-900/60 hover:bg-slate-850 text-slate-300 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Chevron Right */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={activePage === totalPages}
                  className="p-2 rounded-lg border border-slate-850 bg-slate-950 hover:bg-slate-850 disabled:opacity-30 disabled:hover:bg-slate-950 text-slate-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                  title="Próxima Página"
                >
                  <ChevronRight size={13} />
                </button>

                {/* Chevrons Right */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={activePage === totalPages}
                  className="p-2 rounded-lg border border-slate-850 bg-slate-950 hover:bg-slate-850 disabled:opacity-30 disabled:hover:bg-slate-950 text-slate-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                  title="Última Página"
                >
                  <ChevronsRight size={13} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {deleteConfirmationId && (
        <div className="fixed inset-0 bg-[#020617]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between pb-2 border-b border-slate-850">
              <div className="flex items-center space-x-2 text-rose-450">
                <AlertTriangle size={18} />
                <h4 className="font-bold text-sm text-white font-sans">Excluir Auditoria</h4>
              </div>
              <button 
                onClick={() => setDeleteConfirmationId(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="text-slate-300 text-xs leading-relaxed space-y-2">
              <p>
                Deseja realmente excluir esta auditoria permanentemente?
              </p>
              <div className="p-2.5 bg-[#020617]/50 border border-slate-850 rounded-lg font-mono text-[10px] text-slate-400 break-all">
                ID: {deleteConfirmationId}
              </div>
              <p className="text-rose-450 text-[10px] uppercase font-bold tracking-tight">
                Atenção: Esta ação não poderá ser desfeita.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-850 text-xs">
              <button 
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  onDeleteEvaluation(deleteConfirmationId);
                  setDeleteConfirmationId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {editingResult && (
        <div className="fixed inset-0 bg-[#020617]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h4 className="font-bold text-sm text-white font-sans">Editar Registro de Auditoria</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{editingResult.id}</p>
              </div>
              <button 
                onClick={() => setEditingResult(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 block">Data da Auditoria</label>
                <div className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-950 border border-slate-850 rounded-lg">
                  <span className="text-[8px] uppercase font-extrabold text-slate-500 tracking-wider">Data:</span>
                  <input 
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="bg-transparent text-white border-0 text-[11px] font-semibold font-mono tracking-tight focus:outline-none focus:ring-0 w-full cursor-pointer text-center"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 block">Tema do Atendimento</label>
                <select 
                  value={editTema} 
                  onChange={(e) => setEditTema(e.target.value as EvaluationResult['tema'])}
                  className="block w-full bg-slate-950 border border-slate-850 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-200"
                >
                  <option value="Certificados">Certificados</option>
                  <option value="NF-e">NF-e</option>
                  <option value="MDF-e">MDF-e</option>
                  <option value="NFS-e">NFS-e</option>
                  <option value="Tributação">Tributação</option>
                  <option value="Participantes">Participantes</option>
                  <option value="Produtos">Produtos</option>
                  <option value="Natureza de Operação">Natureza de Operação</option>
                  <option value="Rejeições SEFAZ">Rejeições SEFAZ</option>
                  <option value="Módulo de Segurança">Módulo de Segurança</option>
                  <option value="Cancelamento">Cancelamento</option>
                  <option value="Carta de Correção">Carta de Correção</option>
                  <option value="Inutilização">Inutilização</option>
                  <option value="IBS/CBS">IBS/CBS</option>
                  <option value="Importação">Importação</option>
                  <option value="Acesso ao Emissor">Acesso ao Emissor</option>
                  <option value="Localização de Notas">Localização de Notas</option>
                  <option value="Baixar Xml">Baixar Xml</option>
                  <option value="Fora do Escopo">Fora do Escopo</option>
                  <option value="Relatório Excel">Relatório Excel</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800 text-xs">
              <button 
                onClick={() => setEditingResult(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={saveEditing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
