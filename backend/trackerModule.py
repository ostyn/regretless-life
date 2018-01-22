from flask import Blueprint, request, jsonify
from flask_jwt import jwt_required
from bson.objectid import ObjectId

def construct_blueprint(usersCollection, entriesCollection, moodsCollection, activitiesCollection):
    trackerModule = Blueprint('trackerModule', __name__)

    @trackerModule.route("/saveEntry", methods=['POST', 'OPTION'])
    def saveEntry(passedJsonData=None):
        jsonData = passedJsonDataElseRequestData(passedJsonData, request.json)
        entry = {
            'activities': jsonData.get('activities', {}), 
            'date': jsonData.get('date', ""), 
            'mood': jsonData.get('mood', ""), 
            'note': jsonData.get('note', ""), 
            'time': jsonData.get('time', ""),
            '_id': jsonData.get('_id', None)
        }
        return jsonify({'_id': upsertToCollection(entry, entriesCollection)})

    @trackerModule.route("/getEntries", methods=['GET'])
    def getEntries():
        return jsonify({"entries": getAllItemsFromCollection(entriesCollection)})

    @trackerModule.route("/getEntry", methods=['GET'])
    def getEntry():
        return jsonify({"entry": getItemFromCollection(request.args.get('id'), entriesCollection)})

    @trackerModule.route("/deleteEntry", methods=['DELETE'])
    def deleteEntry():
        return jsonify({"deleted": deleteItemFromCollection(request.json["id"], entriesCollection)})

    def passedJsonDataElseRequestData(passedJsonData, requestData):
        if passedJsonData is None:
            return requestData
        else:
            return passedJsonData

    def upsertToCollection(item, collection):
        if(item["_id"] is None):
            item["_id"] = str(ObjectId())
            id = collection.insert_one(item).inserted_id
        else:
            collection.update_one(
                {"_id":jsonData['_id']},
                {"$set":item})
            id = jsonData['_id']
        return id

    def getAllItemsFromCollection(collection):
        return list(collection.find())

    def getItemFromCollection(id, collection):
        return collection.find_one({'_id':id})

    def deleteItemFromCollection(id, collection):
        return collection.remove({'_id':id})

    return trackerModule