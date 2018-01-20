from flask import Blueprint, request, jsonify
from flask_jwt import jwt_required
from bson.objectid import ObjectId

def construct_blueprint(usersCollection, entriesCollection, moodsCollection, activitiesCollection):
    trackerModule = Blueprint('trackerModule', __name__)
    @trackerModule.route("/saveEntry", methods=['POST', 'OPTION'])
    def savePost(passedJsonData=None):
        if passedJsonData is None:
            jsonData = request.json
        else:
            jsonData = passedJsonData
        id = ""
        if jsonData.get('_id') is None:
            entry = {
                'activities': jsonData.get('activities', {}), 
                'date': jsonData.get('date', ""), 
                '_id': str(ObjectId()), 
                'mood': jsonData.get('mood', ""), 
                'note': jsonData.get('note', ""), 
                'time': jsonData.get('time', "")
            }
            id = entriesCollection.insert_one(entry).inserted_id
        else:
            entry = {
                'activities': jsonData.get('tags', {}), 
                'date': jsonData.get('tags', ""), 
                'mood': jsonData.get('tags', ""), 
                'note': jsonData.get('note', ""), 
                'time': jsonData.get('tags', "")
            }
            entriesCollection.update_one(
                {"_id":jsonData['_id']},
                {"$set":entry}
            )
            id = jsonData['_id']
        return jsonify({'_id':id})
    return trackerModule