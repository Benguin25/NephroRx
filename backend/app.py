from flask import Flask, jsonify

# Create the Flask application object
app = Flask(__name__)

# Define a simple health check route
@app.route("/health", methods=["GET"])
def health():
    # Return a small JSON payload so we know the server is up
    return jsonify({
        "status": "ok",
        "service": "nephrorx-backend"
    })

# Only run the development server if we execute this file directly
if __name__ == "__main__":
    # Start Flask in debug mode on localhost:5000
    app.run(debug=True)
