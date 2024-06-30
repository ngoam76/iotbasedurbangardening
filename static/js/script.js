document.addEventListener('DOMContentLoaded', () => {
    const toggleBtnLeft = document.getElementById('toggle-btn-left');
    const sidebarLeft = document.getElementById('sidebar-left');
    const toggleBtnRight = document.getElementById('toggle-btn-right');
    const sidebarRight = document.getElementById('sidebar-right');
    const alertBox = document.querySelector('header .alert');
    const closeAlertBtn = document.getElementById('close-alert');
    const openAlertBtn = document.getElementById('open-alert');
    const header = document.querySelector('header');
    const expandBtns = document.querySelectorAll('.expandBtn');
    const closeBtns = document.querySelectorAll('.closeBtn');
  
    toggleBtnLeft.addEventListener('click', () => {
        sidebarLeft.classList.toggle('minimized');
    });
  
    toggleBtnRight.addEventListener('click', () => {
        sidebarRight.classList.toggle('minimized');
    });
  
    closeAlertBtn.addEventListener('click', () => {
        alertBox.classList.add('hide');
        header.classList.add('hide');
        openAlertBtn.style.display = 'block';
    });
  
    openAlertBtn.addEventListener('click', () => {
        alertBox.classList.remove('hide');
        header.classList.remove('hide');
        openAlertBtn.style.display = 'none';
    });

    expandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card');
            const overlay = card.querySelector('.overlay');
            const expandedCard = overlay.querySelector('.expanded-card');

            const cardRect = card.getBoundingClientRect();
            const sidebarRect = card.closest('aside').getBoundingClientRect();

            expandedCard.style.width = `${sidebarRect.width}px`;
            expandedCard.style.height = `${sidebarRect.height}px`;
            expandedCard.style.top = `${cardRect.top - sidebarRect.top}px`;
            expandedCard.style.left = `${cardRect.left - sidebarRect.left}px`;
            
            overlay.style.display = 'block';

            setTimeout(() => {
                expandedCard.style.width = '100%';
                expandedCard.style.height = '100%';
                expandedCard.style.top = '0';
                expandedCard.style.left = '0';
            }, 10); // Allow CSS to apply the initial size first
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = btn.closest('.overlay');
            overlay.style.display = 'none';
        });
    });
});

  
  // Key-to-name mapping
  var keyToNameMapping = {
    1059: "temperature-value",
    1062: "pressure-value",
    // 1064: "gas-value",
    1065: "humidity-value",
    1066: "visible-light-value",
    1067: "infrared-value",
    1068: "uv-value",
    1069: "soil-moisture-value",
  };


  
  // Function to update the frost data on the web page
  function updateFrostData(data) {
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var elementId = keyToNameMapping[key];
            if (elementId) {
                document.getElementById(elementId).innerText = data[key];
            }
        }
    }
  }
  
  function updateWeatherWidget(data) {
    console.log("Received data:", data);  // Log the entire data object

    const weatherDescription = data['Weather description'];
    
    if (!weatherDescription) {
        console.error("Weather data is missing or malformed:", data);
        return;
    }

    // Round the temperature value
    const roundedTemperature = Math.round(data['Temperature']);

    document.querySelector('.weatherwidget .temp').innerHTML = `${roundedTemperature}°C`;
    document.querySelector('.weatherwidget .value_humidity').innerHTML = `${data['Humidity']}%`;
    document.querySelector('.weatherwidget .value_wind').innerHTML = `${data['Wind Speed']} km/h`;

    const weatherIcon = document.querySelector('.weatherwidget .weather-icon');

    console.log("Weather condition:", weatherDescription);  // Log the weather condition

    if (weatherDescription.includes("clouds")) {
        weatherIcon.src = "/static/images/weather/w_cloud.png";
    } else if (weatherDescription.includes("clear")) {
        weatherIcon.src = "/static/images/weather/w_clear_day.png";
    } else if (weatherDescription.includes("rain")) {
        weatherIcon.src = "/static/images/weather/w_rainy.png";
    } else if (weatherDescription.includes("drizzle")) {
        weatherIcon.src = "/static/images/weather/w_rainy_light.png";
    } else if (weatherDescription.includes("snow")) {
        weatherIcon.src = "/static/images/weather/w_snowing.png";
    } else {
        console.warn("Unknown weather condition:", weatherDescription);  // Log if the condition doesn't match any cases
    }

    const weatherWidget = document.querySelector(".weatherwidget");
    if (weatherWidget) {
        weatherWidget.style.display = "block";
    } else {
        console.error("Element with class 'weatherwidget' not found in the DOM.");
    }
  }

  // Function to fetch real-time frost data from the server
  function fetchFrostData() {
    fetch("/frost")
        .then((response) => response.text())
        .then((data) => {
            var jsonData = JSON.parse(data.slice(6)); // Remove 'data: ' prefix
            updateFrostData(jsonData);
        })
        .catch((error) => console.error("Error:", error));
  }
  
  // Function to fetch real-time weather forecast data from the server
  function fetchWeatherForecastData() {
    fetch("/weatherforecast")
        .then((response) => response.text())
        .then((data) => {
            var jsonData = JSON.parse(data.slice(6)); // Remove 'data: ' prefix
            updateWeatherWidget(jsonData);  // Ensure the function name matches
        })
        .catch((error) => console.error("Error:", error));
  }
  
  function fetchData() {
    fetchFrostData();
    fetchWeatherForecastData();
  }
  
  // Function to create EventSource object to receive real-time frost data updates
  function connectToFrostSSE() {
    var frostEventSource = new EventSource("/frost");
  
    // Event listener for receiving data updates
    frostEventSource.onmessage = function (event) {
        var data = JSON.parse(event.data);
        updateFrostData(data);
    };
  
    // Event listener for handling SSE errors
    frostEventSource.onerror = function (error) {
        console.error("frostEventSource failed:", error);
        // Automatically reconnect after SSE error
        setTimeout(connectToFrostSSE, 1000);
    };
  }
  
  // Function to create EventSource object to receive real-time weather data updates
  function connectToWeatherForecastSSE() {
    var weatherForecastEventSource = new EventSource("/weatherforecast");
  
    // Event listener for receiving data updates
    weatherForecastEventSource.onmessage = function (event) {
        var data = JSON.parse(event.data);
        updateWeatherWidget(data);  // Ensure the function name matches
    };
  
    // Event listener for handling SSE errors
    weatherForecastEventSource.onerror = function (error) {
        console.error("weatherForecastEventSource failed:", error);
        // Automatically reconnect after SSE error
        setTimeout(connectToWeatherForecastSSE, 1000);
    };
  }
  
  // Fetch real-time data initially
  fetchData();
  
  // Connect to SSE for real-time updates
  connectToFrostSSE();
  connectToWeatherForecastSSE();
  