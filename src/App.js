import React from 'react';
import './App.css'; // ここでApp.cssをインポート
import WeatherForecast from './components/WeatherForecast';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>現在の天気</h1>
      </header>
      <main>
        <WeatherForecast />
      </main>
    </div>
  );
}

export default App;