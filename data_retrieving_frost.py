import requests
import json
import time

# FROST server URL
FROST_SERVER_URL = 'https://gi3.gis.lrg.tum.de/frost/v1.1'

# Function to retrieve data from a specific Datastream
def get_latest_observations(datastream_ids, interval=5):
    while True:
        observations_by_datastream = {}
        for datastream_id in datastream_ids:
            url = f"{FROST_SERVER_URL}/Datastreams({datastream_id})/Observations?$orderby=phenomenonTime%20desc&$top=1"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                observations_by_datastream[datastream_id] = data["value"][0]["result"]
            else:
                print(f"Failed to retrieve data: {response.status_code} {response.reason}")
        #result_value = observations_by_datastream['result']
        yield 'data: {}\n\n'.format(json.dumps(observations_by_datastream))
        time.sleep(interval) 





