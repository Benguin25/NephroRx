import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, Activity } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const [structuralData, setStructuralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    roughness: false,
    cvi: false
  });

  useEffect(() => {
    if (!result) return;

    async function fetchStructural() {
      try {
        const response = await fetch("http://localhost:5000/analyze_structural", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vertices: result.mesh.vertices,
            faces: result.mesh.faces,
          }),
        });

        const data = await response.json();
        setStructuralData(data);
      } catch (err) {
        console.error("Structural analysis failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStructural();
  }, [result]);

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
        
        {/* Header */}
        <div>
          <h1 className="text-5xl font-extralight text-white mb-3 tracking-tight">Structural Analysis</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest">Geometric Surface Assessment</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Kidney Filtration Index</p>
            <p className="text-4xl font-light text-white">{result.kfi}</p>
          </div>
          <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Total Volume</p>
            <p className="text-4xl font-light text-white">
              {Number(result.volume_cm3).toFixed(2)}
 <span className="text-xl text-zinc-500">cm³</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-12 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#8B7462] border-t-transparent mx-auto"></div>
              <p className="text-zinc-500 text-sm">Analyzing kidney structure...</p>
            </div>
          </div>
        ) : structuralData ? (
          <>
            {/* Roughness Section */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
              
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#8B7462]/10 rounded-lg">
                    <Activity className="text-[#8B7462]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-white">Surface Roughness</h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Irregularity Measurement</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                
                {/* Roughness Score Card */}
                <button
                  onClick={() => toggleSection('roughness')}
                  className="w-full text-left bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-4 border-[#8B7462] p-6 rounded-r-2xl hover:from-[#8B7462]/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <p className="text-xs text-[#8B7462]/70 uppercase tracking-widest">Roughness Score</p>
                      <p className="text-5xl font-extralight text-[#e0cfc2] tracking-tight">
                        {structuralData.roughness}
                      </p>
                      <p className="text-sm text-[#8B7462] font-light">{structuralData.structural_category}</p>
                    </div>
                    <ChevronDown 
                      size={28} 
                      className={`text-[#8B7462] transition-transform duration-300 ${expandedSections.roughness ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Expandable Roughness Details */}
                <div className={`overflow-hidden transition-all duration-300 ${expandedSections.roughness ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-5">
                    
                    <div>
                      <p className="text-white font-light text-lg mb-3">What This Means</p>
                      <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed">
                        <li className="flex gap-2">
                          <span className="text-[#8B7462] mt-1">•</span>
                          <span>A roughness score of <strong className="text-zinc-300">{structuralData.roughness}</strong> indicates the kidney surface is more irregular than a smooth ellipsoid</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-[#8B7462] mt-1">•</span>
                          <span>Healthy kidneys typically show mild natural irregularity (scores around 1.1–1.4)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-[#8B7462] mt-1">•</span>
                          <span>Values above <strong className="text-zinc-300">1.5</strong> often indicate stronger shape distortion or lobulation</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-white/5 pt-5">
                      <p className="text-white font-light text-lg mb-3">Calculation Method</p>
                      <div className="bg-black/40 p-4 rounded-xl font-mono text-sm space-y-2">
                        <p className="text-[#c7b8a3]">expected_area = (36 × π × V²)^(1/3)</p>
                        <p className="text-[#c7b8a3]">roughness = actual_surface_area / expected_area</p>
                        <p className="text-zinc-500 text-xs mt-3 font-sans">
                          This compares your kidney's surface area to a shape-idealized organ of the same volume
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* CVI Section */}
            <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
              
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#8B7462]/10 rounded-lg">
                    <Activity className="text-[#8B7462]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-white">Curvature Variability Index</h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Surface Complexity Metric</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                
                {/* CVI Score Card */}
                <button
                  onClick={() => toggleSection('cvi')}
                  className="w-full text-left bg-gradient-to-r from-[#8B7462]/20 to-transparent border-l-4 border-[#8B7462] p-6 rounded-r-2xl hover:from-[#8B7462]/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <p className="text-xs text-[#8B7462]/70 uppercase tracking-widest">CVI Score</p>
                      <p className="text-5xl font-extralight text-[#e0cfc2] tracking-tight">
                        {structuralData.cvi}
                      </p>
                      <p className="text-sm text-[#8B7462] font-light">{structuralData.curvature_label}</p>
                    </div>
                    <ChevronDown 
                      size={28} 
                      className={`text-[#8B7462] transition-transform duration-300 ${expandedSections.cvi ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Expandable CVI Details */}
                <div className={`overflow-hidden transition-all duration-300 ${expandedSections.cvi ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-5">
                    
                    <div>
                      <p className="text-white font-light text-lg mb-3">What This Means</p>
                      <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed">
                        <li className="flex gap-2">
                          <span className="text-[#8B7462] mt-1">•</span>
                          <span>CVI measures how much the kidney surface curvature changes from point to point</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-[#8B7462] mt-1">•</span>
                          <span>Your CVI of <strong className="text-zinc-300">{structuralData.cvi}</strong> indicates <strong className="text-zinc-300">{structuralData.curvature_label.toLowerCase()}</strong></span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-[#8B7462] mt-1">•</span>
                          <span>Higher CVI values suggest more bumps, dips, or lobulated regions on the surface</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-white/5 pt-5">
                      <p className="text-white font-light text-lg mb-3">Calculation Method</p>
                      <div className="bg-black/40 p-4 rounded-xl font-mono text-sm space-y-2">
                        <p className="text-[#c7b8a3]">curvature[i] = mean(|neighbor_vertex - vertex_i|)</p>
                        <p className="text-[#c7b8a3]">CVI = std(curvature) / mean(curvature)</p>
                        <p className="text-zinc-500 text-xs mt-3 font-sans">
                          CVI reflects local surface complexity, not medical conditions
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-6">
              <p className="text-xs text-zinc-500 leading-relaxed">
                <strong className="text-zinc-400">Note:</strong> This page describes geometric patterns of the mesh only and does not diagnose medical conditions. All measurements are based on computational geometry analysis.
              </p>
            </div>
          </>
        ) : (
          <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center">
            <p className="text-red-400">Unable to load structural analysis.</p>
          </div>
        )}

      </div>
    </div>
  );
}