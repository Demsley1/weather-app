$(document).ready(function() {
    // target user form and target form input value
    var formEl = document.querySelector("#user-form")
    var cityNameEl = document.querySelector("#cityVal")
    // variable to target city name h2 element
    var cityTitle = document.querySelector("#city-name")
    // var forecast = document.querySelector(".forecast-list")

    
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
            // create an element for icon representing weather
            var iconEl = document.createElement("img")
            // source picture for icon from openweather website
            var tempPic = ("http://openweathermap.org/img/wn/"+iconVal+"@2x.png")
            $(iconEl).attr("src", tempPic);

            // append city name, day, and icon image to page
            cityTitle.textContent = "";
            $( "#city-name" ).append( city + ':' + '('+(day.$M+1)+'/'+day.$D+'/'+day.$y+')'); 
            $( "#titleEl" ).append(iconEl);
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
            $("#city-temp").append(listCon)


            
            
            var dailyForecast = function(temp) {
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
                    forecastEl.classList = "card";

                    var forecastTitle = document.createElement('h3')
                    forecastTitle.textContent = (showDate);
                    forecastTitle.classList = "card-title";

                    var iconEl = document.createElement("img")
                    $(iconEl).attr("src", tempPic)
                    iconEl.classList = "card-img-top w-50"

                    var forecastBody = document.createElement('div')
                    forecastBody.classList = "card-body";

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
        var saveSearch = function() {
            var searchHistory = (sessionStorage.searchHistory) ? JSON.parse(sessionStorage.searchHistory) : [];
            
            document.querySelector("#search-button").addEventListener("click", () => {
                searchHistory.push(document.querySelector("#cityVal").value);
                //sessionStorage.searchHistory = JSON.stringify(searchHistory);
            });

            var searchData = sessionStorage.getItem("searchHistory");
            
            
            for (let i = 0; i < searchData.length; i++) {
                var searchName = document.createElement("li")
                searchName.textContent = searchData[i]
                console.log(searchName);
            };

            /*document.querySelector("#cityVal").addEventListener("focus", () => {
                var data = document.querySelector("datalist#searchdata");
                data.innerHTML = "";
                
                searchHistory.forEach((search) => {
                    $("#search-list").append(searchName);
                    data.innerHTML = "<option>" + data.innerHTML;
                    data.querySelector("option").innerText = search;
                });
            });*/
        }

    formEl.addEventListener("submit", getCityInfo);
    formEl.addEventListener("submit", saveSearch);
   
});