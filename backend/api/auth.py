from flask import request, jsonify, make_response
from flask_restx import Resource ,fields, Namespace
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import jwt_required, create_access_token, create_refresh_token, get_jwt_identity,get_jwt
from constans.http_status_code import HTTP_200_OK,HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
from flask_cors import cross_origin
from api.models import db , User


auth_ns = Namespace('auth',description="A namespace for our Authentication")



#Model
signup_model = auth_ns.model(
    'SignUp',
    {
        "username": fields.String(),
        "email": fields.String(),
        "password": fields.String(),
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


    @auth_ns.expect(signup_model)           #expect input
    def post(self):  

        data = request.get_json()

        username = data.get('username')
        password = data.get('password')
        

        
        db_user = User.query.filter_by(username=username).first() 

        if db_user is not None:
            return make_response(jsonify({"message":f'User with username {username} already exists'}),HTTP_400_BAD_REQUEST)

        hash_password = generate_password_hash(data.get('password'))

        new_User = User(
            username = username,                               #input in body json
            email = password,                                     #input in body json
            password = hash_password,
            role_id = 2
        )

        new_User.SAVE()
        # db.session.add(new_User)
        # db.session.commit()

        return make_response(jsonify({"message":"User created successfully "}), HTTP_201_CREATED)
    
    
    


@auth_ns.route('/login')
class Login(Resource):


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

        role = "admin" if db_Username.role_id == 1 else "user"


        access_token = create_access_token(identity = db_Username.id, additional_claims={'role': role})
        refresh_token = create_refresh_token(identity = db_Username.id, additional_claims={'role': role})

        return make_response(jsonify({"access_token":access_token,"refresh_token":refresh_token,"email":db_Username.email}), HTTP_200_OK)



@auth_ns.route("/token/refresh")
class RefreshResource(Resource):


    @jwt_required(refresh=True)
    def get(self):
        try:
            current_user = get_jwt_identity()

            current_token = get_jwt()
            role = current_token['role']

            new_access_token = create_access_token(identity = current_user, additional_claims={'role': role})
            new_refresh_token = create_refresh_token(identity = current_user, additional_claims={'role': role})

            return make_response(jsonify({"access_token": new_access_token, "refresh_token":new_refresh_token}), HTTP_200_OK)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR)