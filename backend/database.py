#Create database via model.py 

from app import app, db

with app.app_context():
    db.create_all()