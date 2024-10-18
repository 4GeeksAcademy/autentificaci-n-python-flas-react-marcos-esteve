"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Customer
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from werkzeug.security import check_password_hash , generate_password_hash



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
# CREATING A TOKEN
# @api.route("/login", methods=["POST"])
# def login():
#     email = request.json.get("email")
#     password = request.json.get("password")

#     user = Customer.query.filter_by(email=email).first()

#     if user is None:
#         return jsonify({"msg": "Email incorrecto"}), 401

#     if not check_password_hash(user.password, password):
#         return jsonify({"msg": "Contraseña incorrecta"}), 401

#     access_token = create_access_token(identity=email)
#     return jsonify({"access_token": access_token}), 200


#Dejo esto para ajustar la protección e ide del token (no se si lo usaré)
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
    

##Aquí creo un nuevo user)
@api.route("/signup", methods=["POST"])
def handle_signup():
    email = request.json['email']
    password = request.json['password']

    # Verificar si el email ya existe en la base de datos
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "El email ya está registrado"}), 400
    
    # Hashear la contraseña
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    # Crear un nuevo usuario
    new_user = Customer(
        email=email,
        password=hashed_password,  # Almacenar la contraseña hasheada
        is_active=True
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "Usuario registrado exitosamente"}), 201

@api.route('/checkUser', methods=['POST'])
def check_user_exists():
    email = request.json.get('email')

    if not email:
        return jsonify(message="Email is required"), 400

    if email:
        existing_user = Customer.query.filter_by(email=email).first()
        if existing_user:
            return jsonify(exists=True, message="Email already exists"), 200

    return jsonify(exists=False), 200


#####LOGIN CUTSOMER#####
@api.route("/login", methods=["POST"])
def customer_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = Customer.query.filter_by(email=email).first()

        if user and user.check_password(password):
            access_token = create_access_token(identity={"id": user.id, "email": user.email})
            return jsonify({"msg": "Inicio de sesión exitoso", "access_token": access_token, "user_id": user.id}), 200
        else:
            return jsonify({"msg": "Credenciales incorrectas"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#####POST Customer#####
@api.route('/customers', methods=['POST'])
def create_customer():
    try:
        # Obtener los datos
        data = request.get_json()
        print("Datos recibidos:", data)  # Para verificar qué está llegando
        if not data:
            return jsonify({"msg": "No se han proporcionado datos"}), 400

        # Validar campos obligatorios
        required_fields = ['email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"msg": f"Falta el campo {field}"}), 400

        email = data.get('email')
        password = data.get('password')

        # Añadir el nuevo cliente
        new_customer = Customer(
            email=email,
        )
        new_customer.set_password(password)  # Usar set_password para almacenar la contraseña
           
        # Actualizar la base de datos
        db.session.add(new_customer)
        db.session.commit()
        return jsonify(new_customer.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
