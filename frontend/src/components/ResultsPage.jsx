import React, { useState } from "react";
import KidneyViewer from "../components/KidneyViewer";
import { Activity, ArrowLeft, FileText, Pill, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";


export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const [selectedDrug, setSelectedDrug] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [drugDose, setDrugDose] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateDrugDose = async (drug) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/calculate-drug-dose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drug: drug,
          gfr_final: result.gfr_final,
          creatinine: result.creatinine,
          volume_cm3: result.volume_cm3,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate dose');
      }
      
      const data = await response.json();
      setDrugDose(data);
    } catch (error) {
      console.error('Error calculating drug dose:', error);
      setDrugDose(null);
    } finally {
      setLoading(false);
    }
  };

  const drugs = [
    "Vancomycin",
    "Aminoglycosides",
    "DOACs",
    "Metformin",
    "Chemotherapy (cisplatin/carboplatin)",
    "Digoxin",
    "Gabapentin",
    "Cephalosporins",
    "Penicillins",
    "Antivirals",
    "Spironolactone"
  ];

  const filteredDrugs = drugs.filter(drug => 
    drug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!result) return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">No data received.</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
         <KidneyViewer mesh={result.mesh} />
      </div>

      <div className="relative z-10 p-8 md:p-12 max-w-md pointer-events-none">
        
        <button 
          onClick={() => navigate("/")} 
          className="pointer-events-auto self-start flex items-center gap-2 text-zinc-500 hover:text-[#8B7462] transition-colors mb-8 text-xs uppercase tracking-widest group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Analysis
        </button>

        <div className="pointer-events-auto bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
             <div className="p-2 bg-[#8B7462]/10 rounded-lg">
                <Activity className="text-[#8B7462]" size={20} />
             </div>
             <div>
                <h1 className="text-lg font-light tracking-wide text-zinc-100">Analysis Report</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Mathematical Assessment</p>
             </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FileText size={12} /> Kidney Volume
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-extralight text-white tracking-tighter">
                  {result.volume_cm3 ? result.volume_cm3.toFixed(1) : "0.0"}
                </span>
                <span className="text-zinc-500 font-light text-lg">cm³</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
               <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Est. Nephron Capacity Index</p>
                  <p className="text-2xl font-light text-zinc-200">{result.gfr_final ? result.gfr_final.toFixed(1) : "0.0"}</p>
               </div>
               <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Creatinine</p>
                  <p className="text-2xl font-light text-zinc-200">{result.creatinine || "0.0"}</p>
                  <p className="text-[10px] text-zinc-600">mg/dL</p>
               </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto w-full mt-4 space-y-3">
          <button 
            onClick={() => navigate("/analysis", { state: { result } })}
            className="w-full flex items-center justify-center gap-2 bg-[#8B7462]/20 hover:bg-[#8B7462]/30 border border-[#8B7462]/50 text-[#e0cfc2] px-6 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#8B7462]/20 text-sm font-light tracking-wide group"
          >
            <Activity size={16} className="group-hover:scale-110 transition-transform" />
            Analyze Further
          </button>

          <button 
            onClick={() => navigate("/Biological", { state: { result } })}
            className="w-full flex items-center justify-center gap-2 bg-[#8B7462]/20 hover:bg-[#8B7462]/30 border border-[#8B7462]/50 text-[#e0cfc2] px-6 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#8B7462]/20 text-sm font-light tracking-wide group"
          >
            <Pill size={16} className="group-hover:scale-110 transition-transform" />
            Biological Medication Analysis
          </button>
        </div>
      </div>

      <div className="absolute right-8 top-8 md:right-12 md:top-12 z-10 w-80 pointer-events-none">
        <div className="pointer-events-auto bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-6">
             <div className="p-2 bg-[#8B7462]/10 rounded-lg">
                <Pill className="text-[#8B7462]" size={20} />
             </div>
             <div>
                <h2 className="text-lg font-light tracking-wide text-zinc-100">Drug Dosing</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Renal Adjusted</p>
             </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-[#8B7462] transition-colors"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {filteredDrugs.length > 0 ? (
              filteredDrugs.map(drug => (
                <button
                  key={drug}
                  onClick={() => {
                    setSelectedDrug(drug);
                    calculateDrugDose(drug);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedDrug === drug
                      ? 'bg-[#8B7462]/20 border border-[#8B7462]/50 text-[#e0cfc2]'
                      : 'bg-black/20 border border-white/5 text-zinc-300 hover:bg-black/40 hover:border-white/10'
                  }`}
                >
                  <p className="text-sm font-light">{drug}</p>
                </button>
              ))
            ) : (
              <p className="text-zinc-500 text-sm text-center py-4">No medications found</p>
            )}
          </div>

          {selectedDrug && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Recommended Dose</p>
              {loading ? (
                <div className="bg-black/20 border border-white/5 p-4 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#8B7462] border-t-transparent"></div>
                </div>
              ) : drugDose ? (
                <div className="bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-2 border-[#8B7462] p-4 rounded-r-lg">
                  <p className="text-3xl text-[#e0cfc2] font-light tracking-tight">
                    {drugDose.dose} <span className="text-lg text-[#8B7462]/70">{drugDose.unit}</span>
                  </p>
                  <p className="text-[10px] text-[#8B7462]/70 mt-1">{drugDose.frequency || `Adjusted for ${selectedDrug}`}</p>
                  {drugDose.notes && (
                    <p className="text-xs text-zinc-400 mt-2">{drugDose.notes}</p>
                  )}
                </div>
              ) : (
                <div className="bg-black/20 border border-white/5 p-4 rounded-lg">
                  <p className="text-sm text-zinc-500">Unable to calculate dose</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 116, 98, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 116, 98, 0.5);
        }
      `}</style>
    </div>
  );
}