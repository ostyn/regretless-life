from flask import Blueprint, request, jsonify
from flask_jwt import jwt_required, current_identity
from bson import Code
def construct_blueprint(entriesCollection):
    entryStatsModule = Blueprint('entryStatsModule', __name__)

    @entryStatsModule.route("/getEntriesFromMonthAndYear", methods=['GET'])
    def getEntriesFromMonthAndYear():
        month = request.args.get('month')
        if (month):
            month = month.zfill(2)
        else:
            month = ""
        year = request.args.get('year',"")
        entries = list(entriesCollection.find({"date":{ "$regex" : "^" + year + "-" + month}}))
        return jsonify({'resp':entries})

    @entryStatsModule.route("/getActivityCount", methods=['GET'])
    def getActivityCount():
        month = request.args.get('month')
        if (month):
            month = month.zfill(2)
        else:
            month = ""
        year = request.args.get('year',"")
        mapc = Code("function () {"
            "var keys = Object.keys(this.activities);"
            "  keys.forEach(function(key) {"
            "    emit(key, this.activities[key]);"
            "  }.bind(this));"
            "}")
        reducec = Code("function (key, values) {"
               "  var total = 0;"
               "  for (var i = 0; i < values.length; i++) {"
               "    total += values[i];"
               "  }"
               "  return total;"
               "}")
        entries = list(entriesCollection.map_reduce(mapc, reducec, "activity_counts", query={"date":{ "$regex" : "^" + year + "-" + month}}).find())
        return jsonify({'resp':entries})

    return entryStatsModule