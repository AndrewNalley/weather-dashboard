myKey = "68b05ab1b6a722d634f4eaf83ad459db"
var lat = ""
var lon = ""
var search = document.getElementById("search")
var current = document.getElementById("current")
var future = document.getElementById("future")

var weatherAPI = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + myKey

function getWeather() {
    lat = userLat
    lon = userLon
    fetch(weatherAPI)
}
