<template>
  <b-container>
    <b-row align-h="center">
      <h1 class="display-1 mb-0">Local Info</h1>
    </b-row>
    <b-row align-h="center" class="my-0">
      <p
        class="text-muted text-center font-weight-light my-0"
      >Built by Dalton Eschberger, Emery Porter, Jeffrey Lance, and Mark Stelluti.</p>
    </b-row>
    <b-row class="pb-2 pt-2">
      <LocInput
        :disabled="disableInput"
        @submit="onSubmit"
        @error="onError"
        @cancel="onInputCancel"
        @loading="onInputBusy"
      />
    </b-row>
    <b-row v-show="error !== ''" align-h="center">
      <b-col class="px-0">
        <b-card class="text-center">
          <i class="material-icons-round md-18" style="font-size: 80pt">mood_bad</i>
          <h2>{{errorText.text}}</h2>
          <h2>{{errorText.solution}}</h2>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mb-2" v-show="location !== '' && !showSpinner && error === ''">
      <b-col class="pl-0">
        <Map v-show="numReady == 2" :location="location" @ready="onReady" />
      </b-col>
      <b-col class="pr-0">
        <Weather v-show="numReady == 2" :location="location" @ready="onReady" @error="onError" />
      </b-col>
    </b-row>
    <b-row align-h="center" v-show="showSpinner">
      <b-spinner style="width: 3rem; height: 3rem;"></b-spinner>
    </b-row>
  </b-container>
</template>

<script>
const Map = () => import("./components/Map");
const Weather = () => import("./components/Weather");
import LocInput from "./components/Input";
import { BContainer, BRow, BCol, BSpinner, BCard } from "bootstrap-vue";
export default {
  name: "app",
  components: {
    Map,
    Weather,
    LocInput,
    BContainer,
    BRow,
    BCol,
    BSpinner,
    BCard
  },
  data() {
    return {
      location: { formatted: "" },
      numReady: 0,
      disableInput: false,
      error: "",
      showSpinner: false
    };
  },
  computed: {
    errorText: function() {
      var json = {};
      if (this.error === "") {
        json.text = "";
        json.solution = "";
      } else if (this.error === 404) {
        json.text = "The specifed location could not be found.";
        json.solution = "Try checking your input.";
      } else if (this.error.code) {
        switch (this.error.code) {
          case this.error.PERMISSION_DENIED:
            json.text =
              "Hmm... It seems that your browser has denied me access to your location.";
            json.solution =
              "Giving me access to your location should fix this.";
            break;
          case this.error.POSITION_UNAVAILABLE:
            json.text = "Location information is unavailable.";
            json.solution = "Where are you?";
            break;
          case this.error.TIMEOUT:
            json.text = "The request timed out.";
            json.solution = "Try reloading the page and try again.";
            break;
          case this.error.UNKNOWN_ERROR:
            json.text = "Hmm... something went wrong.";
            json.solution = "Try checking your input.";
            break;
        }
      } else {
        json.text = "Hmm... something went wrong.";
        json.solution = "Try checking your input.";
      }
      return json;
    }
  },
  methods: {
    onInputCancel() {
      this.$set(this, "showSpinner", false);
      this.$set(this, "disableInput", false);
      this.$set(this, "numReady", 2);
    },
    onInputBusy() {
      this.$set(this, "numReady", 0);
      this.$set(this, "disableInput", true);
      this.$set(this, "error", "");
      this.$set(this, "showSpinner", true);
    },
    onSubmit(loc) {
      if (this.location !== loc) {
        this.$set(this, "showSpinner", true);
        this.$set(this, "error", "");
        this.$set(this, "numReady", 0);
        this.$set(this, "disableInput", true);
      }
      this.$set(this, "location", loc);
    },
    onError(err) {
      this.$set(this, "error", err);
      this.$set(this, "disableInput", false);
      this.$set(this, "showSpinner", false);
    },
    onReady() {
      this.$set(this, "numReady", this.numReady + 1);
      this.$nextTick(() => {
        if (this.numReady === 2) {
          this.$set(this, "showSpinner", false);
          this.$set(this, "disableInput", false);
        }
      });
    }
  }
};
</script>
