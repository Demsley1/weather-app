

$(document).ready(function() {
    // target user form and target form input value
    var formEl = document.querySelector("#user-form")
    var cityNameEl = document.querySelector("#cityVal")
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
        console.log(openWeather);

        fetch (openWeather).then(function(response){
            response.json().then(function(data){
                console.log(data)
                if(response.ok){
                    

                }
            });
        });

        var cityWeather = function() {
            var day = dayjs();
        cityTitle.textContent = "";
        $( "#city-name" ).append(city + ':' + '('+day.$D+'/'+day.$M+'/'+day.$y+')');
        }
        cityWeather();
    }


    

    formEl.addEventListener("submit", getCityInfo);
   
});






