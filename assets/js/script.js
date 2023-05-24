var weatherKey = '68b05ab1b6a722d634f4eaf83ad459db'
var apiNinjaKey = 'c6zYH9j97tY8e4IyXXNHfA==TrC4jZ68YEo2FrrD'
var search = document.querySelector('#search')
var current = document.querySelector('#current')
var future = document.querySelector('#future')
var currentDay = document.querySelector('#current-day')
var day1 = document.querySelector('#day-1')
var day2 = document.querySelector('#day-2')
var day3 = document.querySelector('#day-3')
var day4 = document.querySelector('#day-4')
var day5 = document.querySelector('#day-5')

var allDaysArray = [currentDay, day1, day2, day3, day4, day5]

// display search results
function createCards() {
// append to page
    allDaysArray.forEach(function (day) {
        var card = document.createElement('div');
        card.id = day;
        card.classList.add('card');
        card.style.width = "18rem";

        var cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title', 'text-center');
        cardTitle.textContent = "Today's Weather";

        var cardImg = document.createElement('img');
        cardImg.classList.add('card-img-top');
        //cardImg.src = 'https://openweathermap.org/img/wn/'+weatherIcon+'@2x.png';
        //cardImg.alt = "Weather Card icon";

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
               // var weatherDate;
                var weatherIcon;
                var temp;
                var tempFeelsLike;
                var humidity;
                var windSpeed;
                var windDirection;

                daysData.forEach(function(dayData) {
                   weatherDate = dayjs.unix(dayData.dt)
                  // weatherIcon = dayData.weather[0].icon;
                   temp = dayData.main.temp;
                   tempFeelsLike = dayData.main.feels_like;
                   humidity = dayData.main.humidity;
                   windSpeed = dayData.wind.speed;
                   windDirection = dayData.wind.deg;
                  
                  var dayArray = [weatherDate, weatherIcon, temp, tempFeelsLike, humidity, windSpeed, windDirection];
                  weatherDataArray.push(dayArray);
                  console.log(dayArray)
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
            if (result.length >= 0) {
                var location = result[0]
                var lat = location.latitude
                var lon = location.longitude
                console.log(location);
                getWeather(lat, lon);
            } else {
                console.log("No location found in response.")
            }
        })
        .catch(error => console.error('Error: ', error));
}

var submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', function (event) {
    event.preventDefault();

    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var country = document.getElementById('country').value;
    console.log('Submitted data:', city, state, country);

    userSearch(city, state, country);

});
