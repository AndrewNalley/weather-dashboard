var weatherKey = '68b05ab1b6a722d634f4eaf83ad459db'
var apiNinjaKey = 'c6zYH9j97tY8e4IyXXNHfA==TrC4jZ68YEo2FrrD'
var cardContainer = document.querySelector('#card-container')
var currentLocation = document.querySelector('#current-location')
var search = document.querySelector('#search')
var searchHistory = document.querySelector('#search-history')
var current = document.querySelector('#current')
var future = document.querySelector('#future')
var currentDay = document.querySelector('#current-day')
var day1 = document.querySelector('#day-1')
var day2 = document.querySelector('#day-2')
var day3 = document.querySelector('#day-3')
var day4 = document.querySelector('#day-4')
var day5 = document.querySelector('#day-5')
cityName = document.querySelector('#city-name')
var daysElements = [currentDay, day1, day2, day3, day4, day5];
// Retrieve data from local storage
var lastFiveSelections = localStorage.getItem('lastFiveSelections');
if (lastFiveSelections) {
    var locationData = JSON.parse(lastFiveSelections);
    // Display the values on the page
    var searches = document.createElement('li')
    searches.classList.add('h6')
    searches.textContent = locationData.city, locationData.state, locationData.country
    searchHistory.appendChild(searches)
}

// display search results

function getWeather(lat, lon, currentDay, day1, day2, day3, day4, day5) {
    var weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}`;
    fetch(weatherAPI, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log(data);
                var cityName = document.createElement('h1');
                cityName.textContent = data.city.name;
                currentLocation.innerHTML = ''
                currentLocation.appendChild(cityName)

                var daysData = [
                    data.list[0],
                    data.list[8],
                    data.list[16],
                    data.list[24],
                    data.list[32],
                    data.list[39]
                ];
                var weatherDate;
                var weatherIcon;
                var weatherDescription;
                var tempC;
                var tempF;
                var tempFeelsLikeC;
                var tempFeelsLikeF;
                var humidity;
                var windSpeed;

                daysData.forEach(function (dayData, index) {
                    weatherDate = dayjs.unix(dayData.dt).format('MMMM D')
                    weatherIcon = dayData.weather[0].icon
                    weatherDescription = dayData.weather[0].description
                    tempC = dayData.main.temp - 273.15;
                    tempF = (tempC * 9/5) + 32;
                    tempFeelsLikeC = dayData.main.feels_like - 273.15;
                    tempFeelsLikeF = (tempFeelsLikeC * 9/5) + 32;
                    humidity = dayData.main.humidity;
                    windSpeed = dayData.wind.speed;

                    var card = document.createElement('div');
                    card.classList.add('card');
                    card.style.width = '18rem';
                    card.style.backgroundColor = '#5bc0de';

                    var cardTitle = document.createElement('h5');
                    cardTitle.classList.add('card-title', 'text-center');
                    cardTitle.textContent = weatherDate;

                    var cardImg = document.createElement('img');
                    cardImg.setAttribute('src', 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png')
                    cardImg.classList.add('card-img-top', 'center-image');
                    cardImg.style.width = '50%';
                    cardImg.style.height = 'auto';

                    var cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    var cardText = document.createElement('p');
                    cardText.id = "weather-description";
                    cardText.classList.add('card-text');
                    cardText.textContent = weatherDescription.toUpperCase();

                    var listGroup = document.createElement('ul');
                    listGroup.classList.add('list-group', 'list-group-flush');

                    var listItems = [
                        "Temp: " + tempC.toFixed(1) + " C° / " + tempF.toFixed(0) + " F°",
                        "Feels like: " + tempFeelsLikeC.toFixed(1) + " C° / " + tempFeelsLikeF.toFixed(0) + " F°",
                        "Humidity: " + humidity + "%",
                        "Wind Speed: " + windSpeed.toFixed(0) + " kph / " + (windSpeed / 1.609).toFixed(0) + " mph"
                    ];

                    listItems.forEach(function (itemText) {
                        var listItem = document.createElement('li');
                        listItem.classList.add('list-group-item');
                        listItem.textContent = itemText;
                        listGroup.appendChild(listItem);
                    });

                    card.appendChild(cardTitle);
                    card.appendChild(cardImg);
                    card.appendChild(cardBody);
                    cardBody.appendChild(cardText);
                    cardBody.appendChild(listGroup);

                    daysElements[index].innerHTML = ''; // Clear existing content of the day element
                    daysElements[index].appendChild(card); // Append the card to the day element
                });
            } else {
                currentLocation.innerHTML = 'No city found';
            }
        })
        .catch((error) => console.log('Error: ', error));
}
// display data in present and future sections on HTML page
// needs city name, date, weather condition icon, temp, humidity, wind speed
// Current, 5-day future
// search history (logged in local)
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
                currentLocation.innerHTML = 'Request failed'
                throw new Error('Request failed');
            }
            return response.json();
        })
        // use getWeather function with the result
        .then(result => {
            if (result.length >= 0) {
                var location = result[0]
                var lat = location.latitude
                var lon = location.longitude
                console.log(location);
                getWeather(lat, lon);
            } else {
                currentLocation.innerHTML = 'No location found in response.'

            }
        })
        .catch(error => {
            if (error) {
                currentLocation.innerHTML = 'Unable to get results for this location.';
                console.error('Error:', error);
            }
        });
}

var submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    currentLocation.innerHTML = 'LOADING......'

    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var country = document.getElementById('country').value;
    console.log('Submitted data:', city, state, country);
    // Store values in local storage
    var locationData = {
        city: city,
        state: state,
        country: country
    };
    localStorage.setItem('lastFiveSelections', JSON.stringify(locationData));

    userSearch(city, state, country);
});
