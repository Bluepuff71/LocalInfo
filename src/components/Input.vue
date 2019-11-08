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
        class="material-icons md-18"
      >my_location</b-button>
    </b-input-group-prepend>
    <b-form-input
      ref="input"
      autofocus
      :disabled="showSpinner || disabled"
      v-model="location"
      :placeholder="placeHolder"
      v-on:keyup.enter="onClick(location)"
    ></b-form-input>
    <b-button
      v-show="location !== ''"
      class="material-icons md-18 clear-button"
      active-class=""
      :disabled="showSpinner || disabled"
      style=""
      @click="onClearClick"
    >clear</b-button>
    <b-input-group-append>
      <b-button :disabled="showSpinner || disabled" variant="info" @click="onClick(location)">Submit</b-button>
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
      location: "",
      showSpinner: false
    };
  },
  props:{
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
    onClearClick(){
      this.$set(this, 'location', ''); 
      this.$refs.input.$el.focus();
    },
    onClick(location) {
      if(!this.showSpinner){
        this.$emit("submit", location);
      }
    },
    onCurrentLocationButton() {
      this.$set(this, 'location', ''); 
      this.$set(this, "showSpinner", true);
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
        }).then(response => {
          this.$set(this, "showSpinner", false);
          this.$set(this, "location", response.data.results[0].formatted);
          this.$emit("submit", response.data.results[0].formatted);
        });
      });
    }
  }
};
</script>
<style>
.clear-button{
  border: 0 !important; 
  margin-left: -40px; 
  z-index: 100;
  color: black !important;
  background-color: transparent !important;
}
</style>