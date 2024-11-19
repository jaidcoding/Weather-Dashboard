# Weather Dashboard

A weather dashboard application that allows users to search for current weather and 5-day forecasts for cities. The application uses the OpenWeather API to fetch weather data and stores search history locally and in a backend server.

## Features

- Search for current weather and 5-day forecast by city name
- Display temperature, humidity, wind speed, and UV index
- Store search history locally and in a backend server
- Clear search history

## Technologies Used

- HTML, CSS, JavaScript
- Bootstrap for layout and design
- Axios for API requests
- Express for backend server

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/jaidcoding/weather-dashboard.git
    cd weather-dashboard
    ```

2. Install backend dependencies:
    ```bash
    cd backend
    npm install
    ```

3. Start the backend server:
    ```bash
    npm start
    ```

4. Open `index.html` in your browser to use the application.

## API Key

The application uses the OpenWeather API. You need to replace the placeholder API key in `frontend/script.js` with your own API key:
```javascript
const APIKey = "your_api_key_here";
weather-dashboard/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── cities.json
├── frontend/
│   ├── script.js
│   └── style.css
├── index.html
└── README.md

This README file provides an overview of the project, setup instructions, and usage details. Adjust the repository URL and API key placeholder as needed.

![image](https://github.com/user-attachments/assets/a4cd9858-9215-4bbf-be6c-788b62563c28)
