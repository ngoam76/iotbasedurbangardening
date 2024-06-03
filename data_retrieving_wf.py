import requests
import time

def get_weather(api_key, city_name):
    base_url = 'http://api.openweathermap.org/data/2.5/weather?'
    complete_url = f'{base_url}q={city_name}&appid={api_key}&units=metric'
    response = requests.get(complete_url)
    
    if response.status_code == 200:
        data = response.json()
        main = data['main']
        weather = data['weather'][0]
        temperature = main['temp']
        pressure = main['pressure']
        humidity = main['humidity']
        weather_description = weather['description']
        
        print(f"\nCity: {city_name}")
        print(f"Temperature: {temperature}°C")
        print(f"Pressure: {pressure} hPa")
        print(f"Humidity: {humidity}%")
        print(f"Weather Description: {weather_description}")
    else:
        print(f"Error: {response.status_code}")

def main():
    # Replace 'your_api_key' with your actual OpenWeatherMap API key
    api_key = '4890013cad9b0ee94bf0edd0d861d569'
    city_name = 'Munich'
    
    while True:
        get_weather(api_key, city_name)
        time.sleep(10)  # Wait for 10 seconds before the next update

if __name__ == "__main__":
    main()