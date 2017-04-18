import json
import geocoder
from flask import Flask, request, jsonify, Blueprint
from flask_jwt import jwt_required
from flask_mail import Mail, Message

from bson.objectid import ObjectId
from configMaster import GOOGLE_MAPS_KEY
import time, datetime

def construct_blueprint(postsCollection):
    blogPostModule = Blueprint('blogPostModule', __name__)

    @blogPostModule.route("/savePost", methods=['POST', 'OPTION'])
    @jwt_required()
    def savePost(passedJsonData=None):
        if passedJsonData is None:
            jsonData = request.json
        else:
            jsonData = passedJsonData
        id = ""
        if jsonData.get('id') is None:
            post = {
                '_id': str(ObjectId()),
                'title': jsonData['title'],
                'author': jsonData['author'],
                'date': getDateInMilliseconds(),
                'heroPhotoUrl': jsonData['heroPhotoUrl'],
                'content': jsonData['content'],
                'comments': [],
                'isDraft': True,
                'images': jsonData['images'],
                'locationInfo': {}
            }
            if('location' in jsonData):
                post['location'] = jsonData['location']
                geocoded = geocoder.google(jsonData['location'], key=GOOGLE_MAPS_KEY)
                post['locationInfo']["latitude"] = geocoded.lat
                post['locationInfo']["longitude"] = geocoded.lng
                post['locationInfo']["country"] = geocoded.country_long
                post['locationInfo']["countryCode"] = geocoded.country
                post['locationInfo']["name"] = jsonData['location']
            id = postsCollection.insert_one(post).inserted_id
        else:
            post = {
                "title":jsonData['title'],
                'author': jsonData['author'],
                "heroPhotoUrl":jsonData['heroPhotoUrl'],
                "content":jsonData['content'],
                "dateLastEdited":getDateInMilliseconds(),
                'isDraft': jsonData['isDraft'],
                'images': jsonData['images'],
                'locationInfo': {}
            }
            if('location' in jsonData):
                post["location"]= jsonData['location']
                geocoded = geocoder.google(jsonData['location'], key=GOOGLE_MAPS_KEY)
                post['locationInfo']["latitude"] = geocoded.lat
                post['locationInfo']["longitude"] = geocoded.lng
                post['locationInfo']["country"] = geocoded.country_long
                post['locationInfo']["countryCode"] = geocoded.country
                post['locationInfo']["name"] = jsonData['location']
            postsCollection.update_one({"_id":jsonData['id']},{"$set":post
            })
            id = jsonData['id']
        return jsonify({'id':id})

    @blogPostModule.route("/publishPost", methods=['POST', 'OPTION'])
    @jwt_required()
    def publishPost():
        jsonData = request.json
        id = json.loads(savePost(jsonData).response[0])["id"]
        postsCollection.update_one({"_id":id},{"$set":
        {
            'date': getDateInMilliseconds(),
            "dateLastEdited":None,
            "isDraft": False,
        }})
        messages = createMessages(jsonData['title'], id)
        with mail.connect() as conn:
            for message in messages:
                conn.send(message)
        return jsonify({'id':id})

    @blogPostModule.route("/unpublishPost", methods=['POST', 'OPTION'])
    @jwt_required()
    def unpublishPost():
        jsonData = request.json
        savePost(jsonData)
        postsCollection.update_one({"_id":jsonData['id']},{"$set":
        {
            "isDraft": True,
        }})
        return jsonify({'id':jsonData['id']})

    @blogPostModule.route("/deletePost", methods=['DELETE', 'OPTION'])
    @jwt_required()
    def deletePost():
        id = request.json['id']
        postsCollection.delete_one({"_id":id})
        return jsonify({'resp':True})


    @blogPostModule.route("/submitAdminComment", methods=['POST', 'OPTION'])
    @jwt_required()
    def submitAdminComment():
        return submitComment(True)

    @blogPostModule.route("/submitComment", methods=['POST', 'OPTION'])
    def submitComment(adminComment=False):
        jsonData = request.json
        comment = {
            "name":jsonData['name'],
            "email":jsonData.get('email', ''),
            "date": getDateInMilliseconds(),
            "content":jsonData['content'],
        }
        if(adminComment):
            comment["admin"] = True
        post = postsCollection.find_one({'_id':jsonData['postId']})
        postsCollection.update_one({"_id":jsonData['postId']},{"$push":
        {"comments":comment}})
        msg = Message("New Comment on " + post['title'] + "!",
                    sender="info@regretless.life",
                    recipients=["ostyn@live.com", "erikaostyn@gmail.com"],
                    html= "You got a new comment!<br><br>" +
                    "Name: "
                    + jsonData['name']
                    + "<br>Email: "
                    + jsonData.get('email', '')
                    + "<br>Post: <a href=\"https://regretless.life/#/post/" 
                    + jsonData['postId'] + "\">" + post['title'] +"</a><br><quote><i>"+ jsonData['content'] + "</i></quote>")
        mail.send(msg)
        return jsonify({'id':jsonData['postId']})

    @blogPostModule.route("/deleteComment", methods=['DELETE'])
    @jwt_required()
    def deleteComment():
        jsonData = request.json
        #Arcane, but mongodb won't let you delete by index, only update
        #So we update and then pull based on the update
        postsCollection.update_one(
            {"_id":jsonData['postId']},
            {"$unset":
                {"comments."+ str(jsonData['index']) : True}
            })
        postsCollection.update_one(
            {"_id":jsonData['postId']},
            {"$pull":
                {"comments" : None}
            })
        return jsonify({'id':jsonData['postId']})

    @blogPostModule.route("/findAllDraftPosts", methods=['GET'])
    @jwt_required()
    def findAllDraftPosts():
        return findAllPosts(True)

    @blogPostModule.route("/findAllPosts", methods=['GET'])
    def findAllPosts(isDraft = False):
        query = request.args.get('query')
        posts = postsCollection.find(buildQueryObject(query, isDraft), {"comments.email": False}).sort('date', direction=-1)
        return jsonify({'resp':{'posts': list(posts), 'remainingPosts': 0}})

    @blogPostModule.route("/findNDraftPosts", methods=['GET'])
    @jwt_required()
    def findNDraftPosts():
        return findNPosts(True)

    @blogPostModule.route("/findNPosts", methods=['GET'])
    def findNPosts(isDraft = False):
        query = request.args.get('query')
        start = request.args.get('start', 0)
        num = request.args.get('num')
        if not(check_int(start)) or not(check_int(num)):
            return jsonify({'error':"One of the params is not a number"})
        start = int(start)
        num = int(num)
        posts = postsCollection.find(buildQueryObject(query, isDraft), {"comments.email": False}).sort('date', direction=-1).limit(num).skip(start)
        return jsonify({'resp':{'posts': list(posts), 'remainingPosts': getNumberOfPosts(query, isDraft)-num-start}})

    @blogPostModule.route("/getDraftPost", methods=['GET'])
    @jwt_required()
    def getDraftPost():
        return getPost(True)

    @blogPostModule.route("/getPost", methods=['GET'])
    def getPost(isDraft = False):
        id = request.args.get('id')
        post = postsCollection.find_one({'_id':id, "isDraft":isDraft}, {"comments.email": False, "location": False})
        return jsonify({'resp':post})

    @blogPostModule.route("/getSurroundingPosts", methods=['GET'])
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

    @blogPostModule.route("/getAllPostsByLocation", methods=['GET'])
    def getAllPostsByLocation(isDraft = False):
        years = postsCollection.aggregate([
        {  
            '$match':{ 
                '$and':[  
                    {  
                    'locationInfo.countryCode':{
                        '$exists':"true"
                    }
                    },
                    {  
                    'locationInfo.countryCode':{  
                        '$ne':None
                    } 
                    }
                ],
                'isDraft':{  
                    '$eq':isDraft
                }
            }
        },
        {
            '$project' : {
                '_id' : "$_id",
                'title':1,
                'date':1,
                'locationInfo':1,
                'year' : {'$year':{'$add': [datetime.datetime(1970, 1, 1, 0, 0), "$date"]}}
            }
        },
        {
            '$group':{  
                '_id':{  
                    'country':'$locationInfo.country',
                    'countryCode':'$locationInfo.countryCode',
                    'year':'$year'
                },
                'posts':{  
                    '$push':{  
                        'title':'$title',
                        'id':'$_id',
                        'date':'$date',
                        'location':'$locationInfo.name'
                    }
                }
            }
        },
        {
            '$sort':{
                '_id.country':1,
            }
        },
        {
            '$group':{  
                '_id':{  
                    'year':'$_id.year'
                },
                'locations':{  
                    '$push':{  
                        'posts':'$posts',
                        'country': '$_id.country',
                        'countryCode':'$_id.countryCode'
                    }
                }
            }
        },
        {
            '$sort':{
                '_id.year':1
            }
        },
        ])

        return jsonify({'resp':{'years': list(years)}})

    def getNumberOfPosts(query, isDraft = False):
        id = request.args.get('id')
        count = postsCollection.find(buildQueryObject(query, isDraft)).count()
        return count

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
    return(blogPostModule)