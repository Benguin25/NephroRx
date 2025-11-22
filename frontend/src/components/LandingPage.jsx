import React, { useRef, useState } from 'react';
import './LandingPage.css';
import AboutPage from './AboutPage';
import ProcessingScreen from './ProcessingScreen';
import ResultsPage from './ResultsPage';

const LandingPage = () => {
  const niftiInputRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [creatinine, setCreatinine] = useState('');

  const handleNiftiClick = () => {
    niftiInputRef.current?.click();
  };

  const handleNiftiChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setUploadedFiles(fileArray);
      console.log('Files selected:', fileArray);
    }
  };

  const handleSubmit = async () => {
    // Create FormData to send files to backend
    const formData = new FormData();
    
    // Add all uploaded files
    uploadedFiles.forEach((file) => {
      formData.append('medical_images', file);
    });
    
    // Add creatinine value
    formData.append('creatinine', creatinine);
    
    // Send to backend API
    try {
      const response = await fetch('http://localhost:5000/api/process', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend response:', data);
        setIsProcessing(true);
      } else {
        console.error('Upload failed:', response.statusText);
        alert('Failed to upload files. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error connecting to server. Please ensure the backend is running.');
    }
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setShowResults(true);
  };

  if (showResults) {
    return <ResultsPage />;
  }

  if (isProcessing) {
    return <ProcessingScreen onComplete={handleProcessingComplete} />;
  }

  return (
    <div className="app-container">
      {showAbout && <AboutPage onClose={() => setShowAbout(false)} />}
      
      <button className="about-button" onClick={() => setShowAbout(true)}>About</button>

      <div className="grid-background"></div>

      <main className="main-content">
        <h1 className="title">NephroRx</h1>
        <p className="subtitle">
          Advanced AI-powered medical imaging platform for nephrology. Converting kidney MRI scans into precise 3D volumetric reconstructions and enabling smarter, data-driven medication dosing decisions.
        </p>

        <div className="upload-cards">
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
            
            {uploadedFiles.length > 0 && (
              <div className="file-upload-indicator">
                <div className="indicator-header">
                  <svg className="check-icon" width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="9" fill="#00bcd4" opacity="0.2"/>
                    <path d="M6 10l3 3 5-6" stroke="#00bcd4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="indicator-title">{uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded</span>
                </div>
                <div className="file-list">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size"> ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="card-description">
              <p className="description-highlight">NIfTI (.nii, .nii.gz) or DICOM (.dcm)</p>
              <p>Upload streamlined de-identified MRI volumes or raw scanner output with full metadata</p>
              <p className="description-note">Supports multiple file formats for maximum flexibility</p>
            </div>
          </div>

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
                value={creatinine}
                onChange={(e) => setCreatinine(e.target.value)}
              />
              <span className="unit-label">mg/dL</span>
            </div>
            <div className="card-description">
              <p className="description-highlight">Required for dosing calculations</p>
              <p>Serum creatinine levels are essential for determining proper medication dosing based on kidney function</p>
              <p className="description-note">Typical range: 0.6-1.2 mg/dL</p>
            </div>
          </div>
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Process & Analyze
        </button>
      </main>
    </div>
  );
};

export default LandingPage;