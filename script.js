//VARIABLES
var citySearch;
var cityLat;
var cityLon;

if (localStorage.savedCity !== undefined) {
    var lastCity = $("<li>").text(localStorage.savedCity).attr({ "class": "list-group-item text-truncate", "id": localStorage.savedCity });
    $("#city-list").append(lastCity);
}

if (citySearch === undefined) {
    citySearch = localStorage.savedCity;
}

$("#search-button").on("click", function (event) {
    event.preventDefault();
    citySearch = $(this).prev().val();
    if (citySearch === "") {
        return;
    }
    //CITY SEARCH API CALL
    if (citySearch === localStorage.savedCity) {
        makeAPICall();
        return;
    }
    //CLEAR STORAGE
    localStorage.clear();
    //NEW SEARCH
    var newCity = $("<li>").text(citySearch).attr({ "class": "list-group-item text-truncate", "id": citySearch });
    $("#city-list").prepend(newCity);
    //SAVE SEARCH
    localStorage.setItem("savedCity", citySearch);
    //CLEAR INPUT
    $("#city-search").val("");
    makeAPICall();
});

$("ul").on("click", function (event) {
    event.preventDefault();
    citySearch = event.target.id;
    makeAPICall();
});

function makeAPICall() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=e6fe4067ecf4ac4d661a51ad107a4684";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            populateData(response);
            console.log(response);
        });

function populateData(response) {
    var iconCode = "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
    cityLat = response.coord.lat;
    cityLon = response.coord.lon;
        $("#current-city").html(`${citySearch} (${moment().format("M/D/YYYY")})`);
        $("#weather-icon").attr("src", iconCode).height(50);
        $("#temperature").html(`Temperature: ${((response.main.temp - 273.15) * 1.8 + 32).toFixed(0)} &#8457`);
        $("#humidity").html(`Humidity: ${response.main.humidity}%`);
        $("#wind-speed").html(`Wind Speed: ${response.wind.speed} MPH`);


    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=e6fe4067ecf4ac4d661a51ad107a4684&lat=" + cityLat + "&lon=" + cityLon,
        method: "GET"
    })

         .then(function (response) {
            $("#uv-index").html(`UV Index: `);
            $("#uv-index-value").html(`${response.value}`);
            //UV INDEX
                if (response.value >= 11) {
                    $("#uv-index-value").css("background-color", "#ae739f");
                } else if (response.value >= 8) {
                    $("#uv-index-value").css("background-color", "#ed4950");
                } else if (response.value >= 6) {
                    $("#uv-index-value").css("background-color", "#f28a3e");
                } else if (response.value >= 3) {
                    $("#uv-index-value").css("background-color", "#f4d631");
                } else {
                    $("#uv-index-value").css("background-colr", "#78a234");
                }
            });
    }
    makeForecastAPICall();
}

function makeForecastAPICall() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=46ef9cf3388c1ee5870a9fa681588d0f";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            console.log(response);
            populateForecastData(response);
        });

    function populateForecastData(response) {
        //ELEMENT IDS
        var dayDate = [$("#day-1-date"), $("#day-2-date"), $("#day-3-date"), $("#day-4-date"), $("#day-5-date")];
        var dayIcon = [$("#day-1-icon"), $("#day-2-icon"), $("#day-3-icon"), $("#day-4-icon"), $("#day-5-icon")];
        var dayTemp = [$("#day-1-temp"), $("#day-2-temp"), $("#day-3-temp"), $("#day-4-temp"), $("#day-5-temp")];
        var dayHumidity = [$("#day-1-humidity"), $("#day-2-humidity"), $("#day-3-humidity"), $("#day-4-humidity"), $("#day-5-humidity")];
        var listNumbers = [3, 11, 19, 27, 35];

        for (var i = 0; i < dayDate.length; i++) {
            dayDate[i].html(`${moment().add((i + 1), "d").format("M/D/YYYY")}`);
            dayIcon[i].attr("src", "https://openweathermap.org/img/wn/" + response.list[listNumbers[i]].weather[0].icon + ".png");
            dayTemp[i].html(`Temp: ${((response.list[listNumbers[i]].main.temp - 273.15) * 1.8 + 32).toFixed(0)} &#8457`);
            dayHumidity[i].html(`Humidity: ${response.list[listNumbers[i]].main.humidity}%`);
        }
    }
}

makeAPICall();