from flask import request, jsonify, make_response
from flask_restx import Resource ,fields, Namespace
from flask_jwt_extended import jwt_required
from constans.http_status_code import HTTP_200_OK,HTTP_201_CREATED, HTTP_404_NOT_FOUND
from api.models import db , Recipe


recipes_ns = Namespace('recipe',description="A namespace for Recipes")          #like Blueprint



#Format model (serializer)              //@api.marshal_list_with(recipe_model) and @api.marshal_with(recipe_model)
recipe_model = recipes_ns.model(
    "Recipe",
    {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String()

    }
)

# #Format (serializer) manual
# def format_recipe(recipe):
#     return{
#         "id": recipe.id,
#         "title": recipe.title,
#         "description": recipe.description
#     }



# API endpoints
@recipes_ns.route('/hello')
class HelloRecourse(Resource):
    def get(self): 
        return {"message": "Hello World"}
    



@recipes_ns.route('/recipes')
class RecipesResource(Resource):

    @recipes_ns.marshal_list_with(recipe_model)
    def get(self):
        """ GET all recipes"""
        recipes = Recipe.query.order_by(Recipe.id.asc()).all()
        
        # recipe_list = []
        # for recipe in recipes:
        #     recipe_list.append(format_recipe(recipe))

        return recipes,HTTP_200_OK
    
    @recipes_ns.marshal_with(recipe_model)
    @recipes_ns.expect(recipe_model)
    @jwt_required()
    def post(self):
        """Create a new recipe"""

        data = request.get_json()

        new_recipe = Recipe(
            title = data.get('title'),                    #input in body json
            description = data.get('description')         #input in body json
            
        )
        new_recipe.SAVE()
        return new_recipe, HTTP_201_CREATED

        

@recipes_ns.route('/recipe/<int:id>')
class RecipeResource(Resource):

    @recipes_ns.marshal_with(recipe_model)
    def get(self, id):
        """Get a recipe by id"""


        recipe = Recipe.query.get_or_404(id)
        # if recipe is None:
        #     return {'msg': 'No group'}

        # formatted_recipe = (format_recipe(recipe))
        return recipe
    

    @recipes_ns.marshal_with(recipe_model) 
    @jwt_required()
    def put(self,id):
        """Update a recipe by id"""

        recipe_to_update = Recipe.query.get_or_404(id)

        data = request.get_json()

        recipe_to_update.UPDATE(data.get('title'),data.get('description'))
        
        return recipe_to_update,HTTP_200_OK



    @jwt_required()
    def delete(self,id):
        recipe = Recipe.query.get(id)
        if recipe is None:
            return make_response(jsonify({"message": f"Recipe (id:{id}) not found"}),HTTP_404_NOT_FOUND)
        
        recipe.DELETE()
        return make_response(jsonify({"message": f"Recipe (id:{id}) deleted!"}),HTTP_200_OK)

