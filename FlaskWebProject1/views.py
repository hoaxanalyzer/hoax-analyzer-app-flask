"""
Routes and views for the flask application.
"""

from flask import render_template, request
from FlaskWebProject1 import app
import requests,json


@app.route('/')
def home():
    """Renders the home page."""
    return render_template('index.html')

@app.route('/results/<id>')
def result(id):
    """Renders the result page."""
    url = 'https://ah.lelah.ga/result'
    headers = {'Content-Type':'application/json'}
    data = {'id':id}
    r = requests.post(url, data=json.dumps(data), headers=headers)
    result =  r.json()
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

@app.route('/feedback/result', methods=['POST'])
def feedbackResult():
    if request.method == 'POST':
        data = request.json
        data["ip"] = _get_user_ip(request)
        data["browser"] = request.headers.get('User-Agent')
        url = 'https://ah.lelah.ga/feedback/result'
        headers = {'Content-Type':'application/json'}
        print data
        r = requests.post(url, data=json.dumps(data), headers=headers)
        result = r.json()
        return json.dumps(result)

@app.route('/feedback/reference', methods=['POST'])
def feedbackReference():
    if request.method == 'POST':
        data = request.json
        data["ip"] = _get_user_ip(request)
        data["browser"] = request.headers.get('User-Agent')
        url = 'https://ah.lelah.ga/feedback/reference'
        headers = {'Content-Type':'application/json'}
        print data
        r = requests.post(url, data=json.dumps(data), headers=headers)
        result = r.json()
        return json.dumps(result)

def _get_user_ip(request):
    ip = request.headers.get('X-Forwarded-For')
    if ip is None:
        ip = request.remote_addr
    
    return ip