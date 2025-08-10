const selectCountries = document.getElementById("countries");
const Governorate = document.getElementById("Governorate");
const countriesValue = document.getElementById("countries");
let slimGovernorate;
let orginalSelect;

const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const time = document.getElementById("time");
const description = document.getElementById("description");

// Descriptions dataa
const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Mostly cloudy",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

// get prayer element

const fajr = document.getElementById("fajr");
const sunrise = document.getElementById("sunrise");
const dhuhr = document.getElementById("dhuhr");
const asr = document.getElementById("asr");
const maghrib = document.getElementById("maghrib");
const isha = document.getElementById("isha");

// loading data
let loading = `<i class="fa-solid fa-spinner animate-spin"></i>`;
let dataloading = `temp.innerHTML = loading;
wind.innerHTML = loading;
humidity.innerHTML = loading;
time.innerHTML = loading;
description.innerHTML = loading;`;

prayerloading = `fajr.innerHTML = loading;
sunrise.innerHTML = loading;
dhuhr.innerHTML = loading;
asr.innerHTML = loading;
maghrib.innerHTML = loading;
isha.innerHTML = loading;`;
eval(prayerloading);

// get countries
(async function getCountries() {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/iso"
    );

    if (!res.ok) {
      throw Error(res.status);
    }

    let data = await res.json();
    displayCountries(data);

    orginalSelect = countriesValue.value;

    getGovernorates(orginalSelect);
    getLatLon(orginalSelect);
    getPrayersTime(orginalSelect, Governorate.value);
  } catch (error) {
    console.log(error);
  }
})();

// display countries
function displayCountries(data) {
  let countries = "";
  data.data
    .map((e) => {
      countries += `<option value="${e.name}">${e.name}</option>`;
    })
    .join();

  selectCountries.innerHTML = countries;
  new SlimSelect({
    select: "#countries",
  });
}

//when change country get value
countriesValue.addEventListener("change", (e) => {
  getGovernorates(e.target.value);
});

// get governorates
async function getGovernorates(country) {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country: country }),
      }
    );

    if (!res.ok) {
      throw Error(res.status);
    }

    let data = await res.json();

    displayGovernorates(data);
    getLatLon(Governorate.value);
  } catch (e) {
    console.error(e);
  }
}

// display Governorates
function displayGovernorates(data) {
  let displayData = "";
  data.data.states
    .map((e) => {
      displayData += `<option value="${e.name
        .split("Governorate")
        .join("")
        .trim()}">${e.name.split("Governorate").join("").trim()}</option>`;
    })
    .join();

  if (slimGovernorate) {
    slimGovernorate.destroy();
  }
  Governorate.innerHTML = "";

  Governorate.innerHTML = displayData;

  slimGovernorate = new SlimSelect({
    select: "#Governorate",
  });
}

Governorate.addEventListener("change", (e) => {
  getLatLon(e.target.value);
});

// get lon & lat
async function getLatLon(city) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`
    );

    eval(dataloading);

    if (!res.ok) {
      throw Error(res.status);
    }

    const data = await res.json();

    if (data.length > 0) {
      let lat = data[0].lat;
      let lon = data[0].lon;

      getWeather(lat, lon);
    }
    getPrayersTime(countriesValue.value, Governorate.value);
  } catch (e) {
    console.error(e);
  }
}

// get weather
async function getWeather(lat, lon) {
  try {
    const req = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relativehumidity_2m&current_weather=true`
    );

    if (!req.ok) {
      throw Error(req.status);
    }
    const data = await req.json();

    const temp = data.current_weather.temperature;
    const wind = data.current_weather.windspeed;
    const timeNow = data.current_weather.time;
    const code = data.current_weather.weathercode;
    const description = weatherDescriptions[code] || "Unknown";

    //delete minute => 00
    let [datePart, timePart] = timeNow.split("T");
    let [hour, minute] = timePart.split(":");
    minute = "00";
    let newTime = `${datePart}T${hour}:${minute}`;

    // get humidity
    const humidityIndex = data.hourly.time.indexOf(newTime);
    const humidity = data.hourly.relativehumidity_2m[humidityIndex];
    displayTemp(temp, wind, humidity, timeNow, description);
  } catch (e) {
    console.error(e);
  }
}

// display temp& wind & humidity
function displayTemp(t, w, h, ti, des) {
  temp.innerHTML = t + "°C";
  wind.innerHTML = w + " km/h";
  humidity.innerHTML = h + " %";
  time.innerHTML = ti + `<i class="fa-regular fa-clock animate-spin"></i>`;
  description.innerHTML = des;
}

// end timp

// prayers time
async function getPrayersTime(country, governorate) {
  eval(prayerloading);
  try {
    const req = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${governorate}&country=${country}&method=2`
    );

    if (!req.ok) {
      throw Error(req.status);
    }

    const data = await req.json();
    const fajr = convertTime(data.data.timings.Fajr);
    const sunrise = convertTime(data.data.timings.Sunrise);
    const dhuhr = convertTime(data.data.timings.Dhuhr);
    const asr = convertTime(data.data.timings.Asr);
    const maghrib = convertTime(data.data.timings.Maghrib);
    const isha = convertTime(data.data.timings.Isha);

    displayPrayersTime(fajr, dhuhr, asr, maghrib, sunrise, isha);
  } catch (e) {
    console.error(e);
  }
}

// display prayers
function displayPrayersTime(fajrr, dhuhrr, asrr, maghribb, sunrisee, ishaa) {
  fajr.innerHTML = fajrr;
  sunrise.innerHTML = sunrisee;
  dhuhr.innerHTML = dhuhrr;
  asr.innerHTML = asrr;
  maghrib.innerHTML = maghribb;
  isha.innerHTML = ishaa;
}

// convert time from 24 to 12
function convertTime(t) {
  let [hour, minute] = t.split(":");
  hour = Number(hour);
  if (hour > 12) {
    hour -= 12;
    return hour + ":" + minute + " PM";
  } else {
    return hour + ":" + minute + " AM";
  }
}

console.log("hello");