<template>
  <b-card no-body v-if="currentWeather !== null">
    <b-card-body class="text-center p-2">
      <i :class="weatherIcon + ' mb-4' " style="font-size: 108pt;"></i>
      <h1 class="text-capitalize"
        :key="index"
        v-for="(weather, index) in currentWeather.weather"
      >{{index > 0 ? " and " : ""}}{{weather.description}}</h1>
      <h2>{{toFahrenheit(currentWeather.main.temp)}}°F</h2>
      <h2>Humidity: {{currentWeather.main.humidity}}%</h2>
    </b-card-body>
  </b-card>
</template>
<script>
import axios from "axios";
import { BCard, BCardBody } from "bootstrap-vue";
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
        (Date.now() > this.currentWeather.sys.sunset ? "night-" : "day-") +
        this.currentWeather.weather[0].id
      );
    }
  },
  methods: {
    toFahrenheit(kelvin) {
      return Math.round((kelvin - 273.15) * (9 / 5) + 32);
    },
    setByLat(query) {
      axios({
        method: "get",
        url:
          "https://api.opencagedata.com/geocode/v1/json?q=" +
          query +
          "&key=411bb6a242ce43e79f7b83fb19902c4e",
        responseType: "json"
      })
        .then(response => {
          axios({
            method: "get",
            url:
              "http://api.openweathermap.org/data/2.5/weather?lat=" +
              response.data.results[0].geometry.lat +
              "&lon=" +
              response.data.results[0].geometry.lng +
              "&appid=521541c0b63b06e83818edd25ea820e9",
            responseType: "json"
          })
            .then(response => {
              this.$set(this, "currentWeather", response.data);
            })
            .catch(error => {
              console.log(error);
              console.log(query);
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style>
</style>