from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config.config import Config
from routes.auth_routes import auth_bp

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY

jwt = JWTManager(app)

CORS(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")


@app.route("/")
def home():
    return {
        "project": "CloudVault",
        "status": "Running"
    }


if __name__ == "__main__":
    app.run(debug=True)