const API_KEY = "*** Your API Key ***";
let CITY = "";
let lat = 0;
let lon = 0;

// Lien du fond d'écran de base
document.body.style.backgroundImage =
  "url('https://source.unsplash.com/1600x900/?landscape`)";

// démarrage de la fonction après clic sur le bouton
document.querySelector("#search").addEventListener("click", getWeather);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather();
  }
});

function geoCoding(city) {
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${city})`;

  API_GEO_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
  return fetch(API_GEO_URL)
    .then((response) => response.json())
    .then((data) => {
      lat = data[0].lat;
      lon = data[0].lon;
    })
    .catch((error) => {
      console.error(error);
    });
}

function getWeather(e) {
  CITY = document.querySelector("#cityName").value;

  geoCoding(CITY).then(() => {
    const API_URL_MAIN = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetch(API_URL_MAIN)
      .then((response) => response.json())
      .then((data) => {
        let rainCheck = `<p>Pas de pluie</p>`;
        if (data.hasOwnProperty("rain")) {
          rainCheck = `<p>Pluie: ${data.rain["1h"]}</p>`;
        }
        let weatherDescription = data.weather[0].description;
        capitalizedWeatherDescription =
          weatherDescription.charAt(0).toUpperCase() +
          weatherDescription.slice(1);

        document.querySelector(".meteoBox").innerHTML = `
        <div class="cityHeader">
        <h1>${data.name}
        <img class="icon" src='https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png'></img>
        </h1>
        <h3>${capitalizedWeatherDescription}</h3>  
        <h3>Température: ${data.main.temp_min} °C</h3>
        <h3>Humidité: ${data.main.humidity} %</h3>
        <h4>Vent: ${data.wind.speed} km/h</h4>
        <h4>${rainCheck}</h4>
        </div>`;
      })
      .catch((err) => {
        document.querySelector(".meteoBox").innerHTML = `
          <h4> City not found :déçu:</h4>
        `;
        console.log("City not found", err);
      });
    e.preventDefault();
  });
}
