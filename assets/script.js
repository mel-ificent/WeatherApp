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
        cityButton.setAttribute("class", "btn btn-primary custom-button");
    
        cityHistoryEl.appendChild(cityButton);
        
    }
}

  //Add newly searched city to the saved button list
  function renderNewSavedButtons(){

    
        var cityText = cities[(cities.length-1)];

        var cityButton = document.createElement("button");
        cityButton.textContent = cityText;
        cityButton.setAttribute("data-language", cityText);
        cityButton.setAttribute("class", "btn btn-primary custom-button");
        cityHistoryEl.appendChild(cityButton);
        
    }

//Function for handling form submit when searching forecast for a city
var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
  
    if (city) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
        renderNewSavedButtons();
        getCityForecast(city);
        cityInputEl.value = '';

      
    } else {
      alert('Please enter a city');
    }
  };

  //Function for showing the searched city's forecast
  var getCityForecast = function (city){

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=';

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
    
    var iconUrl = 'http://openweathermap.org/img/w/' + results.weather[0].icon + '.png';
    cityResultsTermEl.innerHTML= searchCity + " " + today.format("MM/DD/YY") + " ";
    weatherIconTodayEl.setAttribute("src",iconUrl);
    var tempConversion = Math.round(((results.main.temp-273.15)*1.8)+32);
    cityTempEl.textContent = tempConversion;
    var speedConversion = Math.round(results.wind.speed/0.44704);
    cityWindEl.textContent = speedConversion;
    cityHumidityEl.textContent = results.main.humidity;
    //cityUVEl.textContent = results.



    for(i=1;i<6;i++){
        var date = moment().add(i, 'days').format("MM/DD/YY"); 
        var dateEntry = document.querySelector("#date" + i);
        dateEntry.textContent = date;
    }

    resultsContainerEl.setAttribute("class","results-card-show");

  };
  
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