var weatherKey = '68b05ab1b6a722d634f4eaf83ad459db'
var apiNinjaKey = 'c6zYH9j97tY8e4IyXXNHfA==TrC4jZ68YEo2FrrD'
var lat = ''
var lon = ''
var search = document.getElementById('search')
var current = document.getElementById('current')
var future = document.getElementById('future')
// API to take in city and state and return coordinates
var geocodeAPI = `https://api.api-ninjas.com/v1/geocoding?${city}${state}${country}`
var weatherAPI = 'api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + weatherKey

// takes user input and applies to location variables
function userEntry() {
    var city = ''
    var state = ''
    var country = ''
}
// uses user-entered locations to get coordinates
function userSearch(city, state, country) {
    fetch(geocodeAPI, {
        method: 'GET',
        headers: {
            'X-Api-Key': apiNinjaKey,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then(result => {
        console.log(result);
      })
      .catch(error => console.error('Error: ', error));
}

function getWeather() {
    lat = userLat
    lon = userLon
    fetch(weatherAPI)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        // display data in present and future sections on html page
    })
    .catch((error) => console.log('Error: ', error));
}
