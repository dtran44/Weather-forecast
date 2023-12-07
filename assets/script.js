const APIkey = '43df22ce1c12a61a731c8b2fb38e3be0';
const cityInputEl = document.querySelector('#city');
const historyEl = document.querySelector('#history');
const fiveDayForecastEl = document.querySelector('#fiveForecast');

const formSubmitHandler = function(event) {
  event.preventDefault();

  const cityInput = cityInputEl.value.trim();

  if (cityInput) {
    getGeoLocation(cityInput)
      .then(locationData => {
        const { lat, lon } = locationData[0];
        return getFiveForecast(lat, lon);
      })
      .then(fiveDayData => {
        // Process the five-day forecast data and display it
        displayFiveDayForecast(fiveDayData);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error fetching the forecast.');
      });
  } else {
    alert('Please enter a city name');
  }
};


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
    });
}


// Event listener for form submission
const cityForm = document.querySelector('#city-form');
cityForm.addEventListener('submit', formSubmitHandler);


// Displays Current Day Forecast
function displayCurrentDayForecast(fiveDayData) {
    const currentForecastContainer = document.querySelector('#currentForecast');
    
    // Clear previous content
    currentForecastContainer.innerHTML = '';
  
    // Get today's date in the format "YYYY-MM-DD" for comparison
    const today = new Date().toISOString().split('T')[0];
  
    // Find the forecast for the current day
    const currentDayForecast = fiveDayData.list.find(forecast => {
      const forecastDate = new Date(forecast.dt * 1000).toISOString().split('T')[0];
      return forecastDate === today;
    });
  
    if (currentDayForecast) {
      const temperature = currentDayForecast.main.temp;
      const description = currentDayForecast.weather[0].description;
      const windSpeed = currentDayForecast.wind.speed;
      const humidity = currentDayForecast.main.humidity;
  
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
  
      // Append elements to the current day forecast container
      currentForecastElement.appendChild(dateElement);
      currentForecastElement.appendChild(tempElement);
      currentForecastElement.appendChild(descElement);
      currentForecastElement.appendChild(windElement);
      currentForecastElement.appendChild(humidityElement);
  
      // Update the HTML content
      currentForecastContainer.appendChild(currentForecastElement);
    } else {
      currentForecastContainer.textContent = 'No data available for today.';
    }
  }
  

  // Displays Five Day Forecast from tomorrow 

function displayFiveDayForecast(fiveDayData) {
    const forecastContainer = document.querySelector('#fiveForecast');
  
    // Clear previous content
    forecastContainer.innerHTML = '';
  
    // Group forecasts by day starting from tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date
    const groupedForecasts = groupForecastsByDay(fiveDayData.list, tomorrow);
  
    // Display one set of weather information for each day
    Object.keys(groupedForecasts).forEach(day => {
      const dayForecasts = groupedForecasts[day];
      const averageTemp = calculateAverageTemperature(dayForecasts);
      const description = dayForecasts[0].weather[0].description; // Taking the description from the first forecast of the day
  
      // Create elements to display the forecast information
      const forecastElement = document.createElement('div');
      forecastElement.classList.add('forecast-item');
  
      const dateElement = document.createElement('p');
      dateElement.textContent = new Date(dayForecasts[0].dt * 1000).toDateString(); // Format date as needed
  
      const tempElement = document.createElement('p');
      tempElement.textContent = `Temperature: ${averageTemp.toFixed(1)}°C`; // Display average temperature
  
      const descElement = document.createElement('p');
      descElement.textContent = `Description: ${description}`; // Display weather description
  
      // Append elements to the forecast container
      forecastElement.appendChild(dateElement);
      forecastElement.appendChild(tempElement);
      forecastElement.appendChild(descElement);
  
      forecastContainer.appendChild(forecastElement);
    });
  }
  
  function groupForecastsByDay(forecasts, startDate) {
    const grouped = {};
    forecasts.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      if (date >= startDate) {
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
    const temperatures = forecasts.map(forecast => forecast.main.temp);
    const total = temperatures.reduce((acc, temp) => acc + temp, 0);
    return total / temperatures.length;
  }
  


  