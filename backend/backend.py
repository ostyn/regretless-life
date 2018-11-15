import pymongo
import blogPostModule
import oneDriveModule
import vrtModule
import subscriptionModule
import userModule
import genericModule
import entryStatsModule

from flask import Flask
from flask_cors import CORS
from flask_jwt import JWT
from flask_mail import Mail
from flask_compress import Compress

from authModule import AuthModule

from configMaster import SMTP_USER, SMTP_PASSWORD, GOOGLE_MAPS_KEY

app = Flask(__name__)

connection = pymongo.MongoClient("mongodb://localhost")

postsCollection = connection.blog.posts
usersCollection = connection.blog.users
emailsCollection = connection.blog.emails
activitiesCollection = connection.tracker.activities
moodsCollection = connection.tracker.moods
entriesCollection = connection.tracker.entries

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = SMTP_USER
app.config['MAIL_PASSWORD'] = SMTP_PASSWORD
app.config['MAIL_USE_TLS'] = True
def makeEntry(jsonData):
    return {
        'activities': jsonData.get('activities', {}), 
        'date': jsonData.get('date', ""), 
        'mood': jsonData.get('mood', ""), 
        'note': jsonData.get('note', ""), 
        'time': jsonData.get('time', ""),
        '_id': jsonData.get('_id', None)
    }
entrySortOrder = [("date", pymongo.DESCENDING),("time", pymongo.ASCENDING)]
def makeMood(jsonData):
    return {
        'name': jsonData.get('name', ""), 
        'emoji': jsonData.get('emoji', ""), 
        'rating': jsonData.get('rating', 0),
        '_id': jsonData.get('_id', None)
    }
moodSortOrder = [("rating", pymongo.DESCENDING)]
def makeActivity(jsonData):
    return {
        'name': jsonData.get('name', ""), 
        'emoji': jsonData.get('emoji', ""), 
        'isArchived': jsonData.get('isArchived', False),
        '_id': jsonData.get('_id', None)
    }

authModule = AuthModule(app, usersCollection)
jwt = JWT(app, authModule.authenticate, authModule.identity)
mail = Mail(app)
cors = CORS(app)
compress = Compress(app)

app.register_blueprint(blogPostModule.construct_blueprint(postsCollection, emailsCollection, mail))
app.register_blueprint(oneDriveModule.construct_blueprint())
app.register_blueprint(vrtModule.construct_blueprint())
app.register_blueprint(subscriptionModule.construct_blueprint(emailsCollection, mail))
app.register_blueprint(userModule.construct_blueprint(usersCollection, authModule))
app.register_blueprint(entryStatsModule.construct_blueprint(entriesCollection, entrySortOrder))
app.register_blueprint(genericModule.construct_blueprint("entries", entriesCollection, makeEntry, entrySortOrder), url_prefix="/entries")
app.register_blueprint(genericModule.construct_blueprint("moods", moodsCollection, makeMood, moodSortOrder), url_prefix="/moods")
app.register_blueprint(genericModule.construct_blueprint("activities", activitiesCollection, makeActivity), url_prefix="/activities")

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

if __name__ == "__main__":
    app.run(debug = True, port = 5000, host='0.0.0.0')
