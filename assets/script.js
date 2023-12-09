const APIkey = '43df22ce1c12a61a731c8b2fb38e3be0';
const cityInputEl = document.querySelector('#city');
const historyEl = document.querySelector('#history');
const fiveDayForecastEl = document.querySelector('#fiveForecast');
const currentForecastEl = document.querySelector('#currentForecast');

const formSubmitHandler = function(event) {
  event.preventDefault();

  const cityInput = cityInputEl.value.trim();

 // Function to store city in local storage
function storeCity(city) {
  let storedCities = JSON.parse(localStorage.getItem('cities')) || [];
  storedCities.push(city);
  localStorage.setItem('cities', JSON.stringify(storedCities));
}
storeCity(cityInput); // Store city in local storage

// Function to display cities from local storage
function displayStoredCities() {
  historyEl.innerHTML = ''; // Clear previous content
  let storedCities = JSON.parse(localStorage.getItem('cities')) || [];
  storedCities.forEach(city => {
    const listEl = document.createElement('li');
    listEl.classList.add('list-group-item');
    listEl.textContent = city;
    historyEl.appendChild(listEl);
  });
}

// Display stored cities when the page loads
displayStoredCities();

function displayCurrentCity() {
  document.getElementById("currentCity").textContent = cityInput;}
  
  if (cityInput) {
    displayCurrentCity(cityInput); // Call displayCurrentCity with cityInput as a parameter
  }

// Event listener for clicking a city in the history
historyEl.addEventListener('click', event => {
  if (event.target && event.target.nodeName === 'LI') {
    const selectedCity = event.target.textContent.trim();
    if (selectedCity) {
      getGeoLocation(selectedCity)
        .then(locationData => {
          const { lat, lon } = locationData[0];
          return Promise.all([getFiveForecast(lat, lon), getCurrentForecast(lat, lon)]);
        })
        .then(([fiveDayData, currentDayData]) => {
          displayFiveDayForecast(fiveDayData); // Display the five-day forecast
          displayCurrentDayForecast(currentDayData); // Display the current day's forecast
        })
        .catch(error => {
          console.error('Error:', error);
          alert('There was an error fetching the forecast.');
        });
      }
    }
  });

  if (cityInput) {
    getGeoLocation(cityInput)
      .then(locationData => {
        const { lat, lon} = locationData[0];
        return Promise.all([getFiveForecast(lat, lon), getCurrentForecast(lat, lon)]); // Pass cityName
      })
      .then(([fiveDayData, currentDayData]) => {
        displayFiveDayForecast(fiveDayData); // Display the five-day forecast
        displayCurrentDayForecast(currentDayData); // Pass cityName to displayCurrentDayForecast
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error fetching the forecast.');
      });
  } else {
    alert('Please enter a city name');
  }
};

function getCurrentForecast(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
  
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      });
  }

function getFiveForecast(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;

  return fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    });
}

