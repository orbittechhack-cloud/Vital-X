// Environment Page JavaScript

let hourlyChart = null;
let temperatureChart = null;
let currentLocation = 'New York, NY';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    loadWeatherData();
    setupCharts();
    setInterval(updateDate, 60000); // Update date every minute
});

// Update Date
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
}

// Load Weather Data
function loadWeatherData() {
    // In a real application, this would fetch from a weather API
    // For demo purposes, we'll use simulated data

    const weatherData = {
        location: currentLocation,
        current: {
            temp: 72,
            feelsLike: 75,
            high: 78,
            low: 65,
            description: 'Sunny',
            icon: '☀️',
            humidity: 65,
            windSpeed: 12,
            windDir: 'NW',
            pressure: 1013,
            uvIndex: 6,
            sunrise: '6:24 AM',
            sunset: '7:45 PM',
            visibility: 10,
            precipitation: 0,
            heatIndex: 78
        },
        aqi: {
            value: 45,
            level: 'good',
            pm25: 12,
            pm10: 18,
            ozone: 85,
            no2: 25,
            co: 0.8,
            so2: 5
        },
        forecast: [
            { day: 'Today', icon: '☀️', high: 78, low: 65, desc: 'Sunny' },
            { day: 'Tomorrow', icon: '⛅', high: 75, low: 62, desc: 'Partly Cloudy' },
            { day: 'Wed', icon: '🌧️', high: 70, low: 58, desc: 'Light Rain' },
            { day: 'Thu', icon: '☀️', high: 76, low: 64, desc: 'Sunny' },
            { day: 'Fri', icon: '⛅', high: 74, low: 61, desc: 'Partly Cloudy' },
            { day: 'Sat', icon: '☀️', high: 77, low: 63, desc: 'Sunny' },
            { day: 'Sun', icon: '🌦️', high: 72, low: 60, desc: 'Showers' }
        ],
        hourly: generateHourlyData(),
        pollen: {
            overall: 'Low',
            tree: 'Low',
            grass: 'Moderate',
            weed: 'Low'
        }
    };

    updateWeatherDisplay(weatherData);
    updateAQIDisplay(weatherData.aqi);
    updateForecast(weatherData.forecast);
    updateHourlyChart(weatherData.hourly);
    updateEnvironmentalFactors(weatherData);
    updateAlerts(weatherData);
}

// Generate Hourly Data
function generateHourlyData() {
    const hourly = [];
    const now = new Date();
    const baseTemp = 72;

    for (let i = 0; i < 24; i++) {
        const hour = new Date(now);
        hour.setHours(now.getHours() + i);
        const temp = baseTemp + Math.sin(i * Math.PI / 12) * 8 + (Math.random() * 4 - 2);
        hourly.push({
            time: hour.getHours() + ':00',
            temp: Math.round(temp)
        });
    }

    return hourly;
}

// Update Weather Display
function updateWeatherDisplay(data) {
    document.getElementById('currentLocation').textContent = data.location;
    document.getElementById('currentTemp').textContent = data.current.temp;
    document.getElementById('feelsLike').textContent = data.current.feelsLike + '°F';
    document.getElementById('tempRange').textContent = data.current.high + '°F / ' + data.current.low + '°F';
    document.getElementById('weatherIcon').textContent = data.current.icon;
    document.getElementById('weatherDescription').textContent = data.current.description;

    document.getElementById('humidity').textContent = data.current.humidity + '%';
    document.getElementById('humidityBar').style.width = data.current.humidity + '%';

    document.getElementById('windSpeed').textContent = data.current.windSpeed + ' mph';
    document.getElementById('windDir').textContent = data.current.windDir;
    updateWindArrow(data.current.windDir);

    document.getElementById('pressure').textContent = data.current.pressure + ' hPa';

    document.getElementById('uvIndex').textContent = data.current.uvIndex;
    updateUVLevel(data.current.uvIndex);

    document.getElementById('sunrise').textContent = data.current.sunrise;
    document.getElementById('sunset').textContent = data.current.sunset;
}

// Update Wind Arrow
function updateWindArrow(direction) {
    const directions = {
        'N': '↑', 'NE': '↗', 'E': '→', 'SE': '↘',
        'S': '↓', 'SW': '↙', 'W': '←', 'NW': '↖'
    };
    const arrow = document.getElementById('windArrow');
    arrow.textContent = directions[direction] || '→';
}

