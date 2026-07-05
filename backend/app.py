from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config.config import Config
from routes.auth_routes import auth_bp


app = Flask(__name__)

# Load all configuration from Config class
app.config.from_object(Config)

# Initialize extensions
jwt = JWTManager(app)
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")


@app.route("/")
def home():
    return {
        "project": "CloudVault",
        "status": "Running",
        "version": "1.0.0"
    }, 200


@app.route("/health")
def health():
    return {
        "status": "UP",
        "service": "CloudVault"
    }, 200


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
# app.py
print("Jenkins Pipeline Test")