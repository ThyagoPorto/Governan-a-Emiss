import React, { useState } from "react";
import { INITIAL_EVALUATIONS } from "./data";
import { EvaluationResult } from "./types";
import { OverviewTab } from "./components/OverviewTab";
import { AIQualityTab } from "./components/AIQualityTab";
import { ClientIntelligenceTab } from "./components/ClientIntelligenceTab";
import { ProductIntelligenceTab } from "./components/ProductIntelligenceTab";
import { PromptEngineeringTab } from "./components/PromptEngineeringTab";
import { GovernanceTab } from "./components/GovernanceTab";
import { AutomationTab } from "./components/AutomationTab";
import { ExecutiveReportsTab } from "./components/ExecutiveReportsTab";
import { collection, setDoc, doc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";

import { 
  BarChart2, 
  CheckCircle, 
  Users, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  Percent, 
  FileText, 
  Sparkles,
  Search,
  Menu,
  X
} from "lucide-react";

export default function App() {
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>(() => {
    try {
      const saved = localStorage.getItem("sieg_governance_evaluations");
      return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage:", e);
      return INITIAL_EVALUATIONS;
    }
  });
  const [selectedTab, setSelectedTab] = useState<string>("Visão Geral");
  const [selectedMonth, setSelectedMonth] = useState<string>("Todos");
  const [selectedInteractionId, setSelectedInteractionId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter evaluations by selected month
  const filteredEvaluations = React.useMemo(() => {
    return evaluations.filter((e) => {
      if (selectedMonth === "Todos") return true;
      return e.timestamp.startsWith(selectedMonth);
    });
  }, [evaluations, selectedMonth]);

  // Synchronize evaluations state back to localStorage
  React.useEffect(() => {
    try {
      if (evaluations) {
        localStorage.setItem("sieg_governance_evaluations", JSON.stringify(evaluations));
      }
    } catch (e) {
      console.error("Erro ao salvar dados no localStorage:", e);
    }
  }, [evaluations]);

  React.useEffect(() => {
    // Set up real-time binding stream with Firestore
    const q = query(collection(db, "evaluations"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: EvaluationResult[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as EvaluationResult);
      });
      
      if (list.length > 0) {
        setEvaluations(list);
        try {
          localStorage.setItem("sieg_governance_initialized", "true");
        } catch (err) {
          console.error("Error writing initialization flag:", err);
        }
      } else {
        // If Firestore is empty, check if we have already been initialized on this client
        const initialized = localStorage.getItem("sieg_governance_initialized");
        if (initialized === "true") {
          // This represents a deliberate choice is to keep the state empty or clear
          setEvaluations([]);
        } else {
          // First-time load or new deployment: Seed Firestore with default/cached items
          const cached = localStorage.getItem("sieg_governance_evaluations");
          let fallback = INITIAL_EVALUATIONS;
          try {
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) {
                fallback = parsed;
              }
            }
          } catch (err) {
            console.error("Error parsing cached evaluations:", err);
          }

          // Instantly display fallback in UI to secure visual responsiveness
          setEvaluations(fallback);
          try {
            localStorage.setItem("sieg_governance_initialized", "true");
          } catch (err) {
            console.error("Error writing initialization flag:", err);
          }

          // Seed empty Firestore in the background
          if (fallback && fallback.length > 0) {
            fallback.forEach(async (item: EvaluationResult) => {
              try {
                await setDoc(doc(db, "evaluations", item.id), item);
              } catch (err) {
                console.error("Error populating default evaluations in Firestore:", err);
              }
            });
          }
        }
      }
    }, (error) => {
      console.warn("Firestore collection stream received an error event:", error);
      try {
        handleFirestoreError(error, OperationType.LIST, "evaluations");
      } catch (err) {
        console.log("Quietly logged and absorbed sync error to protect application runtime.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Appends new audited logs and automatically sets selected interaction focus
  const handleAddEvaluation = async (newEval: EvaluationResult) => {
    // 1. Optimistic local UI update
    setEvaluations(prev => [newEval, ...prev]);
    // 2. Persist to real-time Cloud Firestore database
    try {
      await setDoc(doc(db, "evaluations", newEval.id), newEval);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `evaluations/${newEval.id}`);
    }
  };

  const handleEditEvaluation = async (updatedEval: EvaluationResult) => {
    setEvaluations(prev => prev.map(e => e.id === updatedEval.id ? updatedEval : e));
    try {
      await setDoc(doc(db, "evaluations", updatedEval.id), updatedEval);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `evaluations/${updatedEval.id}`);
    }
  };

  const handleDeleteEvaluation = async (id: string) => {
    setEvaluations(prev => prev.filter(e => e.id !== id));
    if (selectedInteractionId === id) {
      setSelectedInteractionId(null);
    }
    try {
      await deleteDoc(doc(db, "evaluations", id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `evaluations/${id}`);
    }
  };

  const handleSelectInteractionFromOverview = (id: string) => {
    setSelectedInteractionId(id);
    setSelectedTab("Governança");
  };

  const menuItems = [
    { name: "Visão Geral", icon: BarChart2, color: "text-indigo-600" },
    { name: "Qualidade da IA", icon: CheckCircle, color: "text-emerald-600" },
    { name: "Inteligência de Clientes", icon: Users, color: "text-emerald-600" },
    { name: "Inteligência de Produto", icon: Layers, color: "text-indigo-600" },
    { name: "Engenharia de Prompt", icon: Sliders, color: "text-indigo-600" },
    { name: "Governança", icon: ShieldCheck, color: "text-indigo-600" },
    { name: "Relatórios Executivos", icon: FileText, color: "text-slate-600" },
  ];

  const renderActiveTab = () => {
    switch (selectedTab) {
      case "Visão Geral":
        return (
          <OverviewTab 
            evaluations={filteredEvaluations} 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onSelectInteraction={handleSelectInteractionFromOverview}
            onNavigateToTab={(tabName) => setSelectedTab(tabName)}
          />
        );
      case "Qualidade da IA":
        return (
          <AIQualityTab 
            evaluations={filteredEvaluations} 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        );
      case "Inteligência de Clientes":
        return (
          <ClientIntelligenceTab 
            evaluations={filteredEvaluations} 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        );
      case "Inteligência de Produto":
        return (
          <ProductIntelligenceTab 
            evaluations={evaluations} 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        );
      case "Engenharia de Prompt":
        return <PromptEngineeringTab evaluations={filteredEvaluations} />;
      case "Governança":
        return (
          <GovernanceTab 
            evaluations={evaluations} 
            onAddEvaluation={handleAddEvaluation}
            onEditEvaluation={handleEditEvaluation}
            onDeleteEvaluation={handleDeleteEvaluation}
            selectedInteractionId={selectedInteractionId}
            onSelectInteraction={(id) => setSelectedInteractionId(id)}
          />
        );
      case "Automação":
        return <AutomationTab evaluations={filteredEvaluations} />;
      case "Relatórios Executivos":
        return (
          <ExecutiveReportsTab 
            evaluations={evaluations} 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        );
      default:
        return (
          <OverviewTab 
            evaluations={filteredEvaluations} 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onSelectInteraction={handleSelectInteractionFromOverview} 
            onNavigateToTab={setSelectedTab} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col md:flex-row antialiased">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0B0F19] border-b border-slate-800 text-white p-4 flex justify-between items-center z-20">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-tight font-sans">SIEG AI Governance</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-slate-400 hover:text-white transition focus:outline-none"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Sidebar (Desktop & Mobile Panel) */}
      <aside className={`
        fixed inset-y-0 left-0 bg-[#0B0F19] border-r border-slate-800 text-slate-200 w-64 p-6 flex flex-col justify-between z-30 transition-transform duration-300 transform md:translate-x-0 md:relative md:flex shrink-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Brand Container */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 rounded-lg shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="20" fill="#FF1155" />
                <rect x="14.5" y="14.5" width="71" height="71" rx="4" fill="white" />
                {/* Monogram NF */}
                <rect x="21.5" y="30" width="10.1" height="40.8" rx="2" fill="#FF1155" />
                <polygon points="21.5,30 31.6,30 58.1,70.8 48,70.8" fill="#FF1155" />
                <rect x="48" y="30" width="10.1" height="40.8" rx="2" fill="#FF1155" />
                <rect x="48" y="30" width="29.5" height="7.8" rx="1.5" fill="#FF1155" />
                <rect x="61.2" y="45.4" width="9.6" height="8" rx="1.5" fill="#FF1155" />
              </svg>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white leading-tight">SIEG Governance</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-0.5">AI Center - Emis</p>
              </div>
            </div>
            {/* Direct close on mobile selection */}
            <button className="md:hidden text-slate-500 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setSelectedTab(item.name);
                    setMobileMenuOpen(false); // Auto close mobile drawer
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-all border ${
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 border-blue-600/20" 
                      : "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-blue-400" : "text-slate-400"} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="pt-4 border-t border-slate-800 text-slate-500 text-[10px] space-y-1.5 font-sans">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] text-slate-500">Emis Engine 4.2.0-stable</span>
          </div>
          <p className="leading-relaxed">Emis Oficial Prompt v3.5-flash.</p>
          <p className="text-slate-600 font-mono text-[9px]">&copy; 2026 SIEG Soluções</p>
        </div>
      </aside>

      {/* Main App Workspace */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto space-y-6">
        {renderActiveTab()}
      </main>

    </div>
  );
}
