import os
from decouple import config
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS',cast=bool)       #same
    

class DevConfig(Config):
    SQLALCHEMY_DATABASE_URI = config('DATABASE_URI')
    JWT_SECRET_KEY = config('JWT_SECRET_KEY')
    
    SQLALCHEMY_ECHO = True
    BEBUG = True
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=3)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=2)
    

class ProdConfig(Config):
    SQLALCHEMY_DATABASE_URI = config('DATABASE_URI')
    JWT_SECRET_KEY = config('JWT_SECRET_KEY')

    
    DEBUG = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=2)
    
class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = config('DATABASE_URI_TEST')
    SQLALCHEMY_ECHO = False
    TESTING = True
    
