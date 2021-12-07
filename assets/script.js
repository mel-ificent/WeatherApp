//Event Listeners
var cityInputEl = document.querySelector('#city');
var searchFormEl = document.querySelector('#search-form');
var cityHistoryEl = document.querySelector('#city-history');
var cityResultsTermEl = document.querySelector('#city-search-term');
var cityResultsEl = document.querySelector('#city-result');
var fiveDayForecastEl = document.querySelector('#five-day-forecast');

//Local storage values
var cities = [];


//Function for storing saved city locations as Buttons

function init() {
    // Get stored cities from localStorage
    var storedCities = JSON.parse(localStorage.getItem("cities"));
  
    // If todos were retrieved from localStorage, update the todos array to it
    if (storedCities !== null) {
      cities = storedCities;
    }
  
    // This is a helper function that will render saved city button to the DOM
    renderSavedButtons();
  }
function renderSavedButtons(){
    for(i=0;i<cities.length;i++){

    }
}

//Function for handling form submit when searching forecast for a city
var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
  
    if (city) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
        getCityForecast(city);
        cityInputEl.value = '';
      
    } else {
      alert('Please enter a city');
    }
  };

  var getCityForecast = function (city){

  }
  
 // var buttonClickHandler = function (event) {
 //   var cityHistory = event.target.getAttribute('data-language');
  
  //  if (language) {
   //   getFeaturedRepos(language);
  
   //   repoContainerEl.textContent = '';
  //  }
// };

init();
searchFormEl.addEventListener('submit', formSubmitHandler);