import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet/dist/leaflet.js';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Province of Davao del Norte,PH');
  const [map, setMap] = useState(null);

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
  }, [city]);


useEffect(() => {
  if (weatherData) {
    if (map) {
      // 地図がすでに描画されている場合、更新する
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      map.setView([weatherData.coord.lat, weatherData.coord.lon], 3);
      const DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
      });
      const marker = L.marker([weatherData.coord.lat, weatherData.coord.lon], { icon: DefaultIcon }).addTo(map);
      marker.bindPopup(`緯度: ${weatherData.coord.lat}, 経度: ${weatherData.coord.lon}`);
    } else {
      // 地図が描画されていない場合、新しく描画する
      const map = L.map('map').setView([weatherData.coord.lat, weatherData.coord.lon], 1);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);
  
      const DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
      });
  
      const marker = L.marker([weatherData.coord.lat, weatherData.coord.lon], { icon: DefaultIcon }).addTo(map);
      marker.bindPopup(`緯度: ${weatherData.coord.lat}, 経度: ${weatherData.coord.lon}`);
  
      setMap(map);
    }
  }
}, [weatherData, map]);



  const formatDateTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Tokyo',
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

      <table border="0">
        <tr>
          <td>都市名</td>
          <td> {city}</td>
        </tr>
        {/* <tr>
          <td>緯度(Latitude)</td>
          <td> {weatherData.coord.lat}</td>
        </tr>
        <tr>
          <td>経度(Longitude)</td>
          <td> {weatherData.coord.lon}</td>
        </tr> */}
        <tr>
          <td>取得日時</td>
          <td> {formatDateTime(weatherData.dt)}</td>
        </tr>
        <tr>
          <td>気温</td>
          <td> {weatherData.main.temp}°C</td>
        </tr>
        <tr>
          <td>湿度</td>
          <td> {weatherData.main.humidity}%</td>
        </tr>
        <tr>
          <td rowspan="2">天気</td>
          <td> {weatherData.weather[0].description}</td>
        </tr>
        <tr>
          <td className="img_icon">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
          </td>
        </tr>
      </table>

      <div id="map" style={{ height: '300px', width: '100%' }}></div>
    </div>
  );
};

export default WeatherForecast;