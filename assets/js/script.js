var weatherKey = '68b05ab1b6a722d634f4eaf83ad459db'
var apiNinjaKey = 'c6zYH9j97tY8e4IyXXNHfA==TrC4jZ68YEo2FrrD'
var search = document.getElementById('search')
var current = document.getElementById('current')
var future = document.getElementById('future')
var currentDay = document.getElementById('current-day')
var day1 = document.getElementById('day-1')
var day2 = document.getElementById('day-2')
var day3 = document.getElementById('day-3')
var day4 = document.getElementById('day-4')
var day5 = document.getElementById('day-5')


function getWeather(lat, lon) {
    var weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}`
    fetch(weatherAPI, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json()
        })
        .then(data => {
            if (data) {
                console.log(data)
            var data0 = data.list[0]
            var cityName = data.city.name
            var weatherDate = dayjs.unix(data0.dt)
            var weatherIcon = data0.weather.icon 
            var temp = data0.main.temp 
            var tempFeelsLike = data0.main.feels_like
            var humidity = data0.main.humidity 
            var windSpeed = data0.wind.speed 
            var windDirection = data0.wind.deg
            console.log(cityName, weatherDate, weatherIcon, temp, tempFeelsLike, humidity, windSpeed, windDirection)
            } else {
                console.log("No city found")
            }
            // display data in present and future sections on html page
            // needs city name, date, weather condition icon, temp, humidity, wind speed
            // Current, 5-day future
            //search history (logged in local)
        })
        .catch((error) => console.log('Error: ', error));
}
// uses user-entered locations to get coordinates
function userSearch(city, state, country) {
    var geocodeAPI = `https://api.api-ninjas.com/v1/geocoding?city=${city}`
    // if (state or country) then add to API query
    if (state) {
        geocodeAPI += `&state=${state}`;
      }
    if (country) {
      geocodeAPI += `&country=${country}`;
    }
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
        // use getWeather function with the result
        .then(result => {
            if (result.length > 0) {
            var location = result[0]
            var lat = location.latitude
            var lon = location.longitude
            console.log(location);
            } else {
                console.log("No location found in response.")
            }
            getWeather(lat, lon);
        })
        .catch(error => console.error('Error: ', error));
}

var locationForm = document.getElementById('locationForm');

locationForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var country = document.getElementById('country').value;
    console.log('Submitted data:', city, state, country);
    
    userSearch(city, state, country)

});
