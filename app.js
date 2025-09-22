// Weather Insights Pro - Main Application Script
class WeatherApp {
    constructor() {
        this.currentLocation = null;
        this.weatherData = null;
        this.forecastData = null;
        this.chart = null;
        this.settings = {
            tempUnit: 'celsius',
            windUnit: 'kmh',
            refreshInterval: 300000, // 5 minutes
            notifications: true
        };
        
        // API Configuration (Using free tier APIs)
        this.APIs = {
            weather: 'https://api.openweathermap.org/data/2.5',
            forecast: 'https://api.openweathermap.org/data/2.5/forecast',
            geocoding: 'https://api.openweathermap.org/geo/1.0',
            // Free tier API key - replace with your own for production
            apiKey: 'demo_key_replace_with_actual', // Using demo for now
            // Alternative free APIs for backup
            backup: {
                weather: 'https://api.weatherapi.com/v1',
                aviation: 'https://api.aviationweather.gov/cgi-bin/data/dataserver.php'
            }
        };
        
        this.init();
    }

    async init() {
        this.loadSettings();
        this.setupEventListeners();
        await this.getCurrentLocation();
        await this.loadWeatherData();
        this.startAutoRefresh();
        this.hideLoadingScreen();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Top bar buttons
        document.getElementById('location-btn').addEventListener('click', () => this.updateLocation());
        document.getElementById('chat-btn').addEventListener('click', () => this.openChat());
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());

        // Modal controls
        document.getElementById('close-chat').addEventListener('click', () => this.closeModal('chat-modal'));
        document.getElementById('close-settings').addEventListener('click', () => this.closeModal('settings-modal'));

        // Chat functionality
        document.getElementById('send-chat').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });

        // Chart tabs
        document.querySelectorAll('.chart-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchChart(e.target.dataset.chart));
        });

        // Settings
        document.getElementById('temp-unit').addEventListener('change', (e) => {
            this.settings.tempUnit = e.target.value;
            this.saveSettings();
            this.updateWeatherDisplay();
        });

        // Prevent scrolling and zooming
        document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('gesturestart', (e) => e.preventDefault());
        document.addEventListener('gesturechange', (e) => e.preventDefault());
    }

    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                this.setDefaultLocation();
                resolve();
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    resolve();
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                    this.setDefaultLocation();
                    resolve();
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        });
    }

    setDefaultLocation() {
        // Default to New York City
        this.currentLocation = { lat: 40.7128, lon: -74.0060 };
    }

    async loadWeatherData() {
        try {
            // Simulate API calls with mock data for demo
            await this.loadCurrentWeather();
            await this.loadForecastData();
            this.updateWeatherDisplay();
            this.updateTravelSafety();
            this.updateCharts();
        } catch (error) {
            console.error('Error loading weather data:', error);
            this.showErrorMessage('Unable to load weather data. Using offline mode.');
            this.loadMockData();
        }
    }

    async loadCurrentWeather() {
        // Mock data for demonstration - replace with actual API call
        this.weatherData = {
            location: 'New York, NY',
            temperature: 22,
            description: 'Partly cloudy',
            humidity: 65,
            windSpeed: 12,
            visibility: 10,
            pressure: 1013,
            icon: '🌤️',
            conditions: 'clear'
        };
    }

    async loadForecastData() {
        // Mock forecast data
        this.forecastData = {
            hourly: this.generateHourlyForecast(),
            daily: this.generateDailyForecast()
        };
    }

    generateHourlyForecast() {
        const hours = [];
        const baseTemp = this.weatherData.temperature;
        const currentHour = new Date().getHours();
        
        for (let i = 0; i < 24; i++) {
            const hour = (currentHour + i) % 24;
            const tempVariation = Math.sin((hour - 14) * Math.PI / 12) * 8;
            const temp = Math.round(baseTemp + tempVariation + (Math.random() - 0.5) * 4);
            
            hours.push({
                time: `${hour.toString().padStart(2, '0')}:00`,
                temperature: temp,
                icon: this.getWeatherIcon(hour, temp),
                precipitation: Math.random() * 20
            });
        }
        return hours;
    }

    generateDailyForecast() {
        const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const daily = [];
        const baseTemp = this.weatherData.temperature;
        
        for (let i = 0; i < 7; i++) {
            const tempVariation = (Math.random() - 0.5) * 10;
            const high = Math.round(baseTemp + tempVariation + 5);
            const low = Math.round(baseTemp + tempVariation - 5);
            
            daily.push({
                day: days[i],
                high: high,
                low: low,
                icon: this.getWeatherIcon(12, high),
                precipitation: Math.random() * 30
            });
        }
        return daily;
    }

    getWeatherIcon(hour, temp) {
        const isNight = hour < 6 || hour > 20;
        if (temp > 30) return isNight ? '🌙' : '☀️';
        if (temp > 20) return isNight ? '🌙' : '🌤️';
        if (temp > 10) return '☁️';
        return '🌧️';
    }

    updateWeatherDisplay() {
        if (!this.weatherData) return;

        // Update current weather
        document.getElementById('current-location').textContent = this.weatherData.location;
        document.getElementById('current-temp').textContent = this.convertTemperature(this.weatherData.temperature);
        document.getElementById('weather-emoji').textContent = this.weatherData.icon;
        document.getElementById('wind-speed').textContent = this.convertWindSpeed(this.weatherData.windSpeed);
        document.getElementById('humidity').textContent = this.weatherData.humidity;
        document.getElementById('visibility').textContent = this.weatherData.visibility;
        document.getElementById('pressure').textContent = this.weatherData.pressure;

        // Update hourly forecast
        this.updateHourlyForecast();
        
        // Update weekly forecast
        this.updateWeeklyForecast();
    }

    updateHourlyForecast() {
        const container = document.getElementById('hourly-forecast');
        container.innerHTML = '';
        
        this.forecastData.hourly.slice(0, 12).forEach(hour => {
            const item = document.createElement('div');
            item.className = 'forecast-item';
            item.innerHTML = `
                <div class="forecast-time">${hour.time}</div>
                <div class="forecast-icon">${hour.icon}</div>
                <div class="forecast-temp">${this.convertTemperature(hour.temperature)}°</div>
            `;
            container.appendChild(item);
        });
    }

    updateWeeklyForecast() {
        const container = document.getElementById('weekly-forecast');
        container.innerHTML = '';
        
        this.forecastData.daily.forEach(day => {
            const item = document.createElement('div');
            item.className = 'weekly-item';
            item.innerHTML = `
                <div class="weekly-day">${day.day}</div>
                <div class="weekly-icon">${day.icon}</div>
                <div class="weekly-temps">
                    <span class="temp-high">${this.convertTemperature(day.high)}°</span>
                    <span class="temp-low">${this.convertTemperature(day.low)}°</span>
                </div>
            `;
            container.appendChild(item);
        });
    }

    updateTravelSafety() {
        const conditions = this.weatherData.conditions;
        const windSpeed = this.weatherData.windSpeed;
        const visibility = this.weatherData.visibility;
        
        // Calculate safety score based on weather conditions
        let safetyScore = 100;
        
        if (windSpeed > 30) safetyScore -= 30;
        else if (windSpeed > 20) safetyScore -= 15;
        
        if (visibility < 5) safetyScore -= 25;
        else if (visibility < 8) safetyScore -= 10;
        
        if (conditions.includes('storm') || conditions.includes('severe')) {
            safetyScore -= 40;
        }
        
        safetyScore = Math.max(0, safetyScore);
        
        // Update UI
        document.getElementById('safety-percentage').textContent = `${safetyScore}%`;
        
        let flightStatus = 'Excellent conditions for travel';
        let warningText = 'No weather warnings';
        
        if (safetyScore < 50) {
            flightStatus = 'Travel not recommended';
            warningText = 'Severe weather conditions';
        } else if (safetyScore < 70) {
            flightStatus = 'Exercise caution';
            warningText = 'Moderate weather concerns';
        }
        
        document.getElementById('flight-status').textContent = flightStatus;
        document.getElementById('weather-warnings').textContent = warningText;
        
        // Update safety score circle color
        const circle = document.querySelector('.score-circle');
        const color = safetyScore > 70 ? '#4caf50' : safetyScore > 50 ? '#ff9800' : '#f44336';
        circle.style.background = `conic-gradient(${color} 0deg, ${color} ${safetyScore * 3.6}deg, #e0e0e0 ${safetyScore * 3.6}deg)`;
    }

    updateCharts() {
        const ctx = document.getElementById('weather-chart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.forecastData.hourly.slice(0, 12).map(h => h.time),
                datasets: [{
                    label: 'Temperature (°C)',
                    data: this.forecastData.hourly.slice(0, 12).map(h => h.temperature),
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
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
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    switchChart(chartType) {
        document.querySelectorAll('.chart-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-chart="${chartType}"]`).classList.add('active');
        
        let data, label, color;
        
        switch (chartType) {
            case 'temperature':
                data = this.forecastData.hourly.slice(0, 12).map(h => h.temperature);
                label = 'Temperature (°C)';
                color = '#1976d2';
                break;
            case 'precipitation':
                data = this.forecastData.hourly.slice(0, 12).map(h => h.precipitation);
                label = 'Precipitation (%)';
                color = '#2196f3';
                break;
            case 'wind':
                data = this.forecastData.hourly.slice(0, 12).map(h => 5 + Math.random() * 15);
                label = 'Wind Speed (km/h)';
                color = '#4caf50';
                break;
        }
        
        this.chart.data.datasets[0].data = data;
        this.chart.data.datasets[0].label = label;
        this.chart.data.datasets[0].borderColor = color;
        this.chart.data.datasets[0].backgroundColor = color + '20';
        this.chart.update();
    }

    openChat() {
        document.getElementById('chat-modal').classList.add('active');
        document.getElementById('chat-input').focus();
    }

    openSettings() {
        document.getElementById('settings-modal').classList.add('active');
        this.loadSettingsUI();
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addChatMessage(message, 'user');
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addChatMessage(response, 'bot');
        }, 1000);
    }

    addChatMessage(content, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const icon = sender === 'bot' ? '<span class="material-icons">smart_toy</span>' : '<span class="material-icons">person</span>';
        
        messageDiv.innerHTML = `
            ${icon}
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
            return `Based on current conditions in ${this.weatherData.location}, it's ${this.weatherData.temperature}°C with ${this.weatherData.description}. The humidity is ${this.weatherData.humidity}% and winds are at ${this.weatherData.windSpeed} km/h.`;
        }
        
        if (lowerMessage.includes('travel') || lowerMessage.includes('flight') || lowerMessage.includes('safe')) {
            const safetyScore = document.getElementById('safety-percentage').textContent;
            return `Current travel safety score is ${safetyScore}. Weather conditions are generally good for travel. Wind speeds are moderate and visibility is clear.`;
        }
        
        if (lowerMessage.includes('forecast') || lowerMessage.includes('tomorrow')) {
            const tomorrow = this.forecastData.daily[1];
            return `Tomorrow's forecast shows a high of ${tomorrow.high}°C and low of ${tomorrow.low}°C. Expect ${tomorrow.icon} conditions throughout the day.`;
        }
        
        if (lowerMessage.includes('rain') || lowerMessage.includes('precipitation')) {
            return `There's a low chance of precipitation today. The forecast shows mostly clear skies with occasional clouds.`;
        }
        
        // Default responses
        const defaultResponses = [
            "I can help you with weather information, travel safety advice, and forecast data. What would you like to know?",
            "Feel free to ask about current weather conditions, travel recommendations, or upcoming forecasts!",
            "I'm here to provide weather insights and travel safety information. How can I assist you today?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    switchSection(section) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Scroll to relevant section or highlight it
        const sections = {
            weather: '.main-weather',
            travel: '.travel-insights',
            map: '.weather-map',
            insights: '.charts'
        };
        
        if (sections[section]) {
            document.querySelector(sections[section]).scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateLocation() {
        document.getElementById('location-btn').innerHTML = '<span class="material-icons">refresh</span>';
        this.getCurrentLocation().then(() => {
            this.loadWeatherData();
            document.getElementById('location-btn').innerHTML = '<span class="material-icons">my_location</span>';
        });
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        });
        const dateString = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric'
        });
        
        document.getElementById('current-time').textContent = `${dateString}, ${timeString}`;
    }

    convertTemperature(celsius) {
        if (this.settings.tempUnit === 'fahrenheit') {
            return Math.round((celsius * 9/5) + 32);
        }
        return Math.round(celsius);
    }

    convertWindSpeed(kmh) {
        switch (this.settings.windUnit) {
            case 'mph':
                return Math.round(kmh * 0.621371);
            case 'ms':
                return Math.round(kmh * 0.277778);
            default:
                return Math.round(kmh);
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('weatherAppSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('weatherAppSettings', JSON.stringify(this.settings));
    }

    loadSettingsUI() {
        document.getElementById('temp-unit').value = this.settings.tempUnit;
        document.getElementById('wind-unit').value = this.settings.windUnit;
        document.getElementById('refresh-interval').value = this.settings.refreshInterval;
        document.getElementById('notifications').checked = this.settings.notifications;
    }

    startAutoRefresh() {
        setInterval(() => {
            this.loadWeatherData();
        }, this.settings.refreshInterval);
    }

    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('app').style.display = 'flex';
        }, 2000);
    }

    showErrorMessage(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <span class="material-icons">error</span>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    loadMockData() {
        // Fallback mock data when APIs are unavailable
        this.weatherData = {
            location: 'Demo Location',
            temperature: 23,
            description: 'Partly cloudy',
            humidity: 60,
            windSpeed: 15,
            visibility: 10,
            pressure: 1015,
            icon: '🌤️',
            conditions: 'clear'
        };
        
        this.forecastData = {
            hourly: this.generateHourlyForecast(),
            daily: this.generateDailyForecast()
        };
        
        this.updateWeatherDisplay();
        this.updateTravelSafety();
        this.updateCharts();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}