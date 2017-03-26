"""
Routes and views for the flask application.
"""

from flask import render_template, request
from FlaskWebProject1 import app
import json
import urllib2

@app.route('/')
def home():
    """Renders the home page."""
    return render_template('index.html')

@app.route('/results/<id>')
def result(id):
    """Renders the result page."""
    try:
        url = "https://ah.lelah.ga/result"
        data = json.dumps({'id':id})
        req = urllib2.Request(url, data, {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        response = f.read()
        f.close()
        result = json.loads(response)
        fact_p = result["scores"][1]
        hoax_p = result["scores"][2]
        conclude = result["conclusion"]
        unkn_p = result["scores"][3]
        totalp = fact_p + hoax_p + unkn_p
        conclusion = "We cannot conclude anything. It's"
        if conclude == 'hoax':
            conclusion = str(round(100*(hoax_p/totalp),2)) + "% searches said it's"
        elif conclude == 'fact' and fact_p!=0:
            conclusion = str(round(100*(fact_p/totalp),2))  + "% searches said it's"
        return render_template('result.html', result=result, conclusion=conclusion)
    except Exception as e:
        return e

@app.route('/feedback/result', methods=['POST'])
def feedbackResult():
    if request.method == 'POST':
        data = request.json
        data["ip"] = _get_user_ip(request)
        data["browser"] = request.headers.get('User-Agent')
        url = "https://ah.lelah.ga/feedback/result"
        req = urllib2.Request(url, json.dumps(data), {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        response = f.read()
        f.close()
        return response

@app.route('/feedback/reference', methods=['POST'])
def feedbackReference():
    if request.method == 'POST':
        data = request.json
        data["ip"] = _get_user_ip(request)
        data["browser"] = request.headers.get('User-Agent')
        url = "https://ah.lelah.ga/feedback/reference"
        print data
        req = urllib2.Request(url, json.dumps(data), {'Content-Type': 'application/json'})
        f = urllib2.urlopen(req)
        response = f.read()
        f.close()
        return response

def _get_user_ip(request):
    ip = request.headers.get('X-Forwarded-For')
    if ip is None:
        ip = request.remote_addr
    
    return ip