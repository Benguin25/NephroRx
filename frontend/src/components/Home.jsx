import React, { useState, useEffect, useRef } from "react";
import { Upload, Activity, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AboutButton from './About.jsx';
import ProcessingScreen from './ProcessingScreen.jsx';

export default function NephroRX() {
  const [scrolled, setScrolled] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    weight: "",
    creatinine: "",
    file: null,
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!formData.file) {
      alert("Please upload a file.");
      return;
    }

    setAnalyzing(true);
    setIsProcessing(true);
    const uploadData = new FormData();

    const file = formData.file;
    const lower = file.name.toLowerCase();

    if (lower.endsWith(".dcm")) {
      uploadData.append("dicom_files", file);
    } else {
      uploadData.append("file", file);
    }

    uploadData.append("creatinine_mg_dl", formData.creatinine || "1.0");

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: uploadData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Backend response:", data);
        // Navigate to results after processing screen completes
        setTimeout(() => {
          navigate("/results", { state: { result: data } });
        }, 100);
      } else {
        console.error("Upload failed:", response.statusText);
        setIsProcessing(false);
        alert("Failed to upload files. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setIsProcessing(false);
      alert(
        "Error connecting to server. Please ensure the backend is running."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleProcessingComplete = () => {
    // This will be called when the ProcessingScreen animation completes
    // The navigation will happen in handleSubmit after the response
  };

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      setScrolled(scroll);
      if (scroll > 300) setShowForm(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3D Cubes Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cubes = [];
    const cubeCount = 15;

    for (let i = 0; i < cubeCount; i++) {
      cubes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 60 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.15 + 0.05,
      });
    }

    function drawCube(cube) {
      ctx.save();
      ctx.translate(cube.x, cube.y);
      ctx.rotate(cube.rotation);

      const s = cube.size;
      ctx.strokeStyle = `rgba(139, 116, 98, ${cube.opacity})`;
      ctx.lineWidth = 1.5;

      // Front face
      ctx.beginPath();
      ctx.moveTo(-s / 2, -s / 2);
      ctx.lineTo(s / 2, -s / 2);
      ctx.lineTo(s / 2, s / 2);
      ctx.lineTo(-s / 2, s / 2);
      ctx.closePath();
      ctx.stroke();

      // Back face (offset)
      const offset = s * 0.3;
      ctx.beginPath();
      ctx.moveTo(-s / 2 + offset, -s / 2 - offset);
      ctx.lineTo(s / 2 + offset, -s / 2 - offset);
      ctx.lineTo(s / 2 + offset, s / 2 - offset);
      ctx.lineTo(-s / 2 + offset, s / 2 - offset);
      ctx.closePath();
      ctx.stroke();

      // Connecting lines
      ctx.beginPath();
      ctx.moveTo(-s / 2, -s / 2);
      ctx.lineTo(-s / 2 + offset, -s / 2 - offset);
      ctx.moveTo(s / 2, -s / 2);
      ctx.lineTo(s / 2 + offset, -s / 2 - offset);
      ctx.moveTo(s / 2, s / 2);
      ctx.lineTo(s / 2 + offset, s / 2 - offset);
      ctx.moveTo(-s / 2, s / 2);
      ctx.lineTo(-s / 2 + offset, s / 2 - offset);
      ctx.stroke();

      ctx.restore();
    }

    function animate() {
      ctx.fillStyle = "rgba(18, 18, 18, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      cubes.forEach((cube) => {
        cube.rotation += cube.rotationSpeed;
        cube.x += cube.vx;
        cube.y += cube.vy;

        if (cube.x < -100) cube.x = canvas.width + 100;
        if (cube.x > canvas.width + 100) cube.x = -100;
        if (cube.y < -100) cube.y = canvas.height + 100;
        if (cube.y > canvas.height + 100) cube.y = -100;

        drawCube(cube);
      });

      requestAnimationFrame(animate);
    }

    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const titleScale = Math.min(1.2, 0.8 + scrolled / 1000);
  const titleOpacity = Math.max(0, 1 - scrolled / 500);

  if (isProcessing) {
    return <ProcessingScreen onComplete={handleProcessingComplete} />;
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen relative overflow-hidden">
      {/* 3D Cubes Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      
      <div className="relative z-10">
        {/* About Button */}
        <AboutButton />

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
          <div
            style={{
              transform: `scale(${titleScale})`,
              opacity: titleOpacity,
            }}
          >
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-4 bg-[#8B7462]/5 border border-[#8B7462]/20 rounded-full px-8 py-3">
                <Activity size={48} className="text-[#8B7462]" />
                <span className="text- text-[#8B7462] tracking-widest uppercase">
                  Math-Powered Kidney Analysis
                </span>
              </div>
            </div>

            <h1 className="text-8xl md:text-[12rem] font-bold mb-6 leading-none tracking-tight">
              Nephro<span className="text-[#8B7462]">RX</span>
            </h1>

            <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-12 font-light">
              Advanced MRI kidney volume analysis with intelligent prescription
              recommendations
            </p>

            {!showForm && (
              <div className="flex flex-col items-center gap-4 animate-bounce mt-8">
                <span className="text-sm text-[#8B7462] font-light tracking-wide">
                  Scroll down to continue
                </span>
                <ChevronDown size={24} className="text-[#8B7462]" />
              </div>
            )}
          </div>
        </section>

        {/* Form Section */}
        <section
          className={`min-h-screen px-6 py-20 transition-all duration-1000 ${
            showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#1a1a1a]/40 backdrop-blur-xl rounded-none border border-[#8B7462]/10 p-12">
              <div className="mb-10">
                <h2 className="text-3xl font-light mb-2 text-[#8B7462]">
                  Patient Information
                </h2>
                <div className="w-16 h-px bg-[#8B7462]/30 mt-4" />
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-3 uppercase tracking-widest">
                      Age
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-zinc-800 px-0 py-2 text-sm focus:outline-none focus:border-[#8B7462] transition-colors"
                      placeholder="Enter age"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-500 mb-3 uppercase tracking-widest">
                      Sex
                    </label>
                    <select
                      value={formData.sex}
                      onChange={(e) =>
                        setFormData({ ...formData, sex: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-zinc-800 px-0 py-2 text-sm focus:outline-none focus:border-[#8B7462] transition-colors"
                    >
                      <option value="" className="bg-[#1a1a1a]">
                        Select
                      </option>
                      <option value="male" className="bg-[#1a1a1a]">
                        Male
                      </option>
                      <option value="female" className="bg-[#1a1a1a]">
                        Female
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-500 mb-3 uppercase tracking-widest">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-zinc-800 px-0 py-2 text-sm focus:outline-none focus:border-[#8B7462] transition-colors"
                      placeholder="Enter weight"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-500 mb-3 uppercase tracking-widest">
                      Serum Creatinine
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.creatinine}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          creatinine: e.target.value,
                        })
                      }
                      className="w-full bg-transparent border-b border-zinc-800 px-0 py-2 text-sm focus:outline-none focus:border-[#8B7462] transition-colors"
                      placeholder="mg/dL"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-xs text-zinc-500 mb-4 uppercase tracking-widest">
                    MRI Scan
                  </label>
                  <label className="block border border-dashed border-[#8B7462]/20 p-8 text-center hover:border-[#8B7462]/40 transition-colors cursor-pointer">
                    <Upload
                      className="mx-auto mb-3 text-zinc-700"
                      size={32}
                    />
                    <p className="text-zinc-600 mb-1 text-xs">
                      Upload scan file
                    </p>
                    <p className="text-xs text-zinc-700">
                      NIfTI (.nii, .nii.gz) or DICOM (.dcm)
                    </p>
                    <input
                      type="file"
                      onChange={(e) =>
                        setFormData({ ...formData, file: e.target.files[0] })
                      }
                      className="hidden"
                      accept=".nii,.gz,.dcm,application/gzip"
                    />
                  </label>
                  {formData.file && (
                    <p className="text-xs text-[#8B7462] mt-3">
                      {formData.file.name}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={analyzing}
                  className="w-full bg-[#8B7462] hover:bg-[#9d8270] py-3 text-sm font-light tracking-widest uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-8"
                >
                  {analyzing ? "Calculating..." : "Calculate"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#8B7462]/10 px-6 py-12 mt-20">
          <div className="max-w-7xl mx-auto text-center text-zinc-700 text-s font-bold tracking-wide">
            <p className="mt-2">For Hackathon please don't use these values.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}