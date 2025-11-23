import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Pill, DollarSign, TrendingUp, ShieldCheck } from "lucide-react";
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
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
          <h1 className="text-5xl font-extralight text-white mb-3 tracking-tight">Biological Medication Analysis</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">Cost-Effective Treatment Guidance</p>
        </div>

        {/* KFI Overview */}
        <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#8B7462]/10 rounded-lg">
              <TrendingUp className="text-[#8B7462]" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-light text-white">Your Kidney Filtration Index</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Quantitative Health Measure</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-4 border-[#8B7462] p-6 rounded-r-2xl">
            <p className="text-xs text-[#8B7462]/70 uppercase tracking-widest mb-2">Current KFI Score</p>
            <p className="text-6xl font-extralight text-[#e0cfc2] tracking-tight mb-4">
              {result.kfi}
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              The Kidney Filtration Index (KFI) is a ratio indicating kidney structural health. This quantitative measure helps clinicians and pharmacists identify patients who truly need high-cost kidney medications, optimize treatment timing, and monitor treatment efficacy over time.
            </p>
          </div>
        </div>

        {/* Expensive Medications Section */}
        <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#8B7462]/10 rounded-lg">
                <DollarSign className="text-[#8B7462]" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-light text-white">High-Cost Kidney Medications</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Evidence-Based Prescribing</p>
              </div>
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
                <ChevronDown 
                  size={28} 
                  className={`text-[#8B7462] transition-transform duration-300 ${expandedSections.medications ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.medications ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-5">
                
                <div>
                  <p className="text-white font-light text-lg mb-4">Common High-Cost Kidney Medications</p>
                  
                  <div className="space-y-4">
                    <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                      <p className="text-[#e0cfc2] font-medium mb-2">Erythropoiesis-Stimulating Agents (ESAs)</p>
                      <p className="text-zinc-400 text-sm">Used for anemia in chronic kidney disease (CKD). Only prescribed when clearly needed due to cost and potential cardiovascular side effects.</p>
                    </div>

                    <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                      <p className="text-[#e0cfc2] font-medium mb-2">SGLT2 Inhibitors</p>
                      <p className="text-zinc-400 text-sm">Provide kidney protection in diabetic patients. Evidence-based prescribing ensures these expensive drugs go to patients who will benefit most.</p>
                    </div>

                    <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                      <p className="text-[#e0cfc2] font-medium mb-2">Immunosuppressants</p>
                      <p className="text-zinc-400 text-sm">Critical after kidney transplants. Require precise monitoring and adjustment based on kidney function markers like KFI.</p>
                    </div>

                    <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                      <p className="text-[#e0cfc2] font-medium mb-2">Targeted Genetic Therapies</p>
                      <p className="text-zinc-400 text-sm">Rare, extremely costly treatments for genetic kidney diseases. Reserved for patients with confirmed structural or functional abnormalities.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Clinical Application Section */}
        <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#8B7462]/10 rounded-lg">
                <Pill className="text-[#8B7462]" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-light text-white">How KFI Guides Pharmacists</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Data-Driven Treatment Decisions</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            
            {/* Patient Screening */}
            <button
              onClick={() => toggleSection('screening')}
              className="w-full text-left bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-4 border-[#8B7462] p-6 rounded-r-2xl hover:from-[#8B7462]/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-xs text-[#8B7462]/70 uppercase tracking-widest">Application 1</p>
                  <p className="text-2xl font-light text-[#e0cfc2]">Patient Screening</p>
                </div>
                <ChevronDown 
                  size={28} 
                  className={`text-[#8B7462] transition-transform duration-300 ${expandedSections.screening ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.screening ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                <p className="text-white font-light text-lg">Identify True Need</p>
                <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-[#8B7462] mt-1">•</span>
                    <span>Screen patients before recommending expensive treatments</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#8B7462] mt-1">•</span>
                    <span>Avoid unnecessary prescriptions by identifying patients who actually need these drugs</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#8B7462] mt-1">•</span>
                    <span>Use KFI as an early indicator of structural kidney changes that warrant intervention</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Treatment Monitoring */}
            <button
              onClick={() => toggleSection('monitoring')}
              className="w-full text-left bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-4 border-[#8B7462] p-6 rounded-r-2xl hover:from-[#8B7462]/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-xs text-[#8B7462]/70 uppercase tracking-widest">Application 2</p>
                  <p className="text-2xl font-light text-[#e0cfc2]">Treatment Response Monitoring</p>
                </div>
                <ChevronDown 
                  size={28} 
                  className={`text-[#8B7462] transition-transform duration-300 ${expandedSections.monitoring ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.monitoring ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                <p className="text-white font-light text-lg">Track Progress Over Time</p>
                <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-[#8B7462] mt-1">•</span>
                    <span>Monitor if KFI improves or worsens during treatment</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#8B7462] mt-1">•</span>
                    <span>Adjust medication dosages based on quantitative structural changes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#8B7462] mt-1">•</span>
                    <span>Abnormal KFI trends → more frequent labs or imaging</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#8B7462] mt-1">•</span>
                    <span>Normal KFI → routine monitoring interval</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Insurance Justification */}
            <button
              onClick={() => toggleSection('insurance')}
              className="w-full text-left bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-4 border-[#8B7462] p-6 rounded-r-2xl hover:from-[#8B7462]/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-xs text-[#8B7462]/70 uppercase tracking-widest">Application 3</p>
                  <p className="text-2xl font-light text-[#e0cfc2]">Insurance Justification</p>
                </div>
                <ChevronDown 
                  size={28} 
                  className={`text-[#8B7462] transition-transform duration-300 ${expandedSections.insurance ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.insurance ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                <p className="text-white font-light text-lg">Evidence-Based Authorization</p>
                <div className="bg-black/40 p-4 rounded-xl">
                  <p className="text-zinc-300 text-sm mb-3">Example Documentation:</p>
                  <p className="text-[#c7b8a3] text-sm italic leading-relaxed">
                    "KFI of {result.kfi} indicates structural changes consistent with progressive kidney disease, supporting the use of SGLT2 inhibitor therapy. This data-driven approach ensures cost-effective allocation of high-value medications."
                  </p>
                </div>
                <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed mt-4">
                  <li className="flex gap-2">
                    <span className="text-[#8B7462] mt-1">•</span>
                    <span>Provide quantitative evidence to insurance companies</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#8B7462] mt-1">•</span>
                    <span>Reduce prior authorization rejections with objective data</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#8B7462] mt-1">•</span>
                    <span>Support step therapy requirements with measurable kidney metrics</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-[#8B7462]/10 to-transparent border-l-4 border-[#8B7462] p-8 rounded-r-2xl">
          <div className="flex items-start gap-4">
            <ShieldCheck className="text-[#8B7462] flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-white font-light text-lg mb-3">Clinical Impact Summary</p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Our program calculates the Kidney Filtration Index (KFI), a ratio indicating kidney structural health. Pharmacists and clinicians can use KFI to identify patients who truly need high-cost kidney medications, optimize treatment timing, and avoid unnecessary expenses, while also monitoring treatment efficacy over time. This data-driven approach improves patient outcomes while reducing healthcare costs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}