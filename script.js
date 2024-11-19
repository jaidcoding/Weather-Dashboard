function initPage() {
    const cityEl = document.getElementById("enter-city");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    const fivedayEl = document.getElementById("fiveday-header");
    const todayweatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    const APIKey = "e227e14d6a73ac84324ae69a9424b120";

    function getWeather(cityName) {
        const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;
        axios.get(queryURL).then(function (response) {
            todayweatherEl.classList.remove("d-none");

            const currentDate = new Date(response.data.dt * 1000);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            nameEl.innerHTML = `${response.data.name} (${month}/${day}/${year})`;
            const weatherPic = response.data.weather[0].icon;
            currentPicEl.setAttribute("src", `https://openweathermap.org/img/wn/${weatherPic}@2x.png`);
            currentPicEl.setAttribute("alt", response.data.weather[0].description);
            currentTempEl.innerHTML = `Temperature: ${k2f(response.data.main.temp)} &#176F`;
            currentHumidityEl.innerHTML = `Humidity: ${response.data.main.humidity}%`;
            currentWindEl.innerHTML = `Wind Speed: ${response.data.wind.speed} MPH`;

            storeCityInBackend(response.data.name);

            const lat = response.data.coord.lat;
            const lon = response.data.coord.lon;
            const UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&cnt=1`;
            axios.get(UVQueryURL).then(function (response) {
                const UVIndex = document.createElement("span");
                if (response.data[0].value < 4) {
                    UVIndex.setAttribute("class", "badge badge-success");
                } else if (response.data[0].value < 8) {
                    UVIndex.setAttribute("class", "badge badge-warning");
                } else {
                    UVIndex.setAttribute("class", "badge badge-danger");
                }
                UVIndex.innerHTML = response.data[0].value;
                currentUVEl.innerHTML = "UV Index: ";
                currentUVEl.append(UVIndex);
            });

            const cityID = response.data.id;
            const forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIKey}`;
            axios.get(forecastQueryURL).then(function (response) {
                fivedayEl.classList.remove("d-none");
                const forecastEls = document.querySelectorAll(".forecast");
                for (let i = 0; i < forecastEls.length; i++) {
                    forecastEls[i].innerHTML = "";
                    const forecastIndex = i * 8 + 4;
                    const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                    const forecastDay = forecastDate.getDate();
                    const forecastMonth = forecastDate.getMonth() + 1;
                    const forecastYear = forecastDate.getFullYear();
                    const forecastDateEl = document.createElement("p");
                    forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                    forecastDateEl.innerHTML = `${forecastMonth}/${forecastDay}/${forecastYear}`;
                    forecastEls[i].append(forecastDateEl);

                    const forecastWeatherEl = document.createElement("img");
                    forecastWeatherEl.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.list[forecastIndex].weather[0].icon}@2x.png`);
                    forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                    forecastEls[i].append(forecastWeatherEl);
                    const forecastTempEl = document.createElement("p");
                    forecastTempEl.innerHTML = `Temp: ${k2f(response.data.list[forecastIndex].main.temp)} &#176F`;
                    forecastEls[i].append(forecastTempEl);
                    const forecastHumidityEl = document.createElement("p");
                    forecastHumidityEl.innerHTML = `Humidity: ${response.data.list[forecastIndex].main.humidity}%`;
                    forecastEls[i].append(forecastHumidityEl);
                }
            });
        });
    }

    function storeCityInBackend(cityName) {
        axios.post('/store-city', { city: cityName })
            .then(response => console.log('City stored:', response.data))
            .catch(error => console.error('Error storing city:', error));
    }

    function deleteCityFromBackend(cityId) {
        axios.delete(`/delete-city/${cityId}`)
            .then(response => console.log('City deleted:', response.data))
            .catch(error => console.error('Error deleting city:', error));
    }

    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value.trim();
        if (!searchTerm) {
            alert("Please enter a city name.");
            return;
        }
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    });

    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    });

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("div");
            historyItem.setAttribute("class", "d-flex justify-content-between align-items-center mb-2");

            const cityInput = document.createElement("input");
            cityInput.setAttribute("type", "text");
            cityInput.setAttribute("readonly", true);
            cityInput.setAttribute("class", "form-control bg-white");
            cityInput.setAttribute("value", searchHistory[i]);
            cityInput.addEventListener("click", function () {
                getWeather(cityInput.value);
            });

            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("class", "btn btn-danger ml-2");
            deleteButton.innerHTML = "Delete";
            deleteButton.addEventListener("click", function () {
                deleteCityFromBackend(i + 1); // Assuming city IDs are 1-based and sequential
                searchHistory.splice(i, 1);
                localStorage.setItem("search", JSON.stringify(searchHistory));
                renderSearchHistory();
            });

            historyItem.appendChild(cityInput);
            historyItem.appendChild(deleteButton);
            historyEl.appendChild(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
}

initPage();