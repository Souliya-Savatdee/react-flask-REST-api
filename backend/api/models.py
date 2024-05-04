from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Table, Text, text

db = SQLAlchemy()

# class User(db.Model):
#     id = Column(Integer, primary_key=True)
#     email = Column(String(120), unique=True, nullable=False)
#     password = Column(String(80), unique=False, nullable=False)
#     is_active = Column(Boolean(), unique=False, nullable=False)

#     def __repr__(self):
#         return f'<User {self.email}>'

#     def serialize(self):
#         return {
#             "id": self.id,
#             "email": self.email,
#             # do not serialize the password, its a security breach
#         }
    
class Recipe(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(120), nullable=False)
    description = Column(Text(), nullable=False)

    def __repr__(self):
        return f'<Recipe {self.title}>'
    
    def SAVE(self):
        db.session.add(self)
        db.session.commit()

    def DELETE(self):
        db.session.delete(self)
        db.session.commit()

    def UPDATE(self, title, description):
        self.title = title
        self.description = description
        db.session.commit()

    #format serialize
    # def serialize(self):
    #     return {
    #         'id': self.id,
    #         'title': self.title,
    #         'description': self.description
    #     }

class User(db.Model):
    __tablename__ = 'user'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(25), nullable=False,unique=True)
    email = Column(String(80), nullable=False)
    password = Column(String(170), nullable=False)
    role_id = Column(Integer, nullable=False)
    
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def SAVE(self):
        db.session.add(self)
        db.session.commit()

