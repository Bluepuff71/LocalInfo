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
        if(newValue !== ""){
          this.setByLat(newValue);
        }
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
    currentTemp: function() {
      return Math.round(this.currentWeather.main.temp);
    },
    weatherDescription: function() {
      var description = "";
      this.currentWeather.weather.forEach((weather, index) => {
        description += (index > 0 ? " and " : "") + weather.description;
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
    getHighestConfidenceIndex(results){
      var highest = {confidence: -1};
      var highestIndex = -1;
      results.forEach((result, index) => {
        if(result.confidence > highest.confidence){
          highest = result;
          highestIndex = index;
        }
      });
      return highestIndex;
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
          if (response.data.results.length === 0) {
            this.$emit("error", 404);
          } else {
            axios({
              method: "get",
              url:
                "https://api.openweathermap.org/data/2.5/weather?lat=" +
                response.data.results[this.getHighestConfidenceIndex(response.data.results)].geometry.lat +
                "&lon=" +
                response.data.results[this.getHighestConfidenceIndex(response.data.results)].geometry.lng +
                "&units=imperial&appid=" +
                process.env.VUE_APP_OPEN_WEATHER_KEY,
              responseType: "json"
            })
              .then(response => {
                this.$set(this, "currentWeather", response.data);
                this.$emit("ready");
              })
              .catch(error => {
                this.$emit("error", error);
              });
          }
        })
        .catch(error => {
          this.$emit("error", error);
        });
    }
  }
};
</script>