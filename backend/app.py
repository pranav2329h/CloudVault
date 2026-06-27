from flask import Flask
from flask_cors import CORS
from database.db import db

print(db.list_collection_names())
app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return {
        "project": "CloudVault",
        "version": "1.0.0",
        "status": "Backend Running Successfully"
    }

if __name__ == "__main__":
    app.run(debug=True)