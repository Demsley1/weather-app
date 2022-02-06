
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
            var tempPic = ("https://openweathermap.org/img/wn/"+iconVal+"@2x.png")
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
            var uviTitle = $("<p>").text("UV Index:  ")
            
            // attempt to create if else conditional statement to change color of element depending of value of the uv index
            var uviColor = $("<span>").text(uvi).addClass("moderate");
            if(uvi > 3 && uvi < 5) {
                $(uviTitle).append(uviColor);
            }
            else if (uvi < 3) {
                //$(uviColor).removeClass("moderate")
                $(uviColor).addClass("normal")
                $(uviTitle).append(uviColor)
            }
            else if (uvi > 5){
                $(uviColor).addClass("high")
                $(uviTitle).append(uviColor);
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

            // function to handle the display of the 5-day daily forecast weather cards
            var dailyForecast = function(temp) {
                // clears all fore-cast cards that might have been on the page already
                $("#forecast-cards").text(" ")
                for(let i = 1; i < 6; i++){
                    // create a daily temp object with the data for each daily temp fetched from the api call
                    const dailyTemp = temp.daily[i];
                    var dDate = dailyTemp.dt
                    var dTemp = dailyTemp.temp.day
                    var dWind = dailyTemp.wind_speed
                    var dHum = dailyTemp.humidity
                    var dIcon = dailyTemp.weather[0].icon
                    var tempPic = ("http://openweathermap.org/img/wn/"+dIcon+"@2x.png")
                    // re-formated date for daily weather using day.js
                    var showDate = dayjs.unix(dDate).format('ddd, MMM DD YYYY');

                    // create a card to hold the daily forecast
                    var forecastEl = document.createElement("div")
                    forecastEl.classList = "card dwcard m-2";

                    // title of daily weather cards, as the formatted date
                    var forecastTitle = document.createElement('h3')
                    forecastTitle.textContent = (showDate);
                    forecastTitle.classList = "card-title text-white m-1";

                    // image of the daily weather
                    var iconEl = document.createElement("img")
                    $(iconEl).attr("src", tempPic)
                    iconEl.classList = "card-img-top w-50"

                    // container to hold all body elements of daily weather cards
                    var forecastBody = document.createElement('div')
                    forecastBody.classList = "card-body fs-4";

                    // text element displaying temperature in farenheight
                    var forecastTemp = document.createElement('p')
                    forecastTemp.textContent = ("Temp:  " + dTemp + " °F")
                    forecastTemp.classList= "card-text text-li";

                    // text element displaying wind in miles per hour
                    var forecastWind = document.createElement('p')
                    forecastWind.textContent = ("Wind:  " + dWind + "  MPH")
                    forecastWind.classList = "card-text text-li";

                    // text element displaying the percentage of humidity
                    var forecastHum = document.createElement('p')
                    forecastHum.textContent = ("Humidity:  " + dHum + " %")
                    forecastHum.classList = "card-text text-li";

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
        // function to save search value to local storage
        const saveSearch = (city) => {
            // get local storage data if exists, and add new object with values to it then send it back to the server as json data
            var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
            // if there is no local storage data for this app create a new array to hold the data
            if(!searchHistory){
                searchHistory = []
            } 
            // if the local storage data doesn't hold the value being added to the array yet, then you can push the city name into the array
            if (searchHistory.indexOf(city) === -1){
                searchHistory.push(city)
            }
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            showSearch();
        }

        // function to get and display each local storage item as clickable button 
        const showSearch = () => {
            searchList.innerHTML = " ";
            var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

            searchHistory.forEach(x => {
                var citySearch = $("<button>").text(x).attr("onclick", "searchBtn(event)").addClass("btn btn-secondary m-2")
                $(searchList).append(citySearch)
                
            })
        }

        // when each search button is clicked rerun the search for that city
        function searchBtn(event) {
            event.preventDefault();
            getCityData(event.target.textContent)
        }

    formEl.addEventListener("submit", getCityInfo);  
    showSearch();