// Update UV Level
function updateUVLevel(uvIndex) {
    const uvElement = document.getElementById('uvLevel');
    let level, className;

    if (uvIndex <= 2) {
        level = 'Low';
        className = 'low';
    } else if (uvIndex <= 5) {
        level = 'Moderate';
        className = 'moderate';
    } else if (uvIndex <= 7) {
        level = 'High';
        className = 'high';
    } else {
        level = 'Very High';
        className = 'high';
    }

    uvElement.textContent = level;
    uvElement.className = 'uv-level ' + className;
}

// Update AQI Display
function updateAQIDisplay(aqi) {
    document.getElementById('aqiValue').textContent = aqi.value;
    document.getElementById('aqiBadge').textContent = aqi.level.charAt(0).toUpperCase() + aqi.level.slice(1);
    document.getElementById('aqiBadge').className = 'aqi-badge ' + aqi.level;

    // Update gauge
    const gauge = document.getElementById('aqiGauge');
    const percentage = (aqi.value / 300) * 100; // AQI max is typically 300+
    gauge.style.width = Math.min(percentage, 100) + '%';
    gauge.className = 'gauge-fill ' + getAQILevel(aqi.value);

    // Update breakdown
    document.getElementById('pm25').textContent = aqi.pm25 + ' µg/m³';
    document.getElementById('pm10').textContent = aqi.pm10 + ' µg/m³';
    document.getElementById('ozone').textContent = aqi.ozone + ' ppb';
    document.getElementById('no2').textContent = aqi.no2 + ' ppb';
    document.getElementById('co').textContent = aqi.co + ' ppm';
    document.getElementById('so2').textContent = aqi.so2 + ' ppb';

    // Update status indicators
    updateAQIStatus('pm25', aqi.pm25, 12);
    updateAQIStatus('pm10', aqi.pm10, 18);
    updateAQIStatus('ozone', aqi.ozone, 85);
    updateAQIStatus('no2', aqi.no2, 25);
    updateAQIStatus('co', aqi.co, 0.8);
    updateAQIStatus('so2', aqi.so2, 5);
}

// Get AQI Level
function getAQILevel(value) {
    if (value <= 50) return 'good';
    if (value <= 100) return 'moderate';
    if (value <= 150) return 'unhealthy-sensitive';
    return 'unhealthy';
}

// Update AQI Status
function updateAQIStatus(pollutant, value, current) {
    // This is simplified - in real app, would use proper thresholds
    const status = value <= current * 1.2 ? 'good' : (value <= current * 1.5 ? 'moderate' : 'unhealthy');
    const element = document.getElementById(pollutant).parentElement.querySelector('.aqi-status');
    if (element) {
        element.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        element.className = 'aqi-status ' + status;
    }
}

