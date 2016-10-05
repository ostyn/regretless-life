import json
import requests
import pymongo
import re

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_jwt import JWT, jwt_required, current_identity
from flask_mail import Mail, Message

from bson.objectid import ObjectId
from werkzeug.security import safe_str_cmp

from authModule import AuthModule
from skyScannerModule import routeQuery, airportQuery

from configMaster import SMTP_USER, SMTP_PASSWORD

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

access_token = "YOUR_TOKEN_HERE"

@app.route("/airportQuery", methods=['GET'])
def airportQuery():
    return SkyScannerModule.airportQuery(request)

@app.route("/routeQuery", methods=['GET'])
def routeQuery():
    return SkyScannerModule.routeQuery(request)

@app.route("/submitPost", methods=['POST', 'OPTION'])
@jwt_required()
def submitPost():
    jsonData = request.json
    slug = createSlug(jsonData['title'])
    post = {
        '_id': str(ObjectId()),
        'slug': slug,
        'title': jsonData['title'],
        'author': current_identity.name,
        'date': jsonData['date'],
        'location': jsonData['location'],
        'heroPhotoUrl': jsonData['heroPhotoUrl'],
        'content': jsonData['content'],
        'comments': [],
        'isDraft': jsonData.get('isDraft', False),
    }
    id = postsCollection.insert_one(post).inserted_id
    if (not(post.get('isDraft'))):
        messages = createMessages(post)
        with mail.connect() as conn:
            for message in messages:
                conn.send(message)
    return jsonify({'id':id})

@app.route("/updatePost", methods=['POST', 'OPTION'])
@jwt_required()
def updatePost():
    jsonData = request.json
    slug = createSlug(jsonData['title'])
    postsCollection.update_one({"_id":jsonData['id']},{"$set":
    {
        "title":jsonData['title'],
        "slug":slug,
        "location":jsonData['location'],
        "heroPhotoUrl":jsonData['heroPhotoUrl'],
        "content":jsonData['content'],
        "dateLastEdited":jsonData['date'],
        "isDraft": jsonData['isDraft'],
    }})
    return jsonify({'id':jsonData['id']})

@app.route("/deletePost", methods=['DELETE', 'OPTION'])
@jwt_required()
def deletePost():
    id = request.json['id']
    postsCollection.delete_one({"_id":id})
    return jsonify({'resp':True})

@app.route("/submitComment", methods=['POST', 'OPTION'])
def submitComment():
    jsonData = request.json
    postsCollection.update_one({"_id":jsonData['postId']},{"$push":
    {"comments":{
        "name":jsonData['name'],
        "email":jsonData.get('email', ''),
        "date":jsonData['date'],
        "content":jsonData['content'],
    }}})
    msg = Message("New Comment",
                sender="info@regretless.life",
                recipients=["ostyn@live.com", "erikaostyn@gmail.com"],
                html="<html>You just got a new comment from "
                +jsonData['name']
                + " on a post.<br><br> View it <a href=\"http://regretless.life/#/post/" 
                + jsonData['postId'] + "\">here</a>")
    mail.send(msg)
    return jsonify({'id':jsonData['postId']})

@app.route("/deleteComment", methods=['DELETE'])
@jwt_required()
def deleteComment():
    jsonData = request.json
    postsCollection.update_one({"_id":jsonData['postId']},{"$pull":
    {"comments":{
        "name":jsonData['name'],
        "email":jsonData['email'],
        "date":jsonData['date'],
        "content":jsonData['content'],
    }}})
    return jsonify({'id':jsonData['postId']})

@app.route("/findAllDraftPosts", methods=['GET'])
@jwt_required()
def findAllDraftPosts():
    return findAllPosts(True)

@app.route("/findAllPosts", methods=['GET'])
def findAllPosts(isDraft = False):
    query = request.args.get('query')
    posts = postsCollection.find(buildQueryObject(query, isDraft)).sort('date', direction=-1)
    posts = list(posts)
    for post in posts:
        fixOneDriveUrls(post)
    return jsonify({'resp':{'posts': list(posts), 'remainingPosts': 0}})

@app.route("/findNDraftPosts", methods=['GET'])
@jwt_required()
def findNDraftPosts():
    return findNPosts(True)

