from flask import Flask, render_template, request, Response, send_from_directory
from data_retrieving_frost import get_latest_observations
from data_retrieving_wf import get_weather

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('dashboard.html')

# @app.route('/dashboard')
# def dashboard():
#     return render_template('dashboard.html')

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('static/css', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('static/js', path)

@app.route('/frost')
def frost():
    datastream_ids = [1059, 1062, 1064, 1065, 1066, 1067, 1068, 1069]
    return Response(get_latest_observations(datastream_ids, interval=5), mimetype='text/event-stream')

@app.route('/weatherforecast')
def weatherforecast():
    api_key = '4890013cad9b0ee94bf0edd0d861d569'
    city_name = 'Munich'
    return Response(get_weather(api_key, city_name, interval=60), mimetype='text/event-stream')
    
if __name__ == '__main__':
    app.run(debug=True, port=5500)
