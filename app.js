const API_KEY = "53632f7030cac32ed1df9f8a19010344";
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

class WeatherDataModel {
  constructor(rawApiResponse) {
    this.city = rawApiResponse.city.name;
    this.country = rawApiResponse.city.country;
    this.forecast = this.cleanForecastList(rawApiResponse.list);
  }

  cleanForecastList(listArray) {
    return listArray.map(item => {
      return {
        timestamp: item.dt,
        formattedTime: new Date(item.dt * 1000).toLocaleString(),
        temperature: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        condition: item.weather[0].description,
        iconCode: item.weather[0].icon
      };
    });
  }
}

async function executePipeline(city = "Atlanta") {
  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=imperial&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API HTTP Error! Status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const weatherData = new WeatherDataModel(data);

    console.log("Parsed & Cleaned Weather Data Object Array");
    console.log("Location:", `${weatherData.city}, ${weatherData.country}`);
    console.log("Total Entries Extracted:", weatherData.forecast.length);
    console.log("Forecast Array (Objects):", weatherData.forecast);
    console.log("\nSample Single Entry Object Structure:", weatherData.forecast[0]);

    return weatherData;
  } catch (error) {
    console.error("Fetch Error", error.message);
  }
}

executePipeline("Atlanta");