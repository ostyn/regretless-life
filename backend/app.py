from flask import Flask
from flask import request
from flask.ext.cors import CORS, cross_origin
import json
import requests
from flask import jsonify
from tinydb import TinyDB, Query

app = Flask(__name__)
CORS(app)
access_token = "YOUR_TOKEN_HERE"
db = TinyDB('db.json')

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
    title=jsonData['title']
    author=jsonData['author']
    date=jsonData['date']
    location=jsonData['location']
    content=jsonData['content']
    id = db.insert({
		'title': title, 
		'author': author,
		'date': date, 
		'place': location,
		'content': content
	})
    return json.dumps({'id':id})
    
@app.route("/findAllPosts", methods=['GET'])
def findAllPosts():
    query = request.args.get('query')
    posts = db.all()
    posts = reverse_and_id_posts(posts)
    if query is not None:
        posts = filter_posts(posts, query)
    return jsonify({'resp':posts})
    
@app.route("/findNPosts", methods=['GET'])
def findNPosts():
    start = request.args.get('start', 0)
    num = request.args.get('num')
    query = request.args.get('query')
    if not(check_int(start)) or not(check_int(num)):
        return jsonify({'error':"One of the params is not a number"})
    start = int(start)
    num = int(num)
    
    posts = db.all()
    posts = reverse_and_id_posts(posts)
    if query is not None:
        posts = filter_posts(posts, query)
    posts = posts[start:start+num]
    return jsonify({'resp':posts})

@app.route("/getPost", methods=['GET'])
def getPost():
    id = request.args.get('id')
    post = db.get(eid=int(id))
    return jsonify({'resp':post})

def filter_posts(posts, query):
    filtered = []
    for post in posts:
        if query.lower() in post['content'].lower()  or query.lower() in post['title'].lower():
            filtered.append(post)
    return filtered

def check_int(s):
    if s is None:
        return False
    if isinstance(s, int):
        return True
    if s[0] in ('-', '+'):
    	return s[1:].isdigit()
    return s.isdigit()

def reverse_and_id_posts(posts):
    alteredPosts = []
    for post in posts:
        post['id'] = post.eid
        alteredPosts.insert(0, post)
    return alteredPosts

if __name__ == "__main__":
    app.run(debug = True, port = 5000, host='0.0.0.0')
