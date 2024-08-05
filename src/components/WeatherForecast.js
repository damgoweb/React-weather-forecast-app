import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Province of Davao del Norte,PH');
  // Province of Davao del Norte,PH


  useEffect(() => {

    console.log(`Fetching weather data for ${city}`);

    const fetchWeather = async () => {
      console.log('useEffect is running');

      const API_KEY = process.env.REACT_APP_API_KEY;



      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      try {
        const response = await axios.get(url);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [city]); // cityが変更されるたびにuseEffectが再実行される

  const formatDateTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Tokyo'
    });
  };

  if (!weatherData) return <div>Loading...</div>;

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <div className="weather-info">
      
      <div className="weather-place">
        <p>都市名を入力すると当地の天気情報を表示します。</p>
        <input
          className="place"
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="都市名を入力"
        />
      </div>

      {/* <h2>{city}</h2>
      <p>緯度(Latitude): {weatherData.coord.lat}</p>
      <p>経度(Longitude): {weatherData.coord.lon}</p> */}

      <table border="0">
      <tr>
          <td>都市名</td><td> {city}</td>
        </tr>
        <tr>
          <td>緯度(Latitude)</td><td> {weatherData.coord.lat}</td>
        </tr>
        <tr>
          <td>経度(Longitude)</td><td> {weatherData.coord.lon}</td>
        </tr>

        <tr>
          <td>データ取得時刻</td><td> {formatDateTime(weatherData.dt)}</td>
        </tr>
        <tr>
          <td>気温</td><td> {weatherData.main.temp}°C</td>
        </tr>
        <tr>
          <td>湿度</td><td> {weatherData.main.humidity}%</td>
        </tr>
        <tr>
          <td rowspan="2">天気</td><td> {weatherData.weather[0].description}</td>
        </tr>
        <tr>
          <td className='img_icon'>
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
          </td>
        </tr>

      </table>

    </div>
  );
};

export default WeatherForecast;
