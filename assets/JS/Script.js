
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
                    var showDate = dayjs.unix(dDate).format('ddd, MMM DD YYYY');

                    var forecastEl = document.createElement("div")
                    forecastEl.classList = "card dwcard m-2";

                    var forecastTitle = document.createElement('h3')
                    forecastTitle.textContent = (showDate);
                    forecastTitle.classList = "card-title text-white m-1";

                    var iconEl = document.createElement("img")
                    $(iconEl).attr("src", tempPic)
                    iconEl.classList = "card-img-top w-50"

                    var forecastBody = document.createElement('div')
                    forecastBody.classList = "card-body fs-4";

                    var forecastTemp = document.createElement('p')
                    forecastTemp.textContent = ("Temp:  " + dTemp + " °F")
                    forecastTemp.classList= "card-text text-li";

                    var forecastWind = document.createElement('p')
                    forecastWind.textContent = ("Wind:  " + dWind + "  MPH")
                    forecastWind.classList = "card-text text-li";

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

        var saveSearch = (city) => {
            var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
            if(!searchHistory){
                searchHistory = []
            } 
            if (searchHistory.indexOf(city) === -1){
                searchHistory.push(city)
            }
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            showSearch();
        }

        

        const showSearch = () => {
            searchList.innerHTML = " ";
            var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

            searchHistory.forEach(x => {
                var citySearch = $("<button>").text(x).attr("onclick", "searchBtn(event)").addClass("btn btn-secondary m-2")
                $(searchList).append(citySearch)
                
            })
        }

        function searchBtn(event) {
            event.preventDefault();
            getCityData(event.target.textContent)
        }

    formEl.addEventListener("submit", getCityInfo);  
    showSearch();

