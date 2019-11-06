<template>
  <div>
    <div v-if="currentWeather !== null">
      <h1>
        Current Weather:
        <span
          :key="index"
          v-for="(weather, index) in currentWeather.weather"
        >{{index > 0 ? "and" : ""}}{{weather.main}}</span>
      </h1>
      <h2>Current Temperature: {{toFahrenheit(currentWeather.main.temp)}}F</h2>
      <h2>Humidity: {{currentWeather.main.humidity}}</h2>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Weather",
  data: function() {
    return {
      currentWeather: null
    };
  },
  methods: {
    toFahrenheit(kelvin) {
        return Math.round((kelvin -273.15) * (9/5) + 32);
    },
    searchByEverything(query) {
      axios({
        method: "get",
        url:
          "http://api.openweathermap.org/data/2.5/weather?q=" +
          query +
          "&appid=521541c0b63b06e83818edd25ea820e9",
        responseType: "json"
      })
        .then(response => {
          this.currentWeather = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    searchByZip(zip) {
      axios({
        method: "get",
        url:
          "http://api.openweathermap.org/data/2.5/weather?zip=" +
          zip +
          "&appid=521541c0b63b06e83818edd25ea820e9",
        responseType: "json"
      })
        .then(response => {
          this.currentWeather = response.data;
        })
        .catch(() => {
          this.searchByEverything(zip);
        });
    }
  },
  mounted() {
    this.$root.$on("updateVisuals", message => {
      this.searchByZip(message);
    });
  }
};
</script>

<style>
</style>