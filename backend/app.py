import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import processing
import calculations

app = Flask(__name__)
# Explicit list of frontends that are allowed to talk to the API
ALLOWED_ORIGINS = {
    "http://localhost:3000",
    "https://www.nephrorx.app",
    "https://nephrorx.app",
}

CORS(app, resources={r"/*": {"origins": list(ALLOWED_ORIGINS)}}, supports_credentials=True)


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin and origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = request.headers.get(
            "Access-Control-Request-Headers", "Authorization,Content-Type"
        )
        response.headers.add("Vary", "Origin")
    else:
        response.headers.setdefault("Access-Control-Allow-Origin", "*")
    return response

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route("/analyze_structural", methods=["POST"])
def analyze_structural():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No JSON body received"}), 400

        vertices = data.get("vertices")
        faces = data.get("faces")

        if vertices is None or faces is None:
            return jsonify({"error": "Missing vertices or faces"}), 400

        if len(vertices) == 0 or len(faces) == 0:
            return jsonify({"error": "Empty vertices or faces"}), 400

        if len(vertices) % 3 != 0:
            return jsonify({"error": "Vertex array cannot reshape to Nx3"}), 400

        if len(faces) % 3 != 0:
            return jsonify({"error": "Face array cannot reshape to Nx3"}), 400

        verts = np.array(vertices, dtype=float).reshape(-1, 3)
        faces = np.array(faces, dtype=int).reshape(-1, 3)

        rough = calculations.calculate_roughness(verts, faces)

        if rough < 1.2:
            rough_label = "Low irregularity, smooth structure less likely tumor."
        elif rough < 1.5:
            rough_label = "Moderate irregularity, some structural variations, potential concern of a tumor."
        else:
            rough_label = "High structural irregularity, considerably a tumor or abnormal growth."

        curvature_info = calculations.compute_curvature_variability(verts, faces)

        cvi = float(curvature_info["curvature_variability_index"])
        mean_curv = float(curvature_info["mean_curvature"])

        if cvi < 0.15:
            curvature_label = "Low curvature variability, smooth surface."
        elif cvi < 0.30:
            curvature_label = "Moderate curvature variability, some surface irregularities."
        else:
            curvature_label = "High curvature variability, abnormal surface features."

        return jsonify({
            "roughness": float(rough),
            "structural_category": rough_label,
            "cvi": cvi,
            "curvature_label": curvature_label,
            "mean_curvature": mean_curv,
            "message": (
                "Geometric irregularities are measured for research and analysis purposes. "
                "These metrics can be indicative to early CKD detection and used for Biological Drug development."
            )
        })

    except Exception as e:
        print("Structural error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/analyze", methods=["POST"])
def analyze():
    for f in os.listdir(UPLOAD_FOLDER):
        os.remove(os.path.join(UPLOAD_FOLDER, f))

    try:
        input_path = ""

        if 'dicom_files' in request.files:
            files = request.files.getlist('dicom_files')
            for f in files:
                f.save(os.path.join(UPLOAD_FOLDER, f.filename))

            input_path = processing.convert_dicom_to_nifti(
                UPLOAD_FOLDER, PROCESSED_FOLDER
            )

        elif 'file' in request.files:
            f = request.files['file']
            input_path = os.path.join(UPLOAD_FOLDER, f.filename)
            f.save(input_path)
        else:
            return jsonify({"error": "No file uploaded"}), 400

        seg_path = processing.run_ai_model(input_path, PROCESSED_FOLDER)
        creatinine_mg_dl = float(request.form.get("creatinine_mg_dl", 1.0))
        results = calculations.process_seg_file(seg_path, creatinine_mg_dl)
        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
