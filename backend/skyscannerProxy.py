from flask import Flask
from flask import request
from flask.ext.cors import CORS, cross_origin
import json
import requests
from flask import jsonify
from tinydb import TinyDB, Query

app = Flask(__name__)
CORS(app)
access_token = "ja851974568456353410392187861447"
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
@app.route("/testPost", methods=['POST'])
def testPost():
    if request.headers['Content-Type'] == 'text/plain':
        return "Text Message: " + request.data
    elif request.headers['Content-Type'] == 'application/json':
        return "JSON Message: " + json.dumps(request.json)
    elif request.headers['Content-Type'] == 'application/octet-stream':
        f = open('./binary', 'wb')
        f.write(request.data)
        f.close()
        return "Binary message written!"
    else:
        return "415 Unsupported Media Type ;)" + request.headers['Content-Type']

@app.route("/getAllPosts", methods=['GET'])
def getAllPosts():
    x = db.all()
    x.reverse()
    return jsonify({'resp':x})

if __name__ == "__main__":
    app.run(debug = True, port = 5000)
