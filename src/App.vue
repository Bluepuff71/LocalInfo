<template>
  <b-container>
    <b-row align-h="center">
      <h1 class="display-1">Local Info</h1>
    </b-row>
    <b-row class="p-3">
      <LocInput :disabled="disableInput" @submit="onSubmit" @cancel="onInputCancel" @loading="onInputBusy" />
    </b-row>
    <b-row v-show="location !== '' && !showSpinner">
      <b-col>
        <Map v-show="numReady == 2" :location="location" @ready="onReady" />
      </b-col>
      <b-card class="text-center" v-show="error != null">
        <i class="material-icons-round md-18" style="font-size: 80pt">mood_bad</i>
        <h2>{{errorText.text}}</h2>
        <h2>{{errorText.solution}}</h2>
      </b-card>
      <b-col>
        <Weather v-show="numReady == 2" :location="location" @ready="onReady" @error="onError"/>
      </b-col>
    </b-row>
    <b-row align-h="center" v-show="showSpinner">
      <b-spinner style="width: 3rem; height: 3rem;"></b-spinner>
    </b-row>
    <b-row align-h="center" class="fixed-bottom">
      <p
        class="text-muted text-center font-weight-light"
      >Built by Dalton Eschberger, Emery Porter, Jeffrey Lance, and Mark Stelluti.</p>
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
      location: "",
      numReady: 0,
      disableInput: false,
      error: null,
      showSpinner: false
    };
  },
  computed: {
    errorText: function(){
      var json = {};
      if(this.error === 404){
        json.text = "The specifed location could not be found.";
        json.solution = "Try checking your input.";
      } else {
        json.text = "Hmm... something went wrong.";
        json.solution = "Try checking your input.";
      }
      return json;
    }
  },
  methods: {
    onInputCancel(){
      this.$set(this, "showSpinner", false);
      this.$set(this, "disableInput", false);
    },
    onInputBusy(){
       this.$set(this, "showSpinner", true);
    },
    onSubmit(loc) {
      if (this.location !== loc) {
        this.$set(this, "showSpinner", true);
        this.$set(this, "error", null);
        this.$set(this, "numReady", 0);
        this.$set(this, "disableInput", true);
      }
      this.$set(this, "location", loc);
    },
    onError(err){
      this.$set(this,"error", err);
      this.$set(this, "disableInput", false);
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
