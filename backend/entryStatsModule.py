from flask import Blueprint, request, jsonify
from flask_jwt import jwt_required, current_identity
from bson import Code
def construct_blueprint(entriesCollection):
    entryStatsModule = Blueprint('entryStatsModule', __name__)
# get available month/year pairs
# build ui around that with buttons for months/pages
# Fill pages with content: new front page view
# Stats button on each month to zoom in
# First widget is calendar with a drop down of available items
# When selected, an item's days will be highlight on calendar
# Second widget is common activities grid.
# Activities ordered by count
# Third, moods pie charted with count

    @entryStatsModule.route("/getMonthsWithEntries", methods=['GET'])
    @jwt_required()
    def getMonthsWithEntries():
        return jsonify({'resp':list(entriesCollection.aggregate(
            [
                {
                '$project':
                    {
                        '_id':0,
                        'dateSubstring': { '$substr': [ "$date", 0, 7 ] },
                    }
                },
                {
                '$group':
                    {
                        "_id":"$dateSubstring"
                    }
                }
            ]
        ))})
    @entryStatsModule.route("/getEntriesFromYearAndMonth", methods=['GET'])
    @jwt_required()
    def getEntriesFromYearAndMonth():
        month = request.args.get('month')
        if (month):
            month = month.zfill(2)
        else:
            month = ""
        year = request.args.get('year',"")
        entries = list(entriesCollection.find({"date":{ "$regex" : "^" + year + "-" + month}}))
        return jsonify({'resp':entries})

    @entryStatsModule.route("/getActivityCount", methods=['GET'])
    @jwt_required()
    def getActivityCount():
        month = request.args.get('month')
        if (month):
            month = month.zfill(2)
        else:
            month = ""
        year = request.args.get('year',"")
        mapc = Code("""function () {
            var keys = Object.keys(this.activities);
              keys.forEach(function(key) {
                emit(key, this.activities[key]);
              }.bind(this));
            }""")
        reducec = Code("""function (key, values) {
                 var total = 0;
                 for (var i = 0; i < values.length; i++) {
                   total += values[i];
                 }
                 return total;
               }""")
        entries = entriesCollection.map_reduce(mapc, reducec, "activity_counts", 
            query={"date":{ "$regex" : "^" + year + "-" + month}}).find()
        entries = sorted(entries, key=lambda d: d['value'], reverse=True)
        return jsonify({'resp':entries})

    @entryStatsModule.route("/getDaysForActivity", methods=['GET'])
    @jwt_required()
    def getDaysForActivity():
        activityId = request.args.get('activityId')
        month = request.args.get('month')
        if (month):
            month = month.zfill(2)
        else:
            month = ""
        year = request.args.get('year',"")
        mapc = Code("""function () {
            var keys = Object.keys(this.activities);
              keys.forEach(function(key) {
               if(activityId === key)
                emit(this.date, this.activities[key]);
              }.bind(this));
            }""")
        reducec = Code("""function (key, values) {
                 var total = 0;
                 for (var i = 0; i < values.length; i++) {
                   total += values[i];
                 }
                 return total;
               }""")
        entries = list(entriesCollection.map_reduce(mapc, reducec, "activity_counts", 
            query={"date":{ "$regex" : "^" + year + "-" + month}},
            scope={"activityId": activityId}).find())
        return jsonify({'resp':entries})

    @entryStatsModule.route("/getMoodEachDay", methods=['GET'])
    @jwt_required()
    def getMoodEachDay():
        month = request.args.get('month')
        if (month):
            month = month.zfill(2)
        else:
            month = ""
        year = request.args.get('year',"")
        mapc = Code("""function () {
                emit(this.date, this.mood);
            }""")
        reducec = Code("""function (key, values) {
                 return values[0];//This doesn't really average moods
               }""")
        entries = entriesCollection.map_reduce(mapc, reducec, "activity_counts", 
            query={"date":{ "$regex" : "^" + year + "-" + month}}).find()
        entries = sorted(entries, key=lambda d: d['_id'])
        return jsonify({'resp':entries})

    return entryStatsModule