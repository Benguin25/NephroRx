import React, { useRef } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const niftiInputRef = useRef(null);
  const dicomInputRef = useRef(null);

  const handleNiftiClick = () => {
    niftiInputRef.current?.click();
  };

  const handleDicomClick = () => {
    dicomInputRef.current?.click();
  };

  const handleNiftiChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('NIfTI file selected:', file.name);
      // Process NIfTI file
    }
  };

  const handleDicomChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('DICOM files selected:', files.length);
      // Process DICOM series
    }
  };

  return (
    <div className="landing-page">
      <div className="grid-background"></div>
      <div className="particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 3}s`
          }}></div>
        ))}
      </div>
      
      <button className="about-button" aria-label="About NephroRx">
        About
      </button>
      
      <div className="content-wrapper">
        <header className="header">
          <h1 className="brand-name">NephroRx</h1>
          <p className="subtitle">
            Advanced AI-powered medical imaging platform for nephrology.
            Converting kidney MRI scans into precise 3D volumetric reconstructions
            and enabling smarter, data-driven medication dosing decisions.
          </p>
        </header>

        <main className="main-content">
          <div className="upload-cards">
            {/* NIfTI Upload Card */}
            <div className="upload-card">
              <h2 className="card-title">Upload NIfTI (.nii)</h2>
              <button 
                className="upload-button"
                onClick={handleNiftiClick}
                aria-label="Select NIfTI file"
              >
                <span className="button-glow"></span>
                <span className="button-text">Select NIfTI file</span>
              </button>
              <input
                ref={niftiInputRef}
                type="file"
                accept=".nii,.nii.gz"
                onChange={handleNiftiChange}
                style={{ display: 'none' }}
              />
              <div className="card-description">
                <p>Streamlined, de-identified MRI volume format</p>
                <p>Perfect for secure, privacy-compliant kidney imaging workflows and research applications</p>
                <p className="card-note">Supports .nii and .nii.gz compressed formats</p>
              </div>
            </div>

            {/* DICOM Upload Card */}
            <div className="upload-card">
              <h2 className="card-title">Upload DICOM (.dcm)</h2>
              <button 
                className="upload-button"
                onClick={handleDicomClick}
                aria-label="Select DICOM series"
              >
                <span className="button-glow"></span>
                <span className="button-text">Select DICOM series</span>
              </button>
              <input
                ref={dicomInputRef}
                type="file"
                accept=".dcm"
                multiple
                onChange={handleDicomChange}
                style={{ display: 'none' }}
              />
              <div className="card-description">
                <p>Raw MRI scanner output with full metadata</p>
                <p>Preserves complete imaging parameters and patient context for comprehensive clinical analysis</p>
                <p className="card-note">Upload entire series for best reconstruction quality</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
