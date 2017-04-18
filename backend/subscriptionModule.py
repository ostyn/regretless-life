import re
from flask import Blueprint, request, jsonify
from flask_mail import Message

from bson.objectid import ObjectId
from utilityClass import getDateInMilliseconds
from configMaster import IS_PROD

def construct_blueprint(emailsCollection, mail):
    subscriptionModule = Blueprint('subscriptionModule', __name__)

    @subscriptionModule.route("/subscribe", methods=['POST', 'OPTION'])
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
        if existingEmail is not None:
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
        if IS_PROD:
            mail.send(msg)
        return jsonify({
            'resp':True,
            'msg': 'You have been subscribed. We sent you a test email. Check your spam box, just in case'
        })

    @subscriptionModule.route("/unsubscribe", methods=['GET'])
    def unsubscribe():
        id = request.args.get('id')
        emailsCollection.delete_one({'_id': ObjectId(id)})
        return "Unsubscribed"
    return subscriptionModule