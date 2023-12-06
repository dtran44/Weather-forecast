const APIkey= '43df22ce1c12a61a731c8b2fb38e3be0'
var city;
var cityInputEl = document.querySelector('#city');
var historyEl = document.querySelector('#history');

var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var cityInput = cityInputEl.value.trim();
  
    if (city) {
      getFiveForecast(cityInput);

      history
  
    } else {
      alert('Please enter a city name');
    }
  };


function getFiveForecast() {
    var apiUrl = 'api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={APIkey}';

    return fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
    }

    getFiveForecast()
console.log(getFiveForecast)

function getGeoLocation() {
    var api = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={APIkey}';

    return fetch(api)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
  }

  getGeoLocation()