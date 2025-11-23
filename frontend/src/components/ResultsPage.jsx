import React, { useState } from "react";
import KidneyViewer from "../components/KidneyViewer";
import { Activity, ArrowLeft, FileText, Pill, Search, X, Calculator } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateDoseForDrug, getDrugById } from "../utils/dosing";

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const patientData = location.state?.patientData;
  const [selectedDrug, setSelectedDrug] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [drugDose, setDrugDose] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCalculationsModal, setShowCalculationsModal] = useState(false);

  const calculateDrugDose = (drugName) => {
    setLoading(true);
    
    console.log("=== Drug Dose Calculation Debug ===");
    console.log("Drug Name:", drugName);
    console.log("Patient Data:", patientData);
    console.log("Result Data:", result);
    
    try {
      // Get the drug config
      const drugConfig = getDrugById(drugName);
      console.log("Drug Config:", drugConfig);
      
      if (!drugConfig) {
        console.error("Drug config not found for:", drugName);
        setDrugDose(null);
        setLoading(false);
        return;
      }

      if (!patientData) {
        console.error("Patient data is missing");
        // Use default values if patient data is missing
        const patient = {
          age: 40,
          sex: "male",
          weightKg: 70,
          serumCreatinine: parseFloat(result.creatinine) || 1.0,
          tkvMeasured: parseFloat(result.volume_cm3) || 300
        };
        
        console.log("Using default patient data:", patient);
        const doseResult = calculateDoseForDrug(drugConfig, patient);
        console.log("Dose Result:", doseResult);
        setDrugDose(doseResult);
        setLoading(false);
        return;
      }

      // Prepare patient data for calculation
      const patient = {
        age: parseFloat(patientData.age) || 40,
        sex: patientData.sex?.toLowerCase() || "male",
        weightKg: parseFloat(patientData.weight) || 70,
        serumCreatinine: parseFloat(result.creatinine) || 1.0,
        tkvMeasured: parseFloat(result.volume_cm3) || 300
      };

      console.log("Prepared Patient Data:", patient);
      
      // Calculate dosage
      const doseResult = calculateDoseForDrug(drugConfig, patient);
      console.log("Dose Result:", doseResult);
      setDrugDose(doseResult);
    } catch (error) {
      console.error("Error calculating drug dose:", error);
      console.error("Error stack:", error.stack);
      setDrugDose(null);
    } finally {
      setLoading(false);
    }
  };

  const drugs = [
    "Cyclophosphamide",
    "Vancomycin",
    "Amikacin",
    "Enoxaparin",
    "Ketamine",
  ];

  const filteredDrugs = drugs.filter((drug) =>
    drug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!result)
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        No data received.
      </div>
    );

  // Debug logging
  console.log("ResultsPage - Patient Data:", patientData);
  console.log("ResultsPage - Result Data:", result);

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
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Analysis
        </button>

        <div className="pointer-events-auto bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
            <div className="p-2 bg-[#8B7462]/10 rounded-lg">
              <Activity className="text-[#8B7462]" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-light tracking-wide text-zinc-100">
                Analysis Report
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                Mathematical Assessment
              </p>
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
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                  Est. Nephron Capacity Index
                </p>
                <p className="text-2xl font-light text-zinc-200">
                  {result.gfr_final ? result.gfr_final.toFixed(1) : "0.0"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                  Creatinine
                </p>
                <p className="text-2xl font-light text-zinc-200">
                  {result.creatinine || "0.0"}
                </p>
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
            <Activity
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            Analyze Further
          </button>

          <button
            onClick={() => navigate("/Biological", { state: { result } })}
            className="w-full flex items-center justify-center gap-2 bg-[#8B7462]/20 hover:bg-[#8B7462]/30 border border-[#8B7462]/50 text-[#e0cfc2] px-6 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#8B7462]/20 text-sm font-light tracking-wide group"
          >
            <Pill
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
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
              <h2 className="text-lg font-light tracking-wide text-zinc-100">
                Drug Dosing
              </h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                Renal Adjusted
              </p>
            </div>
          </div>

          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={16}
            />
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
              filteredDrugs.map((drug) => (
                <button
                  key={drug}
                  onClick={() => {
                    setSelectedDrug(drug);
                    calculateDrugDose(drug);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedDrug === drug
                      ? "bg-[#8B7462]/20 border border-[#8B7462]/50 text-[#e0cfc2]"
                      : "bg-black/20 border border-white/5 text-zinc-300 hover:bg-black/40 hover:border-white/10"
                  }`}
                >
                  <p className="text-sm font-light">{drug}</p>
                </button>
              ))
            ) : (
              <p className="text-zinc-500 text-sm text-center py-4">
                No medications found
              </p>
            )}
          </div>

          {selectedDrug && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
                Dosage Information
              </p>
              {loading ? (
                <div className="bg-black/20 border border-white/5 p-4 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#8B7462] border-t-transparent"></div>
                </div>
              ) : drugDose ? (
                <div className="space-y-4">
                  {/* Normal Dosage */}
                  <div className="bg-black/20 border border-white/5 p-4 rounded-lg">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                      Normal Dosage
                    </p>
                    <p className="text-2xl text-zinc-200 font-light tracking-tight">
                      {drugDose.doseNormalMg.toFixed(1)}{" "}
                      <span className="text-sm text-zinc-500">mg</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Based on weight, age, sex, creatinine
                    </p>
                  </div>

                  {/* TKV-Adjusted Dosage */}
                  <div className="bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-2 border-[#8B7462] p-4 rounded-r-lg">
                    <p className="text-[10px] text-[#8B7462]/70 uppercase tracking-widest mb-2">
                      TKV-Adjusted Dosage
                    </p>
                    <p className="text-3xl text-[#e0cfc2] font-light tracking-tight">
                      {drugDose.doseTkvMg.toFixed(1)}{" "}
                      <span className="text-lg text-[#8B7462]/70">mg</span>
                    </p>
                    <p className="text-[10px] text-[#8B7462]/70 mt-1">
                      Kidney volume corrected (KR: {drugDose.kidneyRatio.toFixed(3)})
                    </p>
                  </div>

                  {/* View Calculations Button */}
                  <button
                    onClick={() => setShowCalculationsModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-[#8B7462]/50 text-zinc-300 hover:text-[#e0cfc2] px-4 py-3 rounded-lg transition-all text-sm"
                  >
                    <Calculator size={16} />
                    View Calculations
                  </button>
                </div>
              ) : (
                <div className="bg-black/20 border border-white/5 p-4 rounded-lg">
                  <p className="text-sm text-zinc-500 mb-2">
                    Unable to calculate dose
                  </p>
                  <p className="text-xs text-zinc-600">
                    {!patientData && "Missing patient data (age, sex, weight)"}
                    {!result && "Missing analysis data"}
                  </p>
                  <p className="text-xs text-zinc-700 mt-2">
                    Check browser console for details (F12)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Calculations Modal */}
      {showCalculationsModal && drugDose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/5 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#8B7462]/10 rounded-lg">
                  <Calculator className="text-[#8B7462]" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-white">
                    {drugDose.drug.displayName} - Calculations
                  </h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                    Detailed Dosing Formulas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCalculationsModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="text-zinc-400" size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Patient Information */}
              <div className="bg-black/20 border border-white/5 p-4 rounded-lg">
                <h3 className="text-sm font-light text-[#8B7462] uppercase tracking-widest mb-3">
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-zinc-500 text-xs">Age</p>
                    <p className="text-zinc-200">{drugDose.calculations.age} years</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Sex</p>
                    <p className="text-zinc-200 capitalize">{drugDose.calculations.sex}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Weight</p>
                    <p className="text-zinc-200">{drugDose.calculations.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Serum Creatinine</p>
                    <p className="text-zinc-200">{drugDose.calculations.serumCreatinine} mg/dL</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-zinc-500 text-xs">TKV Measured</p>
                    <p className="text-zinc-200">{drugDose.calculations.tkvMeasured.toFixed(2)} mL</p>
                  </div>
                </div>
              </div>

              {/* TKV Expected Calculation */}
              <div className="bg-black/20 border border-white/5 p-4 rounded-lg">
                <h3 className="text-sm font-light text-[#8B7462] uppercase tracking-widest mb-3">
                  Expected TKV Calculation
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-zinc-400">
                    <span className="text-zinc-500">Formula:</span> TKV<sub>exp</sub> = Base × SexF × AgeF × WtF
                  </p>
                  <div className="bg-black/40 p-3 rounded-lg space-y-1 text-xs">
                    <p className="text-zinc-300">Base = {drugDose.calculations.base} mL</p>
                    <p className="text-zinc-300">SexF = {drugDose.calculations.sexF.toFixed(2)}</p>
                    <p className="text-zinc-300">
                      AgeF = 1 - max(0, {drugDose.calculations.age} - 40) × 0.01 = {drugDose.calculations.ageF.toFixed(3)}
                    </p>
                    <p className="text-zinc-300">
                      WtF = 1 + 0.003 × ({drugDose.calculations.weight} - 70) = {drugDose.calculations.wtF.toFixed(3)}
                    </p>
                  </div>
                  <p className="text-[#e0cfc2] font-light pt-2">
                    {drugDose.calculations.tkvExpFormula}
                  </p>
                </div>
              </div>

              {/* Kidney Ratio Calculation */}
              <div className="bg-black/20 border border-white/5 p-4 rounded-lg">
                <h3 className="text-sm font-light text-[#8B7462] uppercase tracking-widest mb-3">
                  Kidney Ratio (KR)
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-zinc-400">
                    <span className="text-zinc-500">Formula:</span> KR = TKV<sub>measured</sub> / TKV<sub>exp</sub>
                  </p>
                  <p className="text-[#e0cfc2] font-light pt-2">
                    {drugDose.calculations.kidneyRatioFormula}
                  </p>
                </div>
              </div>

              {/* Normal Dosage Calculation */}
              <div className="bg-black/20 border border-white/5 p-4 rounded-lg">
                <h3 className="text-sm font-light text-[#8B7462] uppercase tracking-widest mb-3">
                  Normal Dosage
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-zinc-400">
                    <span className="text-zinc-500">Standard Formula:</span> {drugDose.drug.standardFormula}
                  </p>
                  <p className="text-[#e0cfc2] font-light pt-2">
                    {drugDose.calculations.normalDoseFormula}
                  </p>
                  <div className="bg-gradient-to-r from-zinc-800/50 to-transparent border-l-2 border-zinc-600 p-3 rounded-r-lg mt-2">
                    <p className="text-zinc-200 text-lg">
                      Normal Dose = <span className="text-white font-light">{drugDose.doseNormalMg.toFixed(1)} mg</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* TKV-Adjusted Dosage Calculation */}
              <div className="bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-4 border-[#8B7462] p-4 rounded-r-lg">
                <h3 className="text-sm font-light text-[#8B7462] uppercase tracking-widest mb-3">
                  TKV-Adjusted Dosage
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-zinc-400">
                    <span className="text-zinc-500">Formula:</span> Dose<sub>TKV</sub> = Dose<sub>std</sub> × KR
                  </p>
                  <p className="text-[#e0cfc2] font-light pt-2">
                    {drugDose.calculations.tkvDoseFormula}
                  </p>
                  <div className="bg-[#8B7462]/10 p-3 rounded-lg mt-2">
                    <p className="text-[#e0cfc2] text-xl font-light">
                      TKV-Adjusted Dose = <span className="text-white">{drugDose.doseTkvMg.toFixed(1)} mg</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
