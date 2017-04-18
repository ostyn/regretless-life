import pymongo
import re
import blogPostModule
import oneDriveModule
import subscriptionModule
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt import JWT, jwt_required, current_identity
from flask_mail import Mail, Message
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

app.register_blueprint(blogPostModule.construct_blueprint(postsCollection, mail))
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

def createMessages(title, id):
    emails = list(emailsCollection.find())
    msgs = []
    message = '<a href="http://regretless.life/#/post/' + id + '">' + title + '</a><br>'
    for email in emails:
        unsub = '<br><a href="http://regretless.life/data/unsubscribe?id='+str(email.get("_id"))+'">unsubscribe</a><br>'
        subject = "New post on regretless.life"
        msg = Message(recipients=[email.get("email")],
                      sender="info@regretless.life",
                      html=message + unsub + "<br>Do not reply to this email",
                      subject=subject)
        msgs.append(msg)
    return msgs

if __name__ == "__main__":
    app.run(debug = True, port = 5000, host='0.0.0.0')
