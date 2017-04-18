import requests
from furl import furl
from urllib.request import urlopen, unquote
from urllib.parse import urlparse
from flask import Blueprint, request, jsonify, Response, stream_with_context

def construct_blueprint():
    oneDriveModule = Blueprint('oneDriveModule', __name__)
    @oneDriveModule.route("/getAuthkey", methods=['GET'])
    def getAuthkey():
        url = request.args.get('url')
        res = urlopen(url)
        finalurl = res.geturl()
        furled = furl(finalurl)
        return jsonify({'authkey':furled.args['authkey']})

    @oneDriveModule.route('/oneDriveImageProxy', methods=['GET'])
    def oneDriveImageProxy():
        url = unquote(request.args.get('url'))
        parsedUrl = urlparse(url)
        if not (parsedUrl.netloc.endswith('livefilestore.com')):
            return jsonify({'error':"Image source not supported."})
        req = requests.get(url, stream = True)
        resp = Response(stream_with_context(req.iter_content()), content_type = req.headers['content-type'])
        resp.headers['Expires'] = req.headers['Expires']
        resp.headers['Cache-Control'] = req.headers['Cache-Control']
        return resp
    return oneDriveModule