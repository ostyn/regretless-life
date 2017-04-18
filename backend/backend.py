import pymongo
import re
import blogPostModule
import oneDriveModule
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
access_token = "YOUR_TOKEN_HERE"

app.register_blueprint(blogPostModule.construct_blueprint(postsCollection, mail))
app.register_blueprint(oneDriveModule.construct_blueprint())

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

@app.route("/subscribe", methods=['POST', 'OPTION'])
def subscribe():   
    email = request.json['email'].lower()
    if not re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email):
        return jsonify({
            'resp':False,
            'msg':'This is not a valid email address'
        })
    user = {
        'email': email,
        'date' : getDateInMilliseconds()
    }
    existingEmail = emailsCollection.find_one({'email': email})
    if(existingEmail is not None):
        return jsonify({
            'resp':False,
            'msg':'This email address has already been subscribed'
        })
    id = emailsCollection.insert_one(user).inserted_id
    unsub = '<br><a href="http://regretless.life/data/unsubscribe?id='+str(id)+'">unsubscribe</a><br>'
    subject = "You have been subscribed"
    msg = Message(recipients=[email],
                    sender="info@regretless.life",
                    html= "You have been subscribed to <a href='https://regretless.life'>regretless.life</a>. Unsubscribe if you didn't mean to do this." + unsub,
                    subject=subject)
    mail.send(msg)
    return jsonify({
        'resp':True,
        'msg': 'You have been subscribed. We sent you a test email. Check your spam box, just in case'
    })

@app.route("/unsubscribe", methods=['GET'])
def unsubscribe():
    id = request.args.get('id')
    emailsCollection.delete_one({'_id': ObjectId(id)})
    return "Unsubscribed"

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
