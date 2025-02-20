from flask import Flask, Response, abort, jsonify, redirect, request, session, url_for
from flask_cors import CORS
from database import db
from google.oauth2 import id_token
from google.auth.transport import requests
from environment import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from datetime import datetime
import jwt
import os

# Inicializar la aplicación Flask
# Initializing Flask app
app = Flask(__name__)
app.secret_key = os.urandom(24)

# User session management setup
# login_manager = LoginManager()
# login_manager.init_app(app)

#OAuth 2 client setup
# client = WebApplicationClient(GOOGLE_CLIENT_ID)

# Configure CORS
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# Configurar la base de datos SQLite
# Configuring base sqlite info
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///spartanswap.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route("/signin", methods=["POST"])
def signin():
    try:
        token = request.form["credential"]
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        print(idinfo)
    
        # jsonify returns a response object
        return_data = {}
        if idinfo['hd'] == 'case.edu':
            return_data["jwt_token"] = jwt.encode(
                {
                    'sub': idinfo['sub'], 
                    'name': idinfo['name'], 
                    'iat': datetime.now().timestamp()
                }, 
                app.secret_key, 
                algorithm='HS256'
                )
            return_data["CWRU_validated"] = True
        else:
            return_data["CWRU_validated"] = False
        return jsonify(return_data)
    except Exception as e:
        abort(403)

# @app.route("/login/callback")
# def callback():
#     return "Google login test"


# Crear las tablas en la base de datos con manejo de errores
# Making the datatables with error handling
if __name__ == "__main__":
    try:
        with app.app_context():
            db.create_all()
            print("Base de datos creada exitosamente.")
        app.run(port=5001, debug=True)
    except Exception as e:
        print(f"Error al crear la base de datos: {e}")
