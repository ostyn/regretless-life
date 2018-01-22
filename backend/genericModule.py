from flask import Blueprint, request, jsonify
from flask_jwt import jwt_required
from bson.objectid import ObjectId

def construct_blueprint(name, collection, buildItem):
    trackerModule = Blueprint(name + 'Module', __name__)
    @trackerModule.route("/saveItem", methods=['POST', 'OPTION'])
    def saveItem(passedJsonData=None):
        jsonData = passedJsonDataElseRequestData(passedJsonData, request.json)
        item = buildItem(jsonData)
        return jsonify({'_id': upsertToCollection(item, collection)})

    @trackerModule.route("/getItems", methods=['GET'])
    def getItems():
        return jsonify({"items": getAllItemsFromCollection(collection)})

    @trackerModule.route("/getItem", methods=['GET'])
    def getItem():
        return jsonify({"item": getItemFromCollection(request.args.get('id'), collection)})

    @trackerModule.route("/deleteItem", methods=['DELETE'])
    def deleteItem():
        return jsonify({"deleted": deleteItemFromCollection(request.json["id"], collection)})

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