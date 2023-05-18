var weatherKey = '68b05ab1b6a722d634f4eaf83ad459db'
var apiNinjaKey = 'c6zYH9j97tY8e4IyXXNHfA==TrC4jZ68YEo2FrrD'
var search = document.querySelector('#search')
var current = document.querySelector('#current')
var future = document.querySelector('#future')
var allDaysArray = [
    document.querySelector('#current-day'),
    document.querySelector('#day-1'),
    document.querySelector('#day-2'),
    document.querySelector('#day-3'),
    document.querySelector('#day-4'),
    document.querySelector('#day-5')
]

// display search results
function createCards() {
    var displayCity = document.createElement('h1')
    var displayIcon = document.createElement('img')
    var displayTemp = document.createElement('li')
    var displayFeelsLike = document.createElement('li')
    var displayHumidity = document.createElement('li')
    var displayWindSpeed = document.createElement('li')
    var displayWindDir = document.createElement('li')
    // set content
    displayCity.textContent = "City Name";
    displayIcon.src = "path/to/weather-icon.png";
    displayTemp.textContent = "Temperature: 25°C";
    displayFeelsLike.textContent = "Feels like: 28°C";
    displayHumidity.textContent = "Humidity: 75%";
    displayWindSpeed.textContent = "Wind Speed: 10 mph";
    displayWindDir.textContent = "Wind Direction: N";
    // append to page
    allDaysArray.forEach(function (day) {
        var card = document.createElement('div');
        card.id = "current-day";
        card.classList.add('card');
        card.style.width = "18rem";

        var cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title', 'text-center');
        cardTitle.textContent = "Today's Weather";

        var cardImg = document.createElement('img');
        cardImg.classList.add('card-img-top');
        cardImg.src = "path/to/weather-card-icon.png";
        cardImg.alt = "Weather Card icon";

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        var cardText = document.createElement('p');
        cardText.id = "weather-description";
        cardText.classList.add('card-text');
        cardText.textContent = "Some quick example text to build on the card title and make up the bulk of the card's content.";

        var listGroup = document.createElement('ul');
        listGroup.classList.add('list-group', 'list-group-flush');

        var listItems = [
            "Temperature:",
            "Feels like:",
            "Humidity:",
            "Wind Speed:",
            "Wind Direction:"
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

        day.appendChild(card);
    });
}

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
                // create function to get five day's data then have each day create it's own temp variables
                console.log(data)
                var cityName = data.city.name
                // get current and 5 day forecast
                var daysData = [
                    data.list[0],
                    data.list[1],
                    data.list[2],
                    data.list[3],
                    data.list[4],
                    data.list[5]
                ]
                var weatherDataArray = []; // Array to store the created arrays
    
                daysData.forEach(function(dayData) {
                  var weatherDate = dayjs.unix(dayData.dt)
                  var weatherIcon = dayData.weather[0].icon;
                  var temp = dayData.main.temp;
                  var tempFeelsLike = dayData.main.feels_like;
                  var humidity = dayData.main.humidity;
                  var windSpeed = dayData.wind.speed;
                  var windDirection = dayData.wind.deg;
                  
                  var dayArray = [weatherDate, weatherIcon, temp, tempFeelsLike, humidity, windSpeed, windDirection];
                  weatherDataArray.push(dayArray);
                });
                
                console.log(cityName, weatherDate, weatherDataArray);
            } else {
                console.log("No city found")
            }
            // display data in present and future sections on html page
            // needs city name, date, weather condition icon, temp, humidity, wind speed
            // Current, 5-day future
            //search history (logged in local)
            createCards()
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
