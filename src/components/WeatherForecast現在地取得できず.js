import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      }, (error) => {
        console.error('Error getting location:', error);
        setCity('Tokyo'); // デフォルトの都市名を設定
      });
    } else {
      setCity('Tokyo'); // Geolocation APIがサポートされていない場合のデフォルト
    }
  }, []);

  useEffect(() => {
    const fetchWeatherByCoords = async () => {
      console.log('Fetching weather data by coordinates');
      const API_KEY = '1234567890abcdef'; // 正しいAPIキーを入力してください
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

      try {
        const response = await axios.get(url);
        setWeatherData(response.data);
        setCity(response.data.name); // 取得した天気データから都市名を設定
      } catch (error) {
        console.error('Error fetching weather data:', error.response?.data || error.message);
      }
    };

    if (latitude && longitude) {
      fetchWeatherByCoords();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const fetchWeatherByCity = async () => {
      console.log('Fetching weather data by city name');
      const API_KEY = 'dc5944498c77c9899c9dd358a83fb672'; // 正しいAPIキーを入力してください
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      try {
        const response = await axios.get(url);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error.response?.data || error.message);
      }
    };

    if (city && !latitude && !longitude) {
      fetchWeatherByCity();
    }
  }, [city, latitude, longitude]);

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
    setLatitude(null);
    setLongitude(null);
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="都市名を入力"
      />
      <h2>{city}の天気</h2>
      <p>データ取得時刻: {formatDateTime(weatherData.dt)}</p>
      <p>気温: {weatherData.main.temp}°C</p>
      <p>湿度: {weatherData.main.humidity}%</p>
      <div>
        <p>天気: {weatherData.weather[0].description}</p>
        <img
          src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt={weatherData.weather[0].description}
        />
      </div>
    </div>
  );
};

export default WeatherForecast;
