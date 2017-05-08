from flask import Blueprint, request, jsonify
from flask_jwt import jwt_required, current_identity
def construct_blueprint(usersCollection, authModule):
    userModule = Blueprint('userModule', __name__)

    @userModule.route("/getAvailableUsers", methods=['GET'])
    @jwt_required()
    def getAvailableUsers():
        users = list(usersCollection.find({}, {'_id':1, 'name':1}))
        return jsonify({'resp':users})

    @userModule.route("/auth/me", methods=['GET'])
    @jwt_required()
    def getCurrentUser():
        return jsonify({'resp':current_identity.name})

    @userModule.route("/register", methods=['POST', 'OPTION'])
    @jwt_required()
    def registerUser():
        return authModule.registerUser(request)
    return userModule