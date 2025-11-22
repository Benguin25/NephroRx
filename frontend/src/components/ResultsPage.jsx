import React, { useState } from 'react';
import './ResultsPage.css';

const ResultsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app this would come from backend
  const medications = [
    { name: 'Axitinib', dose: '38 mg' },
    { name: 'Nivolumab', dose: '60 mg' },
    { name: 'Cisplatin', dose: '2-4 mg' }
  ];

  // Filter medications based on search query
  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const kidneyRegions = [
    { id: 'left-kidney', name: 'Left Kidney', health: 65, color: '#ff6b6b' },
    { id: 'right-kidney', name: 'Right Kidney', health: 45, color: '#ffa500' },
    { id: 'tumor-1', name: 'Primary Tumor', health: 0, color: '#ff0000' }
  ];

  return (
    <div className="results-page">
      <div className="grid-background"></div>
      
      <div className="results-container">
        <header className="results-header">
          <h1 className="results-title">Analysis Results</h1>
          <button className="back-button" onClick={() => window.location.reload()}>
            ← New Analysis
          </button>
        </header>

        {/* Patient Summary Stats at Top */}
        <div className="patient-summary">
          <div className="summary-card">
            <div className="summary-label">GFR (eGFR)</div>
            <div className="summary-value">42 mL/min/1.73m²</div>
            <div className="summary-status">Stage 3 CKD</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Creatinine</div>
            <div className="summary-value">1.8 mg/dL</div>
            <div className="summary-status">Elevated</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Kidney Function</div>
            <div className="summary-value">52%</div>
            <div className="summary-status">Moderate Impairment</div>
          </div>
        </div>

        <div className="results-content">
          {/* Left Side - Search Bar and Drug List */}
          <div className="left-panel">
            <div className="search-section">
              <input 
                type="text" 
                className="search-bar" 
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="drug-list">
              <h2 className="section-title">Recommended Dosages</h2>
              {filteredMedications.length > 0 ? filteredMedications.map((med, index) => (
                <div key={index} className="drug-card">
                  <div className="drug-header">
                    <div className="drug-name">{med.name}</div>
                    <button className="view-calc-btn">View Calculations</button>
                  </div>
                  <div className="drug-dose-main">
                    <span className="dose-label">Recommended Dose:</span>
                    <span className="dose-value">{med.dose}</span>
                  </div>
                  <div className="dose-info">
                    <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="7" fill="none" stroke="#00bcd4" strokeWidth="2"/>
                      <path d="M8 4v5M8 11v1" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Adjusted for reduced kidney function</span>
                  </div>
                </div>
              )) : (
                <div className="no-results">
                  <p>No medications found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - 3D Kidney Visualization */}
          <div className="right-panel">
            <div className="visualization-container">
              <h2 className="section-title">3D Kidney Model</h2>
              <div className="kidney-3d-view">
                {/* Kidney SVG representation */}
                <svg className="kidney-svg" viewBox="0 0 400 500">
                  {/* Left Kidney */}
                  <ellipse 
                    cx="120" cy="250" rx="70" ry="140" 
                    fill="rgba(255, 107, 107, 0.3)" 
                    stroke="#ff6b6b" 
                    strokeWidth="3"
                    className="kidney-region clickable"
                    onClick={() => setSelectedRegion('left-kidney')}
                  />
                  {/* Tumor in left kidney */}
                  <ellipse 
                    cx="130" cy="220" rx="25" ry="50" 
                    fill="rgba(255, 0, 0, 0.5)" 
                    stroke="#ff0000" 
                    strokeWidth="2"
                  />
                  
                  {/* Right Kidney */}
                  <ellipse 
                    cx="280" cy="250" rx="70" ry="140" 
                    fill="rgba(255, 165, 0, 0.3)" 
                    stroke="#ffa500" 
                    strokeWidth="3"
                    className="kidney-region clickable"
                    onClick={() => setSelectedRegion('right-kidney')}
                  />
                  
                  {/* Small tumor in right kidney */}
                  <circle 
                    cx="290" cy="280" r="18" 
                    fill="rgba(255, 0, 0, 0.5)" 
                    stroke="#ff0000" 
                    strokeWidth="2"
                    className="clickable"
                    onClick={() => setSelectedRegion('tumor-1')}
                  />

                  {/* Yellow indicator for smaller issue */}
                  <circle 
                    cx="270" cy="200" r="12" 
                    fill="rgba(255, 255, 0, 0.4)" 
                    stroke="#ffeb3b" 
                    strokeWidth="2"
                  />

                  {/* Connecting vessels */}
                  <path 
                    d="M 120 150 Q 200 100 280 150" 
                    fill="none" 
                    stroke="rgba(0, 188, 212, 0.4)" 
                    strokeWidth="3"
                  />
                  <path 
                    d="M 120 350 Q 200 400 280 350" 
                    fill="none" 
                    stroke="rgba(0, 188, 212, 0.4)" 
                    strokeWidth="3"
                  />
                </svg>

                <div className="view-controls">
                  <button className="control-btn">↻ Rotate</button>
                  <button className="control-btn">⊕ Zoom</button>
                  <button className="control-btn">⊖ Zoom</button>
                </div>
              </div>

              {/* Region Info Panel */}
              {selectedRegion && (
                <div className="region-info">
                  <h3>Region Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Region:</span>
                      <span className="info-value">
                        {kidneyRegions.find(r => r.id === selectedRegion)?.name}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Health Status:</span>
                      <span className="info-value">
                        {kidneyRegions.find(r => r.id === selectedRegion)?.health}%
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Volume:</span>
                      <span className="info-value">145 mL</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ background: '#ff6b6b' }}></div>
                  <span>Moderate Function</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: '#ffa500' }}></div>
                  <span>Reduced Function</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: '#ff0000' }}></div>
                  <span>Tumor/Critical</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: '#ffeb3b' }}></div>
                  <span>Minor Issue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
