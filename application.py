from flask import Flask, render_template, request, Response
from data_retrieving_frost import poll_latest_observations

#export to HTML
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    datastream_ids = [1059, 1062, 1064, 1065, 1066, 1067, 1068, 1069]
    return Response(poll_latest_observations(datastream_ids, interval=10), mimetype='text/event-stream')
    
if __name__ == '__main__':
    app.run(debug=True, port=5500)