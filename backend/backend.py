import pymongo
import blogPostModule
import oneDriveModule
import subscriptionModule
import userModule
import trackerModule

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

authModule = AuthModule(app, usersCollection)
jwt = JWT(app, authModule.authenticate, authModule.identity)
mail = Mail(app)
cors = CORS(app)
compress = Compress(app)

app.register_blueprint(blogPostModule.construct_blueprint(postsCollection, emailsCollection, mail))
app.register_blueprint(oneDriveModule.construct_blueprint())
app.register_blueprint(subscriptionModule.construct_blueprint(emailsCollection, mail))
app.register_blueprint(userModule.construct_blueprint(usersCollection, authModule))
app.register_blueprint(trackerModule.construct_blueprint(usersCollection, entriesCollection, moodsCollection, activitiesCollection))

if __name__ == "__main__":
    app.run(debug = True, port = 5000, host='0.0.0.0')