function getGeoLocation(cityName) {
  const api = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIkey}`;

  return fetch(api)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(locationData => {
      console.log('Location Data:', locationData); // Add this line to check the retrieved data
      return locationData;
    });
}



// Event listener for form submission
const cityForm = document.querySelector('#city-form');
cityForm.addEventListener('submit', formSubmitHandler);

// Function to display the current day's forecast
function displayCurrentDayForecast(currentDayData) {
    currentForecastEl.innerHTML = ''; // Clear previous content
    
    const temperature = currentDayData.main.temp - 273.15; // Convert temperature from Kelvin to Celsius
    const description = currentDayData.weather[0].description;
    const windSpeed = currentDayData.wind.speed;
    const humidity = currentDayData.main.humidity;
    const weatherIcon = currentDayData.weather[0].icon;

   
    
    // Create HTML elements to display the current day's forecast
    const currentForecastElement = document.createElement('div');
    currentForecastElement.classList.add('current-forecast-item');
  
    const dateElement = document.createElement('p');
    dateElement.textContent = 'Today';
  
    const tempElement = document.createElement('p');
    tempElement.textContent = `Temperature: ${temperature.toFixed(1)}°C`;
  
    const descElement = document.createElement('p');
    descElement.textContent = `Description: ${description}`;
  
    const windElement = document.createElement('p');
    windElement.textContent = `Wind Speed: ${windSpeed} m/s`;
  
    const humidityElement = document.createElement('p');
    humidityElement.textContent = `Humidity: ${humidity}%`;

    const iconElement = document.createElement('img');
    iconElement.src = `https://openweathermap.org/img/w/${weatherIcon}.png`; // Use HTTPS for the icon URL
    iconElement.alt = 'Weather Icon';
  
    // Append elements to the current day forecast container
    currentForecastElement.appendChild(dateElement);
    currentForecastElement.appendChild(tempElement);
    currentForecastElement.appendChild(descElement);
    currentForecastElement.appendChild(windElement);
    currentForecastElement.appendChild(humidityElement);
    currentForecastElement.appendChild(iconElement);
    
    // Update the HTML content
    currentForecastEl.appendChild(currentForecastElement);

   
}
  

  // Displays Five Day Forecast from tomorrow 

  function displayFiveDayForecast(fiveDayData) {
    const forecastContainer = document.querySelector('#fiveForecast');
      
    // Clear previous content
    forecastContainer.innerHTML = '';
    
    // Group forecasts by day starting from tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); 
    
    const fiveDaysLater = new Date(tomorrow);
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 4); 
    
    const groupedForecasts = groupForecastsByDay(fiveDayData.list, tomorrow, fiveDaysLater);
    
    // Display one set of weather information for each day
    Object.keys(groupedForecasts).forEach(day => {
      const dayForecasts = groupedForecasts[day];
      const averageTemp = calculateAverageTemperature(dayForecasts);
      const description = dayForecasts[0].weather[0].description;
      const windSpeed = calculateAverageWindSpeed(dayForecasts);
      const humidity = calculateAverageHumidity(dayForecasts);
      const weatherIcon = dayForecasts[0].weather[0].icon;
    
      // Create a container for each day's forecast details
      const dayContainer = document.createElement('div');
      dayContainer.classList.add('day-container');
    
      // Create elements to display the forecast information for each day
      const dateElement = document.createElement('p');
      dateElement.textContent = new Date(dayForecasts[0].dt * 1000).toDateString();
    
      const tempElement = document.createElement('p');
      tempElement.textContent = `Temperature: ${averageTemp.toFixed(1)}°C`;
    
      const descElement = document.createElement('p');
      descElement.textContent = `Description: ${description}`;
    
      const windElement = document.createElement('p');
      windElement.textContent = `Wind Speed: ${windSpeed.toFixed(1)} m/s`;
    
      const humidityElement = document.createElement('p');
      humidityElement.textContent = `Humidity: ${humidity.toFixed(0)}%`;
    
      const iconElement = document.createElement('img');
      iconElement.src = `http://openweathermap.org/img/w/${weatherIcon}.png`;
      iconElement.alt = 'Weather Icon';
    
      // Append forecast elements to the day container
      dayContainer.appendChild(dateElement);
      dayContainer.appendChild(tempElement);
      dayContainer.appendChild(descElement);
      dayContainer.appendChild(windElement);
      dayContainer.appendChild(humidityElement);
      dayContainer.appendChild(iconElement);
    
      // Append each day's container to the forecast container
      forecastContainer.appendChild(dayContainer);
    });
  }
  
  
  // Function to group forecasts by day within a date range
  function groupForecastsByDay(forecasts, startDate, endDate) {
    const grouped = {};
    forecasts.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      if (date >= startDate && date < endDate) { // Check if within the date range
        const day = date.toDateString();
        if (!grouped[day]) {
          grouped[day] = [];
        }
        grouped[day].push(forecast);
      }
    });
    return grouped;
  }
  
  
  function calculateAverageTemperature(forecasts) {
    const temperatures = forecasts.map(forecast => forecast.main.temp - 273.15); // Convert Kelvin to Celsius
    const total = temperatures.reduce((acc, temp) => acc + temp, 0);
    return total / temperatures.length;
  }
  
function calculateAverageWindSpeed(forecasts) {
  const windSpeeds = forecasts.map(forecast => forecast.wind.speed);
  const total = windSpeeds.reduce((acc, speed) => acc + speed, 0);
  return total / windSpeeds.length;
}

function calculateAverageHumidity(forecasts) {
  const humidities = forecasts.map(forecast => forecast.main.humidity);
  const total = humidities.reduce((acc, humidity) => acc + humidity, 0);
  return total / humidities.length;
}

  