<template>
  <div class="weather-dashboard">
    <div class="weather-header">
      <h2>Rice Field Weather Monitoring</h2>
      <p class="subtitle">Real-time weather data for Managok, Malaybalay City</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i> Loading weather data...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
    </div>

    <!-- Content -->
    <div v-else class="weather-content">
      <!-- Current Conditions -->
      <div class="current-conditions">
        <div class="main-condition">
          <img :src="weatherIconUrl" :alt="currentWeather.weather[0].description">
          <div class="temp-display">
            <span class="current-temp">{{ Math.round(currentWeather.main.temp) }}°C</span>
            <span class="feels-like">Feels like {{ Math.round(currentWeather.main.feels_like) }}°C</span>
          </div>
          <div class="condition-desc">
            {{ currentWeather.weather[0].description }}
          </div>
        </div>

        <div class="weather-details">
          <div class="detail-card">
            <i class="fas fa-tint"></i>
            <span>Humidity</span>
            <strong>{{ currentWeather.main.humidity }}%</strong>
          </div>
          <div class="detail-card">
            <i class="fas fa-wind"></i>
            <span>Wind</span>
            <strong>{{ currentWeather.wind.speed }} m/s</strong>
          </div>
          <div class="detail-card">
            <i class="fas fa-cloud-rain"></i>
            <span>Rain</span>
            <strong>{{ rainVolume }} mm</strong>
          </div>
        </div>
      </div>

      <!-- Farmer Notifications -->
      <div class="notifications" :class="notificationClass">
        <h3><i class="fas fa-bell"></i> Farmer Advisory</h3>
        <p>{{ farmerNotification }}</p>
      </div>

      <!-- Forecast Charts -->
      <div class="forecast-section">
        <h3><i class="fas fa-chart-line"></i> 5-Day Forecast</h3>
        <div class="chart-container">
          <canvas ref="forecastChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';

export default {
  setup() {
    const API_KEY = '165c922e9d9f5d8536a3e2a24bd352be';
    const LAT = '8.1575';
    const LON = '125.1278';
    
    const currentWeather = ref(null);
    const forecastData = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const forecastChart = ref(null);

    const weatherIconUrl = computed(() => {
      return currentWeather.value 
        ? `https://openweathermap.org/img/wn/${currentWeather.value.weather[0].icon}@2x.png`
        : '';
    });

    const rainVolume = computed(() => {
      if (!currentWeather.value) return 0;
      return currentWeather.value.rain 
        ? currentWeather.value.rain['1h'] || currentWeather.value.rain['3h'] || 0 
        : 0;
    });

    const farmerNotification = computed(() => {
      if (!currentWeather.value) return '';
      
      const temp = currentWeather.value.main.temp;
      const rain = rainVolume.value;
      const wind = currentWeather.value.wind.speed;
      
      // Temperature advisories
      if (temp < 15) return "⚠️ Too cold for rice growth. Consider delaying planting or using cold protection.";
      if (temp > 35) return "⚠️ High temperatures may stress plants. Increase irrigation frequency.";
      
      // Rain advisories
      if (rain > 20) return "⚠️ Heavy rain expected. Check drainage systems and delay fertilizer application.";
      if (rain > 5) return "☔ Rain forecasted. Postpone irrigation and pesticide application.";
      
      // Wind advisories
      if (wind > 8) return "💨 Strong winds expected. Secure loose materials and consider windbreaks.";
      
      // Ideal conditions
      if (temp > 20 && temp < 30 && rain < 5) {
        return "✅ Ideal rice growing conditions. Good time for planting and field activities.";
      }
      
      return "🌱 Normal farming operations can continue. Monitor weather changes.";
    });

    const notificationClass = computed(() => {
      if (!currentWeather.value) return '';
      const notification = farmerNotification.value;
      if (notification.includes('⚠️')) return 'warning';
      if (notification.includes('✅')) return 'success';
      return 'info';
    });

    const fetchWeatherData = async () => {
      try {
        loading.value = true;
        
        // Fetch current weather
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
        );
        if (!currentResponse.ok) throw new Error('Failed to fetch current weather');
        currentWeather.value = await currentResponse.json();
        
        // Fetch forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
        );
        if (!forecastResponse.ok) throw new Error('Failed to fetch forecast');
        forecastData.value = await forecastResponse.json();
        
        createForecastChart();
      } catch (err) {
        error.value = `Error: ${err.message}`;
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const createForecastChart = () => {
      if (!forecastData.value || !forecastChart.value) return;
      
      const labels = forecastData.value.list
        .filter((_, index) => index % 8 === 0)
        .map(item => new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }));
      
      const temps = forecastData.value.list
        .filter((_, index) => index % 8 === 0)
        .map(item => item.main.temp);
      
      const rains = forecastData.value.list
        .filter((_, index) => index % 8 === 0)
        .map(item => item.rain ? (item.rain['3h'] || 0) : 0);
      
      new Chart(forecastChart.value.getContext('2d'), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Temperature (°C)',
              data: temps,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              yAxisID: 'y',
              tension: 0.4
            },
            {
              label: 'Rain (mm)',
              data: rains,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              yAxisID: 'y1',
              type: 'bar'
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Temperature (°C)'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Rain (mm)'
              },
              grid: {
                drawOnChartArea: false,
              }
            }
          }
        }
      });
    };

    onMounted(() => {
      fetchWeatherData();
    });

    return {
      currentWeather,
      loading,
      error,
      forecastChart,
      weatherIconUrl,
      rainVolume,
      farmerNotification,
      notificationClass
    };
  }
};
</script>

<style scoped>
.weather-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.weather-header {
  text-align: center;
  margin-bottom: 30px;
}

.subtitle {
  color: #666;
  margin-top: 5px;
}

.loading-state, .error-state {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
}

.loading-state i {
  margin-right: 10px;
}

.error-state i {
  color: #e74c3c;
  margin-right: 10px;
}

.current-conditions {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

.main-condition {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.main-condition img {
  width: 80px;
  height: 80px;
}

.temp-display {
  display: flex;
  flex-direction: column;
}

.current-temp {
  font-size: 2.5rem;
  font-weight: bold;
}

.feels-like {
  color: #666;
  font-size: 0.9rem;
}

.condition-desc {
  text-transform: capitalize;
  font-size: 1.2rem;
  margin-left: auto;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.detail-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.detail-card i {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 5px;
  color: #16a085;
}

.detail-card span {
  display: block;
  font-size: 0.9rem;
  color: #666;
}

.detail-card strong {
  font-size: 1.2rem;
}

.notifications {
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.notifications.warning {
  background-color: #fff3cd;
  border-left: 5px solid #ffc107;
  color: #856404;
}

.notifications.success {
  background-color: #d4edda;
  border-left: 5px solid #28a745;
  color: #155724;
}

.notifications.info {
  background-color: #d1ecf1;
  border-left: 5px solid #17a2b8;
  color: #0c5460;
}

.notifications h3 {
  margin-top: 0;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.notifications h3 i {
  font-size: 1.2rem;
}

.forecast-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.forecast-section h3 {
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-container {
  margin-top: 20px;
  position: relative;
  height: 300px;
}

@media (max-width: 768px) {
  .main-condition {
    flex-direction: column;
    text-align: center;
  }
  
  .condition-desc {
    margin-left: 0;
  }
  
  .weather-details {
    grid-template-columns: 1fr 1fr;
  }
}
</style>