from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config.config import Config
from database.db import ping_database
from routes.auth_routes import auth_bp
from routes.file_routes import file_bp
from routes.profile_routes import profile_bp
from routes.storage_routes import storage_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    jwt = JWTManager(app)
    CORS(
        app,
        resources={r"/api/*": {"origins": Config.CORS_ORIGINS}},
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(file_bp, url_prefix="/api/files")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(storage_bp, url_prefix="/api/storage")

    @jwt.unauthorized_loader
    def handle_missing_token(reason):
        return jsonify({
            "success": False,
            "message": reason or "Missing authorization token",
            "data": None,
        }), 401

    @jwt.invalid_token_loader
    def handle_invalid_token(reason):
        return jsonify({
            "success": False,
            "message": reason or "Invalid authorization token",
            "data": None,
        }), 422

    @jwt.expired_token_loader
    def handle_expired_token(_jwt_header, _jwt_payload):
        return jsonify({
            "success": False,
            "message": "Token has expired",
            "data": None,
        }), 401

    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({
            "success": False,
            "message": "Resource not found",
            "data": None,
        }), 404

    @app.errorhandler(500)
    def handle_internal_error(error):
        return jsonify({
            "success": False,
            "message": "Internal server error",
            "data": None,
        }), 500

    @app.route("/")
    def home():
        return jsonify({
            "project": "CloudVault",
            "status": "Running",
            "version": "1.0.0",
        }), 200

    @app.route("/health")
    @app.route("/api/health")
    def health():
        mongo_ok = ping_database()
        status_code = 200 if mongo_ok else 503
        return jsonify({
            "status": "UP" if mongo_ok else "DEGRADED",
            "service": "CloudVault",
            "mongodb": "UP" if mongo_ok else "DOWN",
        }), status_code

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=Config.PORT,
        debug=Config.DEBUG,
    )
