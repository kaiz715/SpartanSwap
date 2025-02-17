from flask import Flask
from database import db

# Inicializar la aplicación Flask
# Initializing Flask app
app = Flask(__name__)

# Configurar la base de datos SQLite
# Configuring base sqlite info
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///spartanswap.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


@app.route("/")
def hello_world():
    return "Hello, World!"


# Crear las tablas en la base de datos con manejo de errores
# Making the datatables with error handling
if __name__ == "__main__":
    try:
        with app.app_context():
            db.create_all()
            print("Base de datos creada exitosamente.")
        app.run(debug=True)
    except Exception as e:
        print(f"Error al crear la base de datos: {e}")
