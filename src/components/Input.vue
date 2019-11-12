<template>
  <b-input-group>
    <b-input-group-prepend v-if="geolocation">
      <b-button v-if="showSpinner" disabled variant="info" @click="onCurrentLocationButton">
        <b-spinner variant="light" small label="Spinning"></b-spinner>
      </b-button>
      <b-button
        :disabled="disabled"
        v-else
        variant="info"
        @click="onCurrentLocationButton"
        class="material-icons-round md-18"
      >my_location</b-button>
    </b-input-group-prepend>
    <b-form-input
      ref="input"
      autofocus
      :disabled="showSpinner || disabled"
      v-model="location.formatted"
      :placeholder="placeHolder"
      v-on:keyup.enter="onClick(location.formatted)"
    ></b-form-input>
    <b-button
      v-show="location.formatted !== ''"
      class="material-icons-round md-18 clear-button"
      active-class
      :disabled="showSpinner || disabled"
      @click="onClearClick"
    >clear</b-button>
    <b-input-group-append>
      <b-button
        :disabled="showSpinner || disabled"
        variant="info"
        @click="onClick(location.formatted)"
      >Submit</b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
import {
  BButton,
  BFormInput,
  BInputGroupPrepend,
  BInputGroupAppend,
  BInputGroup,
  BSpinner
} from "bootstrap-vue";
import axios from "axios";
export default {
  components: {
    BButton,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BInputGroupPrepend,
    BSpinner
  },
  data() {
    return {
      location: { formatted: "" },
      showSpinner: false
    };
  },
  props: {
    disabled: {
      type: Boolean
    }
  },
  computed: {
    geolocation: function() {
      return navigator.geolocation;
    },
    placeHolder: function() {
      return this.showSpinner
        ? "Getting current location..."
        : "Address, Zipcode, or Place";
    }
  },
  methods: {
    approx(v1, v2) {
      return Math.abs(v1 - v2) <= 0.001;
    },
    onClearClick() {
      this.$set(this, "location", { formatted: "" });
      this.$refs.input.$el.focus();
    },
    onClick(location) {
      if (!this.showSpinner) {
        this.$emit("submit", location);
      }
    },
    onCurrentLocationButton() {
      const prevLocation = this.location;
      this.$set(this, "location", { formatted: "" });
      this.$set(this, "showSpinner", true);
      this.$emit("loading");
      navigator.geolocation.getCurrentPosition(
        position => {
          if (
            prevLocation.geometry &&
            this.approx(position.coords.latitude, prevLocation.geometry.lat) &&
            this.approx(position.coords.longitude, prevLocation.geometry.lng)
          ) {
            this.$set(this, "showSpinner", false);
            this.$set(this, "location", prevLocation);
            this.$emit("cancel");
          } else {
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
                if (
                  response.data.results[0].formatted === prevLocation.formatted
                ) {
                  this.$set(this, "showSpinner", false);
                  this.$emit("cancel");
                } else {
                  this.$set(this, "showSpinner", false);
                  this.$set(this, "location", response.data.results[0]);
                  this.$emit("submit", response.data.results[0].formatted);
                }
              })
              .catch(error => {
                this.$set(this, "showSpinner", false);
                this.$emit("error", error);
              });
          }
        },
        error => {
          this.$set(this, "showSpinner", false);
          this.$emit("error", error);
        }
      );
    }
  }
};
</script>
<style>
.clear-button {
  border: 0 !important;
  margin-left: -40px;
  z-index: 100;
  color: black !important;
  background-color: transparent !important;
}
</style>