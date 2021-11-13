

$(document).ready(function() {
    // target user form and target form input value
    var formEl = document.querySelector("#user-form")
    var cityNameEl = document.querySelector("#cityVal")
    // variable to target city name h2 element, should be removed for jQuery solutions
    var cityTitle = document.querySelector("#city-name")

    
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
            response.json().then(function(data){ 
                if(response.ok){
                   oneCall(data)
                }
                else {

                }
            });
        });

        var cityWeather = function() {
            var day = dayjs();
        cityTitle.textContent = "";
        $( "#city-name" ).append( city + ':' + '('+day.$D+'/'+day.$M+'/'+day.$y+')');
        }
        cityWeather();
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

                }
            });
        });
        
        var displayCityTemp = function(temp) {
            // set each array value to a funciton
            var tempOfCity = temp.current.temp;
            var wind = temp.current.wind_speed;
            var hum = temp.current.humidity;
            var uvi = temp.current.uvi;

            // container for each element
            var tempEl = document.createElement("div")
            tempEl.classList = "list-item flex-row justify-space-between align-center";
            var windEl=document.createElement("div")
            windEl.classList = "list-item flex-row justify-space-between align-center";
            var humEl = document.createElement("div")
            humEl.classList = "list-item flex-row justify-space-between align-center";
            var uviEl = document.createElement("div")
            uviEl.classList = "list-item flex-row justify-space-between align-center";
            // Name the title for each div and parse value attributed to title
            var tempTitle = document.createElement("span")
            tempTitle.textContent = ("Temperature:" + tempOfCity + "F");
            var windTitle = document.createElement("span")
            windTitle.textContent = ("Wind Speed:"+ wind + "MPH");
            var humTitle = document.createElement("span")
            humTitle.textContent = ("Humidity:" + hum + "%");
            var uviTitle = document.createElement("span")
            uviTitle.textContent = ("UV Index:" + uvi);

            // Append each div to container
            $(tempEl).append(tempTitle);
            $(windEl).append(windTitle);
            $(humEl).append(humTitle);
            $(uviEl).append(uviTitle);
            
            $("#city-temp").append(tempEl)
            $("#city-temp").append(windEl)
            $("#city-temp").append(humEl)
            $("#city-temp").append(uviEl)
            

        }

    }

    formEl.addEventListener("submit", getCityInfo);
   
});






