<template>
  <b-card no-body class="text-center" v-if="currentWeather !== null && forecast !== null">
    <b-tabs fill card>
        <b-tab title="Current" active style="padding:2%">
          <i :class="weatherIcon" style="font-size: 20vh; line-height:normal"></i>
          <h2 class="text-capitalize">{{curWeatherDescription}}</h2>
          <h2>Temp: {{currentTemp}}°F</h2>
          <h2>Humidity: {{currentWeather.main.humidity}}%</h2>
          <h2>Wind: {{currentWeather.wind.speed}}mph</h2>
        </b-tab>
        <b-tab title="5-Day" lazy>
          <b-carousel id="5day" :interval="10000" v-model="slide" controls>
            <b-carousel-slide
              :key="index"
              v-for="(day, index) in getForecast"
              img-blank
              img-alt="Blank image"
            >
              <template #img>
                <h2>{{day.date}}{{index === 0 ? ' (Today)' : ''}}{{index === 1 ? ' (Tomorrow)' : ''}}</h2>
                <i :class="day.icon" style="font-size: 90pt; line-height:normal"></i>
                <h2 class="text-capitalize">{{day.desc}}</h2>
                <h2>Temp: {{day.avgs.minTemp}}°F/{{day.avgs.maxTemp}}°F</h2>
                <h2>Humidity: {{day.avgs.humidity}}%</h2>
                <h2>Wind: {{day.avgs.humidity}}mph</h2>
              </template>
            </b-carousel-slide>
          </b-carousel>
        </b-tab>
      </b-tabs>
  </b-card>
</template>
<script>
import axios from "axios";
import {
  BCard,
  BTab,
  BTabs,
  BCarousel,
  BCarouselSlide
} from "bootstrap-vue";
export default {
  components: {
    BCard,
    BTab,
    BTabs,
    BCarousel,
    BCarouselSlide
  },
  data: function() {
    return {
      currentWeather: null,
      forecast: null,
      ready: 0,
      slide: 0
    };
  },
  props: {
    location: {
      type: Object,
      required: true
    }
  },
  watch: {
    location: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue.formatted !== "") {
          this.setWeatherByLat(newValue);
          this.setForecastByCoords(newValue);
        }
      }
    }
  },
  computed: {
    getForecast: function() {
      var forecast = [];
      this.splitDays(this.forecast.list).forEach(day => {
        forecast.push({
          avgs: this.getDailyAvgs(this.forecast.list.slice(day.start, day.end)),
          desc: this.buildWeatherDescription(
            this.forecast.list[Math.round((day.start + day.end) / 2)]
          ),
          date: this.getDate(this.forecast.list[day.start].dt),
          icon:
            "wi wi-owm-" +
            this.forecast.list[Math.round((day.start + day.end) / 2)].weather[0]
              .id
        });
      });
      return forecast;
    },
    weatherIcon: function() {
      return (
        "wi wi-owm-" +
        this.getIconState(this.currentWeather.sys) +
        "-" +
        this.currentWeather.weather[0].id
      );
    },
    currentTemp: function() {
      return Math.round(this.currentWeather.main.temp);
    },
    curWeatherDescription: function() {
      var description = "";
      this.currentWeather.weather.forEach((weather, index) => {
        description += (index > 0 ? " and " : "") + weather.description;
      });
      return description;
    }
  },
  methods: {
    splitDays(forecastList) {
      var days = [];
      var currentDay = 0;
      var index = 0;
      forecastList.forEach((item, i) => {
        if (currentDay === 0) {
          days.push({ start: 0, end: 0 });
          days[0].start = 0;
          currentDay = new Date(item.dt * 1000).getDate();
        } else if (new Date(item.dt * 1000).getDate() !== currentDay) {
          index++;
          currentDay = new Date(item.dt * 1000).getDate();
          days.push({ start: 0, end: 0 });
          days[index - 1].end = i - 1;
          days[index].start = i;
        }
        if (i + 1 === forecastList.length) {
          days[index].end = i;
        }
      });
      return days;
    },
    getDate(secs) {
      return new Date(secs * 1000).toLocaleDateString("en-US");
    },
    buildWeatherDescription(time) {
      var description = "";
      time.weather.forEach((weather, index) => {
        description += (index > 0 ? " and " : "") + weather.description;
      });
      return description;
    },
    getDailyAvgs(list) {
      var avgs = {
        maxTemp: null,
        minTemp: null,
        windSpeed: null,
        humidity: null
      };
      list.forEach((weather, index) => {
        if (avgs.minTemp === null || weather.main.temp <= avgs.minTemp) {
          avgs.minTemp = Math.round(weather.main.temp);
        }
        if (avgs.maxTemp === null || weather.main.temp >= avgs.maxTemp) {
          avgs.maxTemp = Math.round(weather.main.temp);
        }
        if (avgs.humidity !== null) {
          avgs.humidity = Math.round(
            (weather.main.humidity + avgs.humidity) / (index + 1)
          );
        } else {
          avgs.humidity = Math.round(weather.main.humidity);
        }
        if (avgs.windSpeed !== null) {
          avgs.windSpeed = Math.round(
            (weather.wind.speed + avgs.windSpeed) / (index + 1)
          );
        } else {
          avgs.windSpeed = Math.round(weather.wind.speed);
        }
      });
      return avgs;
    },
    getIconState(sys) {
      const currentTime = Math.round(Date.now() / 1000);
      if (currentTime > sys.sunset || currentTime < sys.sunrise) {
        return "night";
      } else {
        return "day";
      }
    },
    toFahrenheit(kelvin) {
      return Math.round((kelvin - 273.15) * (9 / 5) + 32);
    },
    setWeatherByLat(query) {
      axios({
        method: "get",
        url:
          "https://api.openweathermap.org/data/2.5/weather?lat=" +
          query.lat +
          "&lon=" +
          query.lng +
          "&units=imperial&appid=" +
          process.env.VUE_APP_OPEN_WEATHER_KEY,
        responseType: "json"
      })
        .then(response => {
          this.$set(this, "currentWeather", response.data);
          this.$set(this, "ready", this.ready + 1);
          if (this.ready === 2) {
            this.$emit("ready");
          }
        })
        .catch(error => {
          this.$emit("error", error);
        });
    },
    setForecastByCoords(location) {
      axios({
        method: "get",
        url:
          "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          location.lat +
          "&lon=" +
          location.lng +
          "&units=imperial&appid=" +
          process.env.VUE_APP_OPEN_WEATHER_KEY,
        responseType: "json"
      })
        .then(response => {
          this.$set(this, "forecast", response.data);
          this.$set(this, "ready", this.ready + 1);
          if (this.ready === 2) {
            this.$emit("ready");
          }
        })
        .catch(error => {
          this.$emit("error", error);
        });
    }
  }
};
</script>
<style>
.carousel-control-prev-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3e%3c/svg%3e") !important;
}
.carousel-control-next-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3e%3c/svg%3e") !important;
}
  h2{
    font-size: 5vh;

    line-height:normal;
  }
</style>