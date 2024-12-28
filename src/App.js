import React, { useState } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function WeatherApp() {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [weather, setWeather] = useState({
        loading: false,
        data: {},
        error: false,
    });

    const toDateFunction = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
        ];
        const WeekDays = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
        ];
        const currentDate = new Date();
        const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
        return date;
    };

    const isValidDate = (date) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
    };

    const fetchWeatherData = async () => {
        if (
            latitude &&
            longitude &&
            startDate &&
            endDate &&
            isValidDate(startDate) &&
            isValidDate(endDate)
        ) {
            // Log the dates to check if they are correct
            console.log('Start Date:', startDate);
            console.log('End Date:', endDate);

            setWeather({ ...weather, loading: true });

            const url = 'https://archive-api.open-meteo.com/v1/archive';
            const params = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                start_date: startDate, 
                end_date: endDate,     
                hourly: 'temperature_2m', 
            };

            try {
                const response = await axios.get(url, { params });
                const weatherData = response.data;
                console.log('Weather Data:', weatherData);

                setWeather({ data: weatherData, loading: false, error: false });
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setWeather({ ...weather, data: {}, error: true });
            }
        } else {
            setWeather({ ...weather, error: true });
        }
    };

    return (
        <div className="App">
            <h1 className="app-name">Weather Dashboard</h1>
            <div className="input-fields">
                <input
                    type="text"
                    className="input-box"
                    placeholder="Enter Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                />
                <input
                    type="text"
                    className="input-box"
                    placeholder="Enter Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                />
                <input
                    type="date"
                    className="input-box"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    className="input-box"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button className="fetch-button" onClick={fetchWeatherData}>
                    Get Weather Data
                </button>
            </div>

            {weather.loading && (
                <div className="loader">
                    <Oval type="Oval" color="black" height={100} width={100} />
                </div>
            )}

            {weather.error && (
                <div className="error-message">
                    <FontAwesomeIcon icon={faFrown} />
                    <span style={{ fontSize: '20px' }}>
                        Error fetching data. Please check your inputs.
                    </span>
                </div>
            )}

            {weather.data && weather.data.hourly && (
                <div>
                    <div className="weather-data">
                        <h2>Weather Data</h2>
                        <div>
                            <h3>Temperature (Hourly)</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Temperature (°C)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weather.data.hourly.time.map((time, index) => (
                                        <tr key={index}>
                                            <td>{new Date(time * 1000).toLocaleString()}</td>
                                            <td>{weather.data.hourly.temperature_2m[index]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WeatherApp;

