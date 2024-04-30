import unittest
from flask import jsonify
from app import db, create_app 
from config import TestConfig

class APITestCase(unittest.TestCase):
    #Setup Method

    def setUp(self):
        #Select Config
        self.app = create_app(TestConfig)

        self.client = self.app.test_client(self)

        #Create table in database(Auto Create)
        with self.app.app_context():
            #Don't need to have "db.init_app(app)" because it has in app.py and it is called
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            #DELETE all table in database
            db.session.remove()                 # Remove the session
            db.drop_all()                       # Drop all tables (cleanup)




    def test_hello_world(self):
        #Send a GET request to the "/recipe/hello" endpoint
        hello_response = self.client.get("/recipe/hello")

        #Get the JSON data from the response
        json_data = hello_response.json

        # print(json)
        self.assertEqual(json_data, {"message": "Hello World"})

        # Check if the status code is 200 (OK)
        self.assertEqual(hello_response.status_code, 200)

        self.assertIn("message", json_data)
        self.assertEqual(json_data["message"], "Hello World")




    def test_signup(self):
        signup_response = self.client.post("/auth/signup",
            json={
                "username": "testuser",
                "password": "password",
                "email": "testuser@test.com",
            }
        )
        self.assertEqual(signup_response.status_code, 201)




    def test_login(self):
        #Signup First
        signup_response = self.client.post("/auth/signup",
            json={
                "username": "testuser",
                "password": "password",
                "email": "testuser@test.com",
            }
        )
        self.assertEqual(signup_response.status_code, 201)
        
        #Login Second
        login_response = self.client.post("/auth/login",
            json={
                "username": "testuser",
                "password": "password"
            }
        )
        self.assertEqual(login_response.status_code, 200)
        json_data = login_response.json
        # print(json_data)




    def test_get_all_recipes(self):
        all_recipes_response = self.client.get("/recipe/recipes")

        self.assertEqual(all_recipes_response.status_code,200)
        data_json = all_recipes_response.json
        # print(data_json)




    def test_get_one_recipe(self):
        id = 7
        one_recipe_response = self.client.get(f"/recipe/recipe/{id}")

        self.assertEqual(one_recipe_response.status_code, 404)
        data_json = one_recipe_response.json
        # print(data_json)



    def test_create_recipe(self):
        #Signup First to login user
        signup_response = self.client.post("/auth/signup",
            json={
                "username": "testuser",
                "password": "password",
                "email": "testuser@test.com",
            }
        )
        self.assertEqual(signup_response.status_code, 201)
        
        #Login Second to get access_token
        login_response = self.client.post("/auth/login",
            json={
                "username": "testuser",
                "password": "password"
            }
        )
        self.assertEqual(login_response.status_code, 200)

        json_data = login_response.json

        #get access_token from response
        access_token = login_response.json["access_token"]
        # print(access_token)

        #Create Third
        create_response = self.client.post("recipe/recipes",
            json={
                "title": "Game",
                "description": "ROV2"
            },
            headers={"Authorization":f"Bearer {access_token}"

            }
        )
        self.assertEqual(create_response.status_code, 201)

        data_json = create_response.json

        # print(data_json)



    def test_update_recipe(self):
        #Signup First to login user
        signup_response = self.client.post("/auth/signup",
            json={
                "username": "testuser",
                "password": "password",
                "email": "testuser@test.com",
            }
        )
        self.assertEqual(signup_response.status_code, 201)
        
        #Login Second to get access_token
        login_response = self.client.post("/auth/login",
            json={
                "username": "testuser",
                "password": "password"
            }
        )
        self.assertEqual(login_response.status_code, 200)

        json_data = login_response.json

        #get access_token from response
        access_token = login_response.json["access_token"]
        # print(access_token)

        #Create Third
        create_response = self.client.post("recipe/recipes",
            json={
                "title": "Game",
                "description": "ROV2"
            },
            headers={"Authorization":f"Bearer {access_token}"

            }
        )
        self.assertEqual(create_response.status_code, 201)

        #Uppdate or edit Fourth
        id = 1
        update_response = self.client.put(f"/recipe/recipe/{id}",
            json={
                "title": "Game and Viedo Updated",
                "description": "ROV and RedDead Updated"
            },
            headers={
                "Authorization":f"Bearer {access_token}"
            }
        )
        self.assertEqual(update_response.status_code, 200)
        data_json = update_response.json


        # print(data_json)
    
    def test_delete_recipe(self):
        #Signup First to login user
        signup_response = self.client.post("/auth/signup",
            json={
                "username": "testuser",
                "password": "password",
                "email": "testuser@test.com",
            }
        )
        self.assertEqual(signup_response.status_code, 201)
        
        #Login Second to get access_token
        login_response = self.client.post("/auth/login",
            json={
                "username": "testuser",
                "password": "password"
            }
        )
        self.assertEqual(login_response.status_code, 200)

        json_data = login_response.json

        #get access_token from response
        access_token = login_response.json["access_token"]
        # print(access_token)

        #Create Third
        create_response = self.client.post("recipe/recipes",
            json={
                "title": "Game",
                "description": "ROV2"
            },
            headers={
                "Authorization":f"Bearer {access_token}"
            }
        )
        self.assertEqual(create_response.status_code, 201)


        #Delete Fourth
        id = 1
        delete_response = self.client.delete(f"/recipe/recipe/{id}",
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )
        self.assertEqual(delete_response.status_code, 200)

        data_json = delete_response.json

        # print(data_json)


if __name__ == "__main__":
    unittest.main()


