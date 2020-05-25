from furl import furl
from urllib.request import urlopen
from flask import Blueprint, request, jsonify

def construct_blueprint():
    oneDriveModule = Blueprint('oneDriveModule', __name__)
    @oneDriveModule.route("/getAuthkey", methods=['GET'])
    def getAuthkey():
        url = request.args.get('url')
        res = urlopen(url)
        finalurl = res.geturl()
        furled = furl(finalurl)
        return jsonify({'authkey':furled.args['authkey']})
    return oneDriveModule