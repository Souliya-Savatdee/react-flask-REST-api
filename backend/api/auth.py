from flask import Blueprint, request, jsonify, make_response
from flask_restx import Resource ,fields, Namespace
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import JWTManager,jwt_required, create_access_token, create_refresh_token, get_jwt_identity
from constans.http_status_code import HTTP_200_OK,HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from flask_cors import cross_origin
from api.models import db , User


auth_ns = Namespace('auth',description="A namespace for our Authentication")

#Model
signup_model = auth_ns.model(
    'SignUp',
    {
        "username": fields.String(),
        "email": fields.String(),
        "password": fields.String()
    }
)
   
login_model = auth_ns.model(
    'Login',
    {
        "username": fields.String(),
        "password": fields.String()
    }
)




# API endpoints
@auth_ns.route('/signup')
class SignUp(Resource):

    @cross_origin(origins='http://localhost:5173', supports_credentials=True)
    @auth_ns.expect(signup_model)           #expect input
    def post(self):  

        data = request.get_json()

        username = data.get('username')

        db_user = User.query.filter_by(username=username).first() 

        if db_user is not None:
            return make_response(jsonify({"message":f'User with username {username} already exists'}),HTTP_400_BAD_REQUEST)

        new_User = User(
            username = data.get('username'),                               #input in body json
            email = data.get('email'),                                     #input in body json
            password = generate_password_hash(data.get('password'))
        )

        new_User.SAVE()
        # db.session.add(new_User)
        # db.session.commit()

        return make_response(jsonify({"message":"User created successfully "}), HTTP_201_CREATED)
    
    
    


@auth_ns.route('/login')
class Login(Resource):

    @cross_origin(origins='http://localhost:5173', supports_credentials=True)
    @auth_ns.expect(login_model)           #expect input
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        db_Username = User.query.filter_by(username=username).first() 

        if not db_Username:
            return make_response(jsonify({"message":"Invalid username/password"}), HTTP_400_BAD_REQUEST) 

        isPassowrdCorrect = check_password_hash(db_Username.password, password)
        if not isPassowrdCorrect:
            return make_response(jsonify({"message":"Invalid username/password"}), HTTP_400_BAD_REQUEST)

        access_token = create_access_token(identity = db_Username.id, additional_claims={'role': "admin"})
        refresh_token = create_refresh_token(identity = db_Username.id)

        return make_response(jsonify({"access_token":access_token,"refresh_token":refresh_token,"email":db_Username.email}), HTTP_200_OK)



@auth_ns.route("/token/refresh")
class RefreshResource(Resource):

    @cross_origin(origins='http://localhost:5173', supports_credentials=True)
    @jwt_required(refresh=True)
    def post(self):

        current_user = get_jwt_identity()

        new_access_token = create_access_token(identity = current_user)
        new_refresh_token = create_refresh_token(identity = current_user)

        return make_response(jsonify({"access_token": new_access_token, "refresh_token":new_refresh_token}), HTTP_200_OK)
