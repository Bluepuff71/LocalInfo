<template>
  <b-container>
    <b-row align-h="center">
      <h1 class="display-1">Local Info</h1>
    </b-row>
    <b-row class="p-3">
      <LocInput :disabled="numReady === 0" @submit="onSubmit"/>
    </b-row>
    <b-row v-if="location !== ''">
      <b-col>
        <Map v-show="numReady == 2" :location="location" @ready="onReady"/>
      </b-col>
      <b-spinner v-if="numReady < 2" style="width: 3rem; height: 3rem;"></b-spinner>
      <b-col>
        <Weather v-show="numReady == 2" :location="location" @ready="onReady" />
      </b-col>
     
    </b-row>
    <b-row align-h="center" class="fixed-bottom">
      <p class="text-muted text-center font-weight-light">
        Built by Dalton Eschberger, Emery Porter, Jeffrey Lance, and Mark Stelluti.
      </p>
    </b-row>
  </b-container>
</template>

<script>
const Map = () => import('./components/Map');
const Weather = () => import('./components/Weather');
import LocInput from "./components/Input";
import { BContainer, BRow, BCol, BSpinner } from "bootstrap-vue";
export default {
  name: "app",
  components: {
    Map,
    Weather,
    LocInput,
    BContainer,
    BRow,
    BCol,
    BSpinner
  },
  data() {
    return {
      location: "",
      numReady: 0
    };
  },
  methods: {
    onSubmit(loc) {
      if(this.location !== loc){
        this.$set(this,"numReady", 0);
      }
      this.$set(this, "location", loc);
    },
    onReady(){
      this.$set(this,"numReady", this.numReady + 1);
    }
  }
};
</script>