@app.route("/findNPosts", methods=['GET'])
def findNPosts(isDraft = False):
    query = request.args.get('query')
    start = request.args.get('start', 0)
    num = request.args.get('num')
    if not(check_int(start)) or not(check_int(num)):
        return jsonify({'error':"One of the params is not a number"})
    start = int(start)
    num = int(num)
    posts = postsCollection.find(buildQueryObject(query, isDraft)).sort('date', direction=-1).limit(num).skip(start)
    posts = list(posts)
    for post in posts:
        fixOneDriveUrls(post)
    return jsonify({'resp':{'posts': list(posts), 'remainingPosts': getNumberOfPosts(query)-num-start}})

@app.route("/getDraftPost", methods=['GET'])
@jwt_required()
def getDraftPost():
    return getPost(True)

@app.route("/getPost", methods=['GET'])
def getPost(isDraft = False):
    id = request.args.get('id')
    post = postsCollection.find_one({'_id':id, "isDraft":isDraft})
    fixOneDriveUrls(post)
    return jsonify({'resp':post})

@app.route("/getSurroundingPosts", methods=['GET'])
def getSurroundingPosts():
    date = int(request.args.get('date'))
    nextPost = list(postsCollection.aggregate([{'$match':{'date': {'$gt':date}, 'isDraft':False}}, {'$sort':{'date':1}}, {'$limit':1},{'$project':{'id':'$_id', 'title':1}}]))
    prevPost = list(postsCollection.aggregate([{'$match':{'date': {'$lt':date}, 'isDraft':False}}, {'$sort':{'date':-1}}, {'$limit':1},{'$project':{'id':'$_id', 'title':1}}]))
    if (len(nextPost) > 0):
        nextPost = nextPost[0]
    else:
        nextPost = None
    if (len(prevPost) > 0):
        prevPost = prevPost[0]
    else:
        prevPost = None
    return jsonify({'resp':{'next':nextPost,'prev':prevPost}})

@app.route("/register", methods=['POST', 'OPTION'])
@jwt_required()
def registerUser():
    return authModule.registerUser(request)

@app.route("/subscribe", methods=['POST', 'OPTION'])
def subscribe():   
    email = request.json['email']
    user = {
        'email': email
    }
    id = emailsCollection.insert_one(user).inserted_id
    unsub = '<br><a href="http://regretless.life/data/unsubscribe?id='+str(id)+'">unsubscribe</a><br>'
    subject = "You have been subscribed"
    msg = Message(recipients=[email],
                    sender="info@regretless.life",
                    html= "You have been subscribed to <a href='https://regretless.life'>regretless.life</a>. Unsubscribe if you didn't mean to do this." + unsub,
                    subject=subject)
    mail.send(msg)
    return jsonify({'resp':True})

@app.route("/unsubscribe", methods=['GET'])
def unsubscribe():
    id = request.args.get('id')
    emailsCollection.delete_one({'_id': ObjectId(id)})
    return "Unsubscribed"

def getNumberOfPosts(query, isDraft = False):
    id = request.args.get('id')
    count = postsCollection.find(buildQueryObject(query, isDraft)).count()
    return count

def fixOneDriveUrls(post):
    post["content"] = post["content"].replace('-bn1ap000.files.1drv.com', '.bn1302.livefilestore.com')
    post["heroPhotoUrl"] = post["heroPhotoUrl"].replace('-bn1ap000.files.1drv.com', '.bn1302.livefilestore.com')

def check_int(s):
    if s is None:
        return False
    if isinstance(s, int):
        return True
    if s[0] in ('-', '+'):
    	return s[1:].isdigit()
    return s.isdigit()

def buildQueryObject(query, isDraft):
    query = query or ""
    return {
        '$and': [
            {'$or': [
                {
                    'content':
                    {
                        '$regex':query, '$options':'i'
                    }
                }, 
                {
                    'title':
                    {
                        '$regex':query, '$options':'i'
                    }
                }
            ]},
            {'isDraft': 
            {
                '$eq': isDraft
            }}
        ]
    }

def createSlug(title):
    exp = re.compile('\W')
    whitespace = re.compile('\s')
    temp_title = whitespace.sub("_", title)
    return exp.sub('', temp_title).lower()

def createMessages(post):
    emails = list(emailsCollection.find())
    msgs = []
    message = '<a href="http://regretless.life/#/post/'+post.get("_id")+'">' + post.get("title") + '</a><br>'
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
