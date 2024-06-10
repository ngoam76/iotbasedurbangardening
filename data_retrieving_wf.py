import requests
import time
import json

def get_weather(api_key, city_name, interval=60):
    while True:
        weather_values = {}
        base_url = 'http://api.openweathermap.org/data/2.5/weather?'
        complete_url = f'{base_url}q={city_name}&appid={api_key}&units=metric'
        backoff_time = interval
        
        while True:
            response = requests.get(complete_url)
            if response.status_code == 200:
                data = response.json()
                main = data['main']
                wind = data['wind']
                weather = data['weather'][0]
                weather_values['Temperature'] = main['temp']
                weather_values['Wind Speed'] = wind['speed']
                weather_values['Humidity'] = main['humidity']
                weather_values['Weather description'] = weather['description']
                yield 'data: {}\n\n'.format(json.dumps(weather_values))
                break
            elif response.status_code == 429:
                print(f"Failed to retrieve data: {response.status_code}. Retrying in {backoff_time} seconds.")
                time.sleep(backoff_time)
                backoff_time *= 2  # Exponential backoff
            else:
                print(f"Failed to retrieve data: {response.status_code}")
                break
        
        time.sleep(interval)


def main():
    # Replace 'your_api_key' with your actual OpenWeatherMap API key
    api_key = '4890013cad9b0ee94bf0edd0d861d569'
    city_name = 'Munich'
    
    while True:
        get_weather(api_key, city_name)
        time.sleep(10)  # Wait for 10 seconds before the next update

if __name__ == "__main__":
    main()