<template>
  <b-input-group>
    <b-input-group-prepend v-if="geolocation">
      <b-button variant="info" @click="onCurrentLocationButton" class="material-icons md-18">
        my_location
      </b-button>
    </b-input-group-prepend>
    <b-form-input
      v-model="location"
      placeholder="Address, Zipcode, or Place"
      v-on:keyup.enter="onClick(location)"
    ></b-form-input>
    <b-input-group-append>
      <b-button variant="info" @click="onClick(location)">Submit</b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
import {
  BButton,
  BFormInput,
  BInputGroupPrepend,
  BInputGroupAppend,
  BInputGroup
} from "bootstrap-vue";
import axios from "axios";
export default {
  components: {
    BButton,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BInputGroupPrepend
  },
  data() {
    return {
      location: ""
    };
  },
  computed: {
    geolocation: function() {
      return navigator.geolocation;
    }
  },
  methods: {
    onClick(location) {
      this.$emit("submit", location);
    },
    onCurrentLocationButton() {
      navigator.geolocation.getCurrentPosition(position => {
        axios({
          method: "get",
          url:
            "https://api.opencagedata.com/geocode/v1/json?q=" +
            position.coords.latitude +
            "+" +
            position.coords.longitude +
            "&key=" +
            process.env.VUE_APP_OPEN_CAGE_KEY,
          responseType: "json"
        })
          .then(response => {
            this.$set(this, "location", response.data.results[0].formatted);
            this.$emit("submit", response.data.results[0].formatted);
          });
      });
    }
  }
};
</script>