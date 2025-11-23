import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Pill, DollarSign, TrendingUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BiologicalAnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const [expandedSections, setExpandedSections] = useState({
    medications: false,
    screening: false,
    monitoring: false,
    insurance: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <p className="text-zinc-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 md:p-12">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-zinc-500 hover:text-[#8B7462] transition-colors mb-8 text-xs uppercase tracking-widest group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back
      </button>

      <div className="max-w-5xl mx-auto space-y-8">

        <div>
          <h1 className="text-5xl font-extralight mb-3 tracking-tight">Biological Medication Analysis</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">Cost-Effective Kidney Treatment</p>
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#8B7462]/10 rounded-lg">
              <TrendingUp className="text-[#8B7462]" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-light">Kidney Filtration Index</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Quantitative Health Measure</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-4 border-[#8B7462] p-6 rounded-r-2xl">
            <p className="text-xs text-[#8B7462]/70 uppercase tracking-widest mb-2">Current KFI Score</p>
            <p className="text-6xl font-extralight text-[#e0cfc2] mb-4">{result.kfi}</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
                The KFI is a ratio reflecting kidney structural health, typically ranging from 0-1, with higher values indicating healthier kidney function. It helps clinicians and pharmacists identify patients who need high cost treatments, optimize timing, and monitor treatment response.
            </p>

          </div>
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center gap-3">
            <div className="p-2 bg-[#8B7462]/10 rounded-lg">
              <DollarSign className="text-[#8B7462]" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-light">High Cost Kidney Medications</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Evidence Based Prescribing</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <button
              onClick={() => toggleSection('medications')}
              className="w-full text-left bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-4 border-[#8B7462] p-6 rounded-r-2xl hover:from-[#8B7462]/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-xs text-[#8B7462]/70 uppercase tracking-widest">Why Cost Matters</p>
                  <p className="text-2xl font-light text-[#e0cfc2]">Targeted Medication Selection</p>
                </div>
                <ChevronDown size={28} className={`text-[#8B7462] transition-transform duration-300 ${expandedSections.medications ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.medications ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                <p className="text-white font-light text-lg mb-4">Common High Cost Medications</p>
                {[
                  { name: "Erythropoiesis-Stimulating Agents (ESAs)", desc: "Treat anemia in CKD; prescribed only when necessary due to cost and side effects." },
                  { name: "Immunosuppressants", desc: "Used after kidney transplants; require monitoring using markers like KFI." },
                  { name: "SGLT2 Inhibitors", desc: "Protect kidneys in diabetes; evidence-based prescribing ensures effective use." },
                  { name: "Targeted Genetic Therapies", desc: "Rare, extremely costly treatments reserved for confirmed structural abnormalities." }
                ].map((med, i) => (
                  <div key={i} className="bg-black/30 border border-white/5 p-4 rounded-xl">
                    <p className="text-[#e0cfc2] font-medium mb-2">{med.name}</p>
                    <p className="text-zinc-400 text-sm">{med.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center gap-3">
            <div className="p-2 bg-[#8B7462]/10 rounded-lg">
              <Pill className="text-[#8B7462]" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-light">How KFI Guides Pharmacists</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">DataDriven Treatment Decisions</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {[
              { key: "screening", title: "Patient Screening", items: [
                "Evaluate patients before prescribing high cost treatments.",
                "Prevent unnecessary medication by focusing on patients who truly need it.",
                "Use KFI as an early warning of structural changes."
              ]},
              { key: "monitoring", title: "Treatment Monitoring", items: [
                "Monitor KFI trends during treatment.",
                "Adjust medication dosages based on structural changes.",
                "Abnormal trends then more frequent labs or imaging.",
                "Normal trends then routine followup."
              ]},
              { key: "insurance", title: "Insurance Justification", items: [
                "Provide quantitative evidence to insurers.",
                "Reduce prior authorization rejections.",
                "Support step therapy requirements with measurable metrics."
              ]}
            ].map((section, i) => (
              <div key={i}>
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full text-left bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-4 border-[#8B7462] p-6 rounded-r-2xl hover:from-[#8B7462]/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-light text-[#e0cfc2]">{section.title}</p>
                    <ChevronDown size={28} className={`text-[#8B7462] transition-transform duration-300 ${expandedSections[section.key] ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${expandedSections[section.key] ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-2">
                    <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-[#8B7462] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
