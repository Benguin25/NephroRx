from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

# Create the Flask application object
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configure upload folder
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Define a simple health check route
@app.route("/health", methods=["GET"])
def health():
    # Return a small JSON payload so we know the server is up
    return jsonify({
        "status": "ok",
        "service": "nephrorx-backend"
    })

# Define the file processing endpoint
@app.route("/api/process", methods=["POST"])
def process_files():
    try:
        # Get the creatinine value
        creatinine = request.form.get('creatinine')
        print(f"Creatinine level: {creatinine} mg/dL")
        
        # Get all uploaded files (key is 'medical_images' from frontend)
        files = request.files.getlist('medical_images')
        print(f"Received {len(files)} files")
        
        saved_files = []
        for file in files:
            if file:
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                saved_files.append(filepath)
                print(f"Saved: {filename} (size: {os.path.getsize(filepath)} bytes)")
        
        # TODO: Add your AI/processing logic here
        # For now, just return success
        
        return jsonify({
            'success': True,
            'message': 'Files uploaded successfully',
            'creatinine': creatinine,
            'files_received': len(saved_files),
            'file_paths': saved_files
        })
        
    except Exception as e:
        print(f"Error processing files: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Only run the development server if we execute this file directly
if __name__ == "__main__":
    # Start Flask in debug mode on localhost:5000
    app.run(debug=True, port=5000)
