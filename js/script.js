"use strict";

const box = document.getElementById("box");
const search = document.querySelector("input");
const searchButton = document.getElementById("searchBtn");
let tempData = [];
let currentLocationData = {};
let returnedVal = [];
const date = new Date();
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let lastUserInput;
let lastData;
const apiKey = "004b437fca1c4642b8b105322241312";

getCurrentLocationWeather("cairo");

let lat;
let lng;
if ("geolocation" in navigator) {
    // Prompt user for permission to access their location
    navigator.geolocation.getCurrentPosition(
      // Success callback function
      (position) => {
        // Get the user's latitude and longitude coordinates
         lat = position.coords.latitude;
         lng = position.coords.longitude;
  
        // Do something with the location data, e.g. display on a map
        // console.log(`Latitude: ${lat}, longitude: ${lng}`);
        getCurrentLocationWeather(lat+","+lng);
      },
      // Error callback function
      (error) => {
        // Handle errors, e.g. user denied location sharing permissions
        display(lastData);
        console.error("Error getting user location:", error);
      }
    );
  } else {
    // Geolocation is not supported by the browser
    console.error("Geolocation is not supported by this browser.");
  }
    




function getWeekDay(num) {
    return weekDays[date.getDay() + num];
}
function getMonth(num) {
    return month[num];
}
async function getCurrentLocationWeather(location) {
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=4`);
        let data = await response.json();
        console.log(data);
        if(data==null){
            console.log(null)
        }
        currentLocationData = {
            date:data.location.localtime,
            location: data.location.name,
            temp: data.current.temp_c,
            condition: data.current.condition,
            wind: data.current.wind_kph,
            windDirection: data.current.wind_dir,
            humidity: data.current.humidity
        }
        console.log(data.forecast.forecastday[1].date);
        tempData=[];

        for (let i = 1; i < data.forecast.forecastday.length; i++) {
            tempData.push({
                date: data.forecast.forecastday[i].date,
                condition: data.forecast.forecastday[i].day.condition,
                maxTemp: data.forecast.forecastday[i].day.maxtemp_c,
                minTemp: data.forecast.forecastday[i].day.mintemp_c,
            })
            // console.log(data.forecast.forecastday[i].day.maxtemp_c);
            // console.log(data.forecast.forecastday[i].day.mintemp_c);
        }
        lastData=[currentLocationData,tempData];
        // getMonth(+(data.date.split("-")[1]))
        // console.log(getMonth((+(tempData[0].date.split("-")[1]))-1));
        // console.log(tempData);
        // return [tempData ,currentLocationData];
        // display([currentLocationData,tempData]);
        display(lastData);
    }
    catch (error) {
        console.log(error);
        box.innerHTML="<h1>Error loading data from server</h1>"
    }
}
search.addEventListener("input",function(){
    if (search.value.length!==0){
        if(search.value.length>3){
        searchLocation(search.value);
        }
        else{
            display(lastData);
        }   
    } 
    else{
        display(lastData);
    }  
});
searchButton.addEventListener("click",function(){
    searchLocation(search.value);
});
async function searchLocation(input) {
    try{
        let location = input.toLowerCase();
        let response =await fetch(`https://api.weatherapi.com/v1//search.json?key=${apiKey}&q=${location}`);
        let data =await response.json();
        if(data!=null){
            let locationName=data[0].name;
            lastUserInput=locationName;
            await getCurrentLocationWeather(locationName);
        }
        
    }
    catch{
        console.log("Error");
        box.innerHTML="<h1>Location Not Found</h1>"
    }
    
}
function display(data) {
    let current = data[0];
    let forecast = data[1];
    let firstBox = `
    <div class="d-flex flex-column align-items-center col-md-12 today">
        <div class="date">
                ${getWeekDay(0)} <span>${(date.getDate())+" / "+(getMonth((+(tempData[0].date.split("-")[1]))-1))}</span>
            </div>
        <h2>
            ${current.location}
        </h2>
        <div class="d-flex align-items-center" >
          <div class="current-temp ps-5">
           ${current.temp}°c
          </div> 
          <div class="icon">
            <!-- <img src="${current.condition.icon}" alt="icon">-->
            <img src="https:${current.condition.icon}" alt="icon">
        </div>
        </div>
        <div class="condition mb-2 fs-3">
            ${current.condition.text}
        </div>
        <div class="details d-flex justify-content-around w-100 fs-4">
            <span><i class="fa fa-umbrella me-1"></i>${current.humidity}%</span>
            <span><i class="fa fa-wind me-1"></i>${current.wind} km/h</span>
            <span><i class="fa fa-compass me-1"></i>${current.windDirection}</span>
        </div>
    </div>
    `
    console.log(forecast)
    let tempBox =``;
    for (let i = 0; i < forecast.length; i++) {
        tempBox += `
            <div class="text-center col-md-4 forcast-day">
            <div class="texr-center inner ">
            <div class="date pt-2">
               ${getWeekDay(i+1)}  <span>${(forecast[i].date.split("-")[2])+" / "+(getMonth(+(forecast[i].date.split("-")[1])-1))}</span>
            </div>
            <div class="d-flex justify-content-center align-items-center w-100 forcast-max-temp" >
            <p class="max-temp">${forecast[i].maxTemp}°c</p>
            <div class="icon"><img src="https:${forecast[i].condition.icon}" alt="icon"></div>
            </div>
                
                <p class="min-temp">${forecast[i].minTemp}°c</p>
                <div class="condition pb-3">${forecast[i].condition.text}</div>
            </div>
            
            </div>
    `
    }
    box.innerHTML=firstBox+tempBox;
    // box.innerHTML+=tempBox;
}
let arr = [1, 2, 3, 4]
console.log(+"06")
console.log(arr[+"03"]);
// getCurrentLocationWeather("London");
// getCurrentLocationWeather(lat+","+lng);

// getLocation()
// Check if geolocation is supported by the browser