// Update Forecast
function updateForecast(forecast) {
    const forecastList = document.getElementById('forecastList');
    forecastList.innerHTML = '';

    forecast.forEach(day => {
        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-icon">${day.icon}</div>
            <div class="forecast-temps">
                <span class="forecast-high">${day.high}°</span>
                <span class="forecast-low">${day.low}°</span>
            </div>
            <div class="forecast-desc">${day.desc}</div>
        `;
        forecastList.appendChild(item);
    });
}

// Setup Charts
function setupCharts() {
    setupHourlyChart();
    setupTemperatureChart();
}

// Setup Hourly Chart
function setupHourlyChart() {
    const ctx = document.getElementById('hourlyChart');
    if (!ctx) return;

    hourlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°F)',
                data: [],
                borderColor: 'rgba(45,212,191,1)',
                backgroundColor: 'rgba(45,212,191,0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                }
            }
        }
    });
}

// Setup Temperature Chart
function setupTemperatureChart() {
    const ctx = document.getElementById('temperatureChart');
    if (!ctx) return;

    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°F)',
                data: [],
                borderColor: 'rgba(45,212,191,1)',
                backgroundColor: 'rgba(45,212,191,0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                }
            }
        }
    });
}

// Update Hourly Chart
function updateHourlyChart(hourlyData) {
    if (!hourlyChart) return;

    hourlyChart.data.labels = hourlyData.map(h => h.time);
    hourlyChart.data.datasets[0].data = hourlyData.map(h => h.temp);
    hourlyChart.update();
}

// Update Temperature Chart
function updateTemperatureChart() {
    if (!temperatureChart) return;

    // Generate 24-hour temperature data
    const labels = [];
    const data = [];
    const now = new Date();
    const baseTemp = 72;

    for (let i = 0; i < 24; i++) {
        const hour = new Date(now);
        hour.setHours(now.getHours() - 23 + i);
        labels.push(hour.getHours() + ':00');
        const temp = baseTemp + Math.sin(i * Math.PI / 12) * 8 + (Math.random() * 4 - 2);
        data.push(Math.round(temp));
    }

    temperatureChart.data.labels = labels;
    temperatureChart.data.datasets[0].data = data;
    temperatureChart.update();
}

// Update Environmental Factors
function updateEnvironmentalFactors(data) {
    document.getElementById('pollenCount').textContent = data.pollen.overall;

    // Update pollen breakdown
    const pollenItems = document.querySelectorAll('.pollen-item');
    if (pollenItems.length >= 3) {
        pollenItems[0].querySelector('.pollen-level').textContent = data.pollen.tree;
        pollenItems[0].querySelector('.pollen-level').className = 'pollen-level ' + data.pollen.tree.toLowerCase();
        pollenItems[1].querySelector('.pollen-level').textContent = data.pollen.grass;
        pollenItems[1].querySelector('.pollen-level').className = 'pollen-level ' + data.pollen.grass.toLowerCase();
        pollenItems[2].querySelector('.pollen-level').textContent = data.pollen.weed;
        pollenItems[2].querySelector('.pollen-level').className = 'pollen-level ' + data.pollen.weed.toLowerCase();
    }

    document.getElementById('heatIndex').textContent = data.current.heatIndex + '°F';
    document.getElementById('heatStatus').textContent = getHeatStatus(data.current.heatIndex);

    document.getElementById('visibility').textContent = data.current.visibility + ' mi';

    document.getElementById('precipitation').textContent = data.current.precipitation + '%';
}

// Get Heat Status
function getHeatStatus(heatIndex) {
    if (heatIndex < 80) return 'Comfortable';
    if (heatIndex < 90) return 'Caution';
    if (heatIndex < 105) return 'Extreme Caution';
    return 'Danger';
}

// Update Alerts
function updateAlerts(data) {
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';

    const alerts = [];

    // UV Index alert
    if (data.current.uvIndex >= 6) {
        alerts.push({
            type: 'warning',
            icon: '⚠️',
            title: 'UV Index ' + (data.current.uvIndex >= 8 ? 'High' : 'Moderate'),
            message: 'Wear sunscreen and protective clothing when outdoors'
        });
    }

    // AQI alert
    if (data.aqi.value > 100) {
        alerts.push({
            type: 'danger',
            icon: '🚨',
            title: 'Air Quality Alert',
            message: 'Air quality is unhealthy. Limit outdoor activities.'
        });
    }

    // Heat alert
    if (data.current.heatIndex >= 90) {
        alerts.push({
            type: 'warning',
            icon: '🌡️',
            title: 'Heat Advisory',
            message: 'High heat index. Stay hydrated and avoid prolonged sun exposure.'
        });
    }

    // Pollen alert
    if (data.pollen.overall === 'High') {
        alerts.push({
            type: 'info',
            icon: '🌺',
            title: 'High Pollen Count',
            message: 'Pollen levels are high. Consider taking allergy medication.'
        });
    }

    if (alerts.length === 0) {
        alerts.push({
            type: 'info',
            icon: 'ℹ️',
            title: 'All Clear',
            message: 'No environmental alerts at this time'
        });
    }

    alerts.forEach(alert => {
        const item = document.createElement('div');
        item.className = 'alert-item ' + alert.type;
        item.innerHTML = `
            <div class="alert-icon-small">${alert.icon}</div>
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.message}</p>
            </div>
        `;
        alertsList.appendChild(item);
    });
}

// Update Location
function updateLocation() {
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value.trim();

    if (location) {
        currentLocation = location;
        loadWeatherData();
        showNotification('Location updated to ' + location, 'success');
        locationInput.value = '';
    } else {
        showNotification('Please enter a location', 'error');
    }
}

// Refresh Data
function refreshData() {
    const refreshBtn = document.querySelector('.btn-refresh');
    refreshBtn.style.animation = 'spin 1s linear';

    setTimeout(() => {
        loadWeatherData();
        updateTemperatureChart();
        refreshBtn.style.animation = '';
        showNotification('Weather data refreshed', 'success');
    }, 1000);
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add spin animation for refresh button
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

