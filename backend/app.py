from flask import Flask
from flask import request
from flask.ext.cors import CORS, cross_origin
from flask import jsonify
import json
import requests
import pymongo
import re
app = Flask(__name__)
CORS(app)
access_token = "YOUR_TOKEN_HERE"
connection = pymongo.MongoClient("mongodb://localhost")
postsCollection = connection.blog.posts

@app.route("/airportQuery", methods=['GET'])
def autocomplete():
    query = request.args.get('query')
    headers = {"Content-type": "application/x-www-form-urlencoded"}
    response = requests.get(
    "http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/GB/GBP/en-GB?query=" + query + "&apiKey=" + access_token,
    headers=headers)
    response = json.loads(response.text);
    return jsonify(response)

@app.route("/routeQuery", methods=['GET'])
def routeQuery():
    start = request.args.get('start')
    end = request.args.get('end') 
    date = request.args.get('date') 
    if (request.args.get('end') is None):
        end = "anywhere"
    if (request.args.get('date') is None):
        date = "2016-03"
    headers = {"Content-type": "application/x-www-form-urlencoded"}
    response = requests.get(
    "http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/GB/USD/en-GB/" + start + "/" + end + "/" + date + "?apiKey=" + access_token,
    headers=headers)
    response = json.loads(response.text);
    return jsonify(response)

@app.route("/submitPost", methods=['POST', 'OPTION'])
def submitPost():
    jsonData = request.json
    slug = createSlug(jsonData['title'])
    post = {
        '_id': str(ObjectId()),
        'slug': slug,
        'title': jsonData['title'],
        'author': jsonData['author'],
        'date': jsonData['date'],
        'location': jsonData['location'],
        'content': jsonData['content'],
    }
    id = postsCollection.insert_one(post).inserted_id
    return jsonify({'id':id})

@app.route("/updatePost", methods=['POST', 'OPTION'])
def updatePost():
    jsonData = request.json
    slug = createSlug(jsonData['title'])
    postsCollection.update_one({"_id":jsonData['id']},{"$set":
    {
        "title":jsonData['title'],
        "slug":slug,
        "author":jsonData['author'],
        "location":jsonData['location'],
        "content":jsonData['content'],
        "dateLastEdited":jsonData['date'],
    }})
    return jsonify({'id':jsonData['id']})

@app.route("/findAllPosts", methods=['GET'])
def findAllPosts():
    query = request.args.get('query')
    posts = postsCollection.find(buildQueryObject(query)).sort('date', direction=-1)
    return jsonify({'resp':list(posts)})
    
@app.route("/findNPosts", methods=['GET'])
def findNPosts():
    start = request.args.get('start', 0)
    num = request.args.get('num')
    query = request.args.get('query')
    if not(check_int(start)) or not(check_int(num)):
        return jsonify({'error':"One of the params is not a number"})
    start = int(start)
    num = int(num)
    posts = postsCollection.find(buildQueryObject(query)).sort('date', direction=-1).limit(num).skip(start)
    return jsonify({'resp':list(posts)})

@app.route("/getPost", methods=['GET'])
def getPost():
    id = request.args.get('id')
    post = postsCollection.find_one({'_id':id})
    return jsonify({'resp':post})

def check_int(s):
    if s is None:
        return False
    if isinstance(s, int):
        return True
    if s[0] in ('-', '+'):
    	return s[1:].isdigit()
    return s.isdigit()

def buildQueryObject(query):
    query = query or ""
    return {
            '$or':
            [
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
            ]
        }

def createSlug(title):
    exp = re.compile('\W')
    whitespace = re.compile('\s')
    temp_title = whitespace.sub("_", title)
    return exp.sub('', temp_title).lower()

if __name__ == "__main__":
    app.run(debug = True, port = 5000, host='0.0.0.0')
