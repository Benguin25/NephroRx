import React, { useState, useEffect } from 'react';
import './ProcessingScreen.css';

const ProgressStep = ({ label, status }) => {
  return (
    <div className={`progress-step ${status}`}>
      <div className="step-indicator">
        {status === 'complete' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3 3 7-7" stroke="#8B7462" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {status === 'active' && (
          <div className="spinner-small"></div>
        )}
        {status === 'pending' && <div className="pending-dot"></div>}
      </div>
      <div className="step-content">
        <span className="step-label">{label}</span>
      </div>
    </div>
  );
};

const ProcessingScreen = ({ resultData, navigate }) => {
  const [analysisStage, setAnalysisStage] = useState(-1);
  const [animationComplete, setAnimationComplete] = useState(false);
  const hasNavigated = React.useRef(false);

  const stages = [
    { name: 'Image Processing', duration: 1000 },
    { name: 'Calculating Volume', duration: 2000 },
    { name: 'Loading 3D Model', duration: 2500 }
  ];

  // Animation effect - runs only once on mount
  useEffect(() => {
    const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
    let elapsed = 0;
    
    const timer = setInterval(() => {
      elapsed += 50;
      
      // Determine current stage
      let cumulativeTime = 0;
      let newStage = -1;
      for (let i = 0; i < stages.length; i++) {
        cumulativeTime += stages[i].duration;
        if (elapsed >= cumulativeTime - stages[i].duration && elapsed < cumulativeTime) {
          newStage = i;
          break;
        }
      }
      if (elapsed >= totalDuration) {
        newStage = stages.length - 1;
      }
      
      setAnalysisStage(newStage);
      
      // Mark animation as complete
      if (elapsed >= totalDuration + 500) {
        clearInterval(timer);
        setAnimationComplete(true);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []); // Empty dependency array - run only once

  // Navigation effect - triggers when both animation is done and data is ready
  useEffect(() => {
    if (animationComplete && resultData && navigate && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/results", { state: resultData });
    }
  }, [animationComplete, resultData, navigate]);

  return (
    <div className="processing-screen">
      <div className="grid-background"></div>
      
      <div className="processing-container-new">
        <div className="processing-card">
          <div className="spinner-container">
            <div className="spinner-ring"></div>
            <div className="spinner-border"></div>
          </div>
          
          <h2 className="processing-title-new">Analyzing Scan</h2>
          <p className="processing-subtitle">Processing medical imaging data</p>

          <div className="steps-container">
            <ProgressStep 
              label="Image Processing" 
              status={analysisStage >= 0 ? (analysisStage > 0 ? 'complete' : 'active') : 'pending'}
            />
            <ProgressStep 
              label="Calculating Volume" 
              status={analysisStage >= 1 ? (analysisStage > 1 ? 'complete' : 'active') : 'pending'}
            />
            <ProgressStep 
              label="Loading 3D Model" 
              status={analysisStage === 2 ? 'active' : 'pending'}
            />
          </div>

          <div className="ai-progress-section">
            <div className="ai-progress-header">
              <span className="ai-model-label">AI Model: TotalSegmentator v2.0</span>
              <span className="ai-percentage">{Math.round(((analysisStage + 1) / 3) * 100)}%</span>
            </div>
            <div className="ai-progress-bar-bg">
              <div 
                className="ai-progress-bar-fill"
                style={{ width: `${((analysisStage + 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
