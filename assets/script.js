//Event Listeners 
var cityInputEl = document.querySelector('#city');
var searchFormEl = document.querySelector('#search-form');
var cityHistoryEl = document.querySelector('#city-history');
var cityResultsTermEl = document.querySelector('#city-search-term');
var cityResultsEl = document.querySelector('#city-result');
var resultsContainerEl = document.querySelector('#results-container');
var fiveDayForecastEl = document.querySelector('#five-day-forecast');
var weatherIconTodayEl = document.querySelector('#weatherIconToday');

var cityTempEl = document.querySelector('#city-temp');
var cityWindEl = document.querySelector('#city-wind');
var cityHumidityEl = document.querySelector('#city-humidity');
var cityUVEl = document.querySelector('#city-uv');


//five day forecast event listeners
var dateEntry;
var weatherIconEl;
var dailyTempEl;
var dailyWindEl;
var dailyHumidityEl;
var dailyIconUrl='';

//Other helpful variables
var UVI;
var alreadySearched = false;
var lat='';
var lon='';

//Local storage values
var cities = [];


//When page loads, identify whether there are any cities saved to local storage, if so update the history buttons

function init() {
    // Get stored cities from localStorage
    var storedCities = JSON.parse(localStorage.getItem("cities"));
  
    // If cities were retrieved from localStorage, update the cities array to it
    if (storedCities !== null) {
      cities = storedCities;
    }
  
    // This is a helper function that will render saved city button to the DOM
    renderSavedButtons();
  }

  //Display saved cities as buttons
function renderSavedButtons(){

    for(i=0;i<cities.length;i++){
        var cityText = cities[i];

        var cityButton = document.createElement("button");
        cityButton.textContent = cityText;
        cityButton.setAttribute("data-language", cityText);
        cityButton.setAttribute("class", "btn btn-secondary custom-button");
    
        cityHistoryEl.appendChild(cityButton);
        
    }
}

  //Add newly searched city to the saved button list
  function renderNewSavedButtons(){

    
        var cityText = cities[(cities.length-1)];

        var cityButton = document.createElement("button");
        cityButton.textContent = cityText;
        cityButton.setAttribute("data-language", cityText);
        cityButton.setAttribute("class", "btn btn-secondary custom-button");
        cityHistoryEl.appendChild(cityButton);
        
    }

//Function for handling form submit when searching forecast for a city
var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
  
    if (city) {
        getCityForecast(city);
        cityInputEl.value = '';

      
    } else {
      alert('Please enter a city');
    }
  };

  //Function for showing the searched city's forecast
  var getCityForecast = function (city){

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=5c8dfc04b68cb99eeda7ee2cce5551ed';

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displayForecast(data, city);
          });
        } else {
          alert('Error loading data');
        }
      });
    };



  //After getting results from API, add them to page
  var displayForecast = function (results, searchCity) {
    var  today = moment();
    if (results.length === 0) {
      cityResultsTermEl.textContent = 'No results found for city';
      return;
    }
    
    //store searched city name, but only if it has not been searched before
    for(i=0;i<cities.length;i++){
      if(searchCity.toUpperCase() === cities[i].toUpperCase()){
        alreadySearched = true;
        i = cities.length;
      }
      else{
        alreadySearched=false;
      }
    }
    if(!alreadySearched){
      cities.push(results.name);
      localStorage.setItem("cities", JSON.stringify(cities));
      renderNewSavedButtons();
    }


//Begin updating city weather results to DOM
    var iconUrl = 'http://openweathermap.org/img/w/' + results.weather[0].icon + '.png';
    cityResultsTermEl.innerHTML= results.name + " " + today.format("MM/DD/YY") + " ";
    weatherIconTodayEl.setAttribute("src",iconUrl);
    cityTempEl.textContent = results.main.temp;
    cityWindEl.textContent = results.wind.speed;
    cityHumidityEl.textContent = results.main.humidity;
    lat = results.coord.lat;
    lon = results.coord.lon;

    
//Now call function to get five day forecast details and also UVI
  getCityFiveDayForecast(lat,lon);

  };

//Function for calling API to get additional five day forecast and UV indicator details
  var getCityFiveDayForecast = function (lat,lon){

    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&units=imperial&appid=5c8dfc04b68cb99eeda7ee2cce5551ed';

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displayFiveDayForecast(data);
          });
        } else {
          alert('Error loading data');
        }
      });
    };

var displayFiveDayForecast= function (data){

  //If else statement to add specific styling to UVI based on status
    UVI= data.current.uvi;
    if(UVI<3){
      cityUVEl.setAttribute("class","UVGreen");
    }
    else if(UVI<6){
      cityUVEl.setAttribute("class","UVModerate");
    }

    else if(UVI<8){
      cityUVEl.setAttribute("class","UVHigh");
    }

    else if(UVI<11){
      cityUVEl.setAttribute("class","UVVeryHigh");
    }
    else{
      cityUVEl.setAttribute("class","UVExtreme");

    }
    cityUVEl.textContent = UVI;

//Loop through the next five days and update weather details
    for(i=1;i<6;i++){
      dateEntry = document.querySelector("#date" + i);
      weatherIconEl = document.querySelector('#weatherIcon'+ i);
      dailyTempEl = document.querySelector('#city-temp'+ i);
      dailyWindEl = document.querySelector('#city-wind' + i);
      dailyHumidityEl = document.querySelector('#city-humidity'+ i);

      //Set the date, converted from Unix
      var unixDate = data.daily[i].dt;
      var date = moment.unix(unixDate).format("MM/DD/YY");
      dateEntry.textContent = date;

      //set the icon
      dailyIconUrl = 'http://openweathermap.org/img/w/' + data.daily[i].weather[0].icon + '.png';
      weatherIconEl.setAttribute("src",dailyIconUrl);

      //set temperatures
      dailyTempEl.textContent = data.daily[i].temp.day;


      //set wind
      dailyWindEl.textContent = data.daily[i].wind_speed;


      //set humidity
      dailyHumidityEl.textContent = data.daily[i].humidity;


  }

  resultsContainerEl.setAttribute("class","results-card-show");

}
  //Function for triggering a weather search based on clicking a history button
  var buttonClickHandler = function (event) {
    var cityHistory = event.target.getAttribute('data-language');
  
    if (cityHistory) {
      getCityForecast(cityHistory);

    }
 };

init();
searchFormEl.addEventListener('submit', formSubmitHandler);
cityHistoryEl.addEventListener('click',buttonClickHandler);