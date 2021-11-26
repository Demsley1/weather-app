$(document).ready(function() {
    // target user form and target form input value
    var formEl = document.querySelector("#user-form")
    var cityNameEl = document.querySelector("#cityVal")
    var titleEl = document.querySelector('#titleEl')
    const searchList = document.querySelector("#searchList")
    

    
    // main function to fetch api, then parse rsponsei nto json to be be used and appended to the page
    var getCityInfo = function(event) {
        event.preventDefault();
        var cityName = cityNameEl.value.trim();

        if (cityName){
            getCityData(cityName);
            console.log(cityName);

            cityNameEl.value = "";
        }
        else {
            alert("Please enter a valid city name.")
        }
    }

    var getCityData = function(city) {
        var openWeather = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=1906d24e055219a4668f097f37c8b286"

        fetch (openWeather).then(function(response){
            if(response.ok){
                response.json().then(function(data){ 
                    console.log(data)
                    oneCall(data);
                    locDay(data);
                });
            }
            else {
                alert("no city found with this name")
            }
        });

        var locDay = function(cityData) {
            // var getting data for date from dayjs api
            var day = dayjs();

            // get data of icon id from open weather api formatted as a json object
            var iconData = cityData.weather[0];
            var iconVal = iconData.icon
            var cityName = cityData.name
            // create an element for icon representing weather
            var iconEl = document.createElement("img")
            // source picture for icon from openweather website
            var tempPic = ("http://openweathermap.org/img/wn/"+iconVal+"@2x.png")
            $(iconEl).attr("src", tempPic);

            // append city name, day, and icon image to page
            $(titleEl).text(" ");
            $( titleEl ).append( cityName + ':' + '('+(day.$M+1)+'/'+day.$D+'/'+day.$y+')'); 
            $( titleEl ).append(iconEl);
            saveSearch(cityName);
        }

    }

    var oneCall = function(coords) {
        var lon = coords.coord.lon
        var lat = coords.coord.lat
        var apiOneCall = ("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid=1906d24e055219a4668f097f37c8b286")

        fetch (apiOneCall).then(function(response){
            response.json().then(function(data2){
                console.log(data2);     
                if(response.ok){
                   displayCityTemp(data2)
                }
                else {
                    alert("missing weather data for this location");
                }
            });
        });
        
        var displayCityTemp = function(temp) {
            // set each array value to a funciton
            var tempOfCity = temp.current.temp;
            var wind = temp.current.wind_speed;
            var hum = temp.current.humidity;
            var uvi = temp.current.uvi;
            

            //create a ul element for each container
            var listCon = document.createElement("ul");
            listCon.classList = "list-group"
            // container for each element
            var tempEl = document.createElement("li")
            tempEl.classList = "list-group-item";
            var windEl=document.createElement("li")
            windEl.classList = "list-group-item";
            var humEl = document.createElement("li")
            humEl.classList = "list-group-item";
            var uviEl = document.createElement("li")
            uviEl.classList = "list-group-item";

            // Name the title for each div and parse value attributed to title
            var tempTitle = document.createElement("span")
            tempTitle.textContent = ("Temperature:  " + tempOfCity + " °F");
            var windTitle = document.createElement("span")
            windTitle.textContent = ("Wind Speed:  "+ wind + "  MPH");
            var humTitle = document.createElement("span")
            humTitle.textContent = ("Humidity:  " + hum + " %");
            var uviTitle = document.createElement("span")
            uviTitle.textContent = ("UV Index:  " + uvi);
            // attempt to create if else conditional statement to change color of element depending of value of the uv index
            if(uvi.value >= 3 && uvi.value <= 5) {
                uviTitle.classList = "moderate"
            }
            else if (uvi.value < 3) {
                uviTitle.classList = "normal"
            }

            // Append each span to list element container
            $(tempEl).append(tempTitle);
            $(windEl).append(windTitle);
            $(humEl).append(humTitle);
            $(uviEl).append(uviTitle);

            // Append all element to ul container
            $(listCon).append(tempEl)
            $(listCon).append(windEl)
            $(listCon).append(humEl)
            $(listCon).append(uviEl)
            
            // Append to page with id =
            $("#city-temp").text(" ")
            $("#city-temp").append(listCon)


            
            
            var dailyForecast = function(temp) {
                $("#forecast-cards").text(" ")
                for(let i = 1; i < 6; i++){
                    var dailyTemp = temp.daily[i];
                    var dDate = dailyTemp.dt
                    var dTemp = dailyTemp.temp.day
                    var dWind = dailyTemp.wind_speed
                    var dHum = dailyTemp.humidity
                    var dIcon = dailyTemp.weather[0].icon
                    var tempPic = ("http://openweathermap.org/img/wn/"+dIcon+"@2x.png")
                    showDate = dayjs.unix(dDate);

                    var forecastEl = document.createElement("div")
                    forecastEl.classList = "card border-2 border-dark bg-primary bg-gradient";

                    var forecastTitle = document.createElement('h3')
                    forecastTitle.textContent = (showDate);
                    forecastTitle.classList = "card-title";

                    var iconEl = document.createElement("img")
                    $(iconEl).attr("src", tempPic)
                    iconEl.classList = "card-img-top w-50"

                    var forecastBody = document.createElement('div')
                    forecastBody.classList = "card-body fs-4";

                    var forecastTemp = document.createElement('p')
                    forecastTemp.textContent = ("Temp:  " + dTemp + " °F")
                    forecastTemp.classList= "card-text";

                    var forecastWind = document.createElement('p')
                    forecastWind.textContent = ("Wind:  " + dWind + "  MPH")
                    forecastWind.classList = "card-text";

                    var forecastHum = document.createElement('p')
                    forecastHum.textContent = ("Humidity:  " + dHum + " %")
                    forecastHum.classList = "card-text";

                    // append all p elements into card body div
                    $(forecastBody).append(forecastTemp)
                    $(forecastBody).append(forecastWind)
                    $(forecastBody).append(forecastHum)

                    //append card title and card body dive into card element
                    $(forecastEl).append(forecastTitle)
                    $(forecastEl).append(iconEl)
                    $(forecastEl).append(forecastBody)

                    // append forecast el to HTML DOM 
                    $("#forecast-cards").append(forecastEl);

                }

            }

            dailyForecast(temp);
            
        }  


    }
    
        var saveSearch = (city) => {
            var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
            const  cityName = [];
            cityName.push(city);
            searchHistory.indexOf(city) === -1 ? searchHistory.push(city) : []

            localStorage.setItem("searchHistory", JSON.stringify(cityName));
            console.log(searchHistory)
            
            const searchBtn = (event) => {
                event.preventDefault();
                getCityData(event.target.textContent)
            }
            
            const showSearch = () => {
                searchList.innerHTML = " ";

                for (let i = 0; i < searchHistory.length; i++){
                    var citySearch = document.createElement("button")
                    citySearch.classList = "btn-secondary"
                    citySearch.textContent = (searchHistory[i]);
                    $(searchList).append(citySearch)
                    citySearch.addEventListener('click', searchBtn )
                }
            }

            showSearch();
        }

    formEl.addEventListener("submit", getCityInfo);  
});