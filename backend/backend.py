import pymongo
import re
import blogPostModule
import oneDriveModule
import subscriptionModule
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt import JWT, jwt_required, current_identity
from flask_mail import Mail
from flask_compress import Compress

from bson.objectid import ObjectId
from authModule import AuthModule

from configMaster import SMTP_USER, SMTP_PASSWORD, GOOGLE_MAPS_KEY
from utilityClass import getDateInMilliseconds

app = Flask(__name__)

connection = pymongo.MongoClient("mongodb://localhost")

postsCollection = connection.blog.posts
usersCollection = connection.blog.users
emailsCollection = connection.blog.emails
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = SMTP_USER
app.config['MAIL_PASSWORD'] = SMTP_PASSWORD
app.config['MAIL_USE_TLS'] = True

authModule = AuthModule(app, usersCollection)
jwt = JWT(app, authModule.authenticate, authModule.identity)
mail = Mail(app)
cors = CORS(app)
compress = Compress(app)

app.register_blueprint(blogPostModule.construct_blueprint(postsCollection, emailsCollection, mail))
app.register_blueprint(oneDriveModule.construct_blueprint())
app.register_blueprint(subscriptionModule.construct_blueprint(emailsCollection, mail))

@app.route("/getAvailableUsers", methods=['GET'])
@jwt_required()
def getAvailableUsers():
    users = list(usersCollection.find({},{'_id':1,'name':1}))
    return jsonify({'resp':users})

@app.route("/auth/me", methods=['GET'])
@jwt_required()
def getCurrentUser():
    return jsonify({'resp':current_identity.name})

@app.route("/register", methods=['POST', 'OPTION'])
@jwt_required()
def registerUser():
    return authModule.registerUser(request)

if __name__ == "__main__":
    app.run(debug = True, port = 5000, host='0.0.0.0')
