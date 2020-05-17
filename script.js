//VARIABLES
var citySearch;
var cityLat;
var cityLon;

function makeForecastAPICall() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "e6fe4067ecf4ac4d661a51ad107a4684";
}

if (localStorage.savedCity !== undefined) {
    var lastCity = $("<li>").text(localStorage.savedCity).attr({"class": "list-group-item text-truncate", "id": localStorage.savedCity});
    $("#city-list").append(lastCity);
}

if (citySearch === undefined) {
    citySearch = localStorage.savedCity;
}

$("#search-button").on("click", function(event) {
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
    var newCity = $("<li>").text(citySearch).attr({"class": "list-group-item text-truncate", "id": citySearch});
    $("#city-list").prepend(newCity);
    //SAVE SEARCH
    localStorage.setItem("savedCity", citySearch);
    //CLEAR INPUT
    $("#city-search").val("");
    makeAPICall();
});



makeAPICall();
