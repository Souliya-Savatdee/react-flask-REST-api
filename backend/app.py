
from flask import Flask
from flask_restx import Api
from flask_jwt_extended import JWTManager 
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

from api.models import db , Recipe, User

from api.recipes import recipes_ns
from api.auth import auth_ns

def create_app(config=None):
    
    app = Flask(__name__)
                                                # app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
                                                # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    if config is not None:
        app.config.from_object(config)
        CORS(app)

        load_dotenv()

        db.init_app(app)
        migrate = Migrate(app,db)
        JWTManager(app)

        api = Api(app, doc='/docs')


        #same as register_blueprint
        api.add_namespace(recipes_ns)
        api.add_namespace(auth_ns)


    #Do nothing
    @app.shell_context_processor
    def make_shell_context():
        print("Executing make_shell_context function...")  # Debugging line
        return{
            "db":db,
            "Recipe": Recipe,
            "User": User
        }

    return app



