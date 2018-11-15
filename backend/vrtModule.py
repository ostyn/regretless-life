import requests
from furl import furl
from flask import Blueprint, request, jsonify, Response, stream_with_context

def construct_blueprint():
    vrtModule = Blueprint('vrtModule', __name__)
    @vrtModule.route("/getRoutes", methods=['GET'])
    def getRoutes():
        url = "https://vrt.routematch.com/feed/masterRoute"
        req = requests.get(url, stream = True)
        return jsonify(req.json())

    @vrtModule.route("/getStopsForRoute", methods=['GET'])
    def getStopsForRoute():
        routeName = request.args.get('routeName')
        url = "https://vrt.routematch.com/feed/stops/" + routeName
        req = requests.get(url, stream = True)
        return jsonify(req.json())

    @vrtModule.route("/getStatusForStop", methods=['GET'])
    def getStatusForStop():
        stopId = request.args.get('stopId')
        url = "https://vrt.routematch.com/feed/departures/byStop/" + stopId
        req = requests.get(url, stream = True)
        return jsonify(req.json())
    return vrtModule