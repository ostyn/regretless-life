from configMaster import SECRET
from flask_bcrypt import Bcrypt
from datetime import timedelta
from flask import jsonify

class AuthModule():
    def __init__(self, app, usersCollection):
        self.usersCollection = usersCollection
        self.bcrypt = Bcrypt(app)
        app.config['SECRET_KEY'] = SECRET
        app.config['JWT_AUTH_USERNAME_KEY'] = 'email'
        app.config['JWT_EXPIRATION_DELTA'] = timedelta(seconds=3*60*60) # 3 hours

    class User(object):
        def __init__(self, id, username, password, name):
            self.id = username
            self.username = username
            self.name = name
            self.password = password

        def __str__(self):
            return "User(id='%s')" % self.id

    def authenticate(self, username, password):
        user = list(self.usersCollection.find({"_id":username})).pop()
        if user and self.bcrypt.check_password_hash(user.get("password"), password):
            return self.User(user.get("_id"), user.get("_id"), user.get("password"), user.get("name"))
        return

    def identity(self, payload):
        user_id = payload['identity']
        user = list(self.usersCollection.find({"_id":user_id})).pop()
        return self.User(user.get("_id"), user.get("_id"), user.get("password"), user.get("name"))
    
    def registerUser(self, request):
        jsonData = request.json
        user = {
            '_id': jsonData['email'],
            'password': self.bcrypt.generate_password_hash(jsonData['password']),
            'name': jsonData['displayName']
        }
        id = self.usersCollection.insert_one(user).inserted_id
        return jsonify({'id':id})