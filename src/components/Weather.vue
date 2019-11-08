<template>
  <b-card no-body v-if="currentWeather !== null">
    <b-card-body class="text-center p-2">
      <i :class="weatherIcon" style="font-size: 90pt; line-height:normal"></i>
      <h2 class="text-capitalize">{{weatherDescription}}</h2>
      <h2>Temp: {{currentTemp}}°F</h2>
      <h2>Humidity: {{currentWeather.main.humidity}}%</h2>
      <h2>Wind: {{currentWeather.wind.speed}}mph</h2>
    </b-card-body>
  </b-card>
</template>
<script>
import axios from "axios";
import { BCard, BCardBody } from 'bootstrap-vue';
export default {
  components: {
    BCard,
    BCardBody
  },
  data: function() {
    return {
      currentWeather: null
    };
  },
  props: {
    location: {
      type: String,
      required: true
    }
  },
  watch: {
    location: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.setByLat(newValue);
      }
    }
  },
  computed: {
    weatherIcon: function() {
      return (
        "wi wi-owm-" +
        this.getIconState(this.currentWeather.sys) +
        "-" +
        this.currentWeather.weather[0].id
      );
    },
    currentTemp: function(){
      return Math.round(this.currentWeather.main.temp);
    },
    weatherDescription: function(){
      var description = "";
      this.currentWeather.weather.forEach((weather, index) => {
        description += (index > 0 ? " and " : "") + weather.description
      });
      return description;
    }
  },
  methods: {
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
    setByLat(query) {
      axios({
        method: "get",
        url:
          "https://api.opencagedata.com/geocode/v1/json?q=" +
          query +
          "&key=" +
          process.env.VUE_APP_OPEN_CAGE_KEY,
        responseType: "json"
      })
        .then(response => {
          axios({
            method: "get",
            url:
              "https://api.openweathermap.org/data/2.5/weather?lat=" +
              response.data.results[0].geometry.lat +
              "&lon=" +
              response.data.results[0].geometry.lng +
              "&units=imperial&appid=" +
              process.env.VUE_APP_OPEN_WEATHER_KEY,
            responseType: "json"
          })
            .then(response => {
              this.$set(this, "currentWeather", response.data);
              this.$emit("ready");
            });
        });
    }
  }
};
</script>