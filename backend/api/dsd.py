from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Recipe

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost/Test_DATA'
db.init_app(app) 

# Set up application context
with app.app_context():
    # Create database tables
    db.create_all()
