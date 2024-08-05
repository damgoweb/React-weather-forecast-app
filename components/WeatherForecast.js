import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Tokyo'); // eslint-disable-line no-unused-vars

  useEffect(() => {
    const fetchWeather = async () => {
      console.log('useEffect is running');
      const API_KEY = '5896c032d622c83db73e27ef0c91e8e3';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      try {
        const response = await axios.get(url);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [city]);

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
    <div className="WeatherForecast">
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="都市名を入力"
      />
      <h2>{city}の天気だお</h2>
      <p>データ取得時刻: {formatDateTime(weatherData.dt)}</p>
      <p>気温: {weatherData.main.temp}°C</p>
      <p>天気: {weatherData.weather[0].description}</p>
      <p>湿度: {weatherData.main.humidity}%</p>
    </div>
  );
};
<style>
    .WeatherForecast {background-color:blue;}

</style>
export default WeatherForecast;
