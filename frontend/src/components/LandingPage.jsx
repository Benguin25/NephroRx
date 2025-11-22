import React, { useRef } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const niftiInputRef = useRef(null);

  const handleNiftiClick = () => {
    niftiInputRef.current?.click();
  };

  const handleNiftiChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Files selected:', files.length);
      // Process files (NIfTI or DICOM)
    }
  };

  return (
    <div className="app-container">
      <button className="about-button">About</button>

      <div className="grid-background"></div>

      <main className="main-content">
        <h1 className="title">NephroRx</h1>
        <p className="subtitle">
          Advanced AI-powered medical imaging platform for nephrology. Converting kidney MRI scans into precise 3D volumetric reconstructions and enabling smarter, data-driven medication dosing decisions.
        </p>

        <div className="upload-cards">
          {/* Creatinine Input Card */}
          <div className="upload-card">
            <h2 className="card-title">Serum Creatinine Level</h2>
            <div className="input-group">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter value"
                className="creatinine-input"
              />
              <span className="unit-label">mg/dL</span>
            </div>
            <div className="card-description">
              <p className="description-highlight">Required for dosing calculations</p>
              <p>Serum creatinine levels are essential for determining proper medication dosing based on kidney function</p>
              <p className="description-note">Typical range: 0.6-1.2 mg/dL</p>
            </div>
          </div>

          {/* File Upload Card */}
          <div className="upload-card">
            <h2 className="card-title">Upload Medical Images</h2>
            <button className="select-button" onClick={handleNiftiClick}>
              Select Files
            </button>
            <input
              ref={niftiInputRef}
              type="file"
              accept=".nii,.nii.gz,.dcm"
              multiple
              onChange={handleNiftiChange}
              style={{ display: 'none' }}
            />
            <div className="card-description">
              <p className="description-highlight">NIfTI (.nii, .nii.gz) or DICOM (.dcm)</p>
              <p>Upload streamlined de-identified MRI volumes or raw scanner output with full metadata</p>
              <p className="description-note">Supports multiple file formats for maximum flexibility</p>
            </div>
          </div>
        </div>

        <button className="submit-button">
          Process & Analyze
        </button>
      </main>
    </div>
  );
};

export default LandingPage;