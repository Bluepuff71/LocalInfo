<template>
  <b-container>
    <b-row align-h="center">
      <h1 class="display-1">Local Info</h1>
    </b-row>
    <b-row class="p-3">
      <LocInput @submit="onSubmit"/>
    </b-row>
    <b-row v-if="location !== ''">
      <b-col>
        <Map :location="location" />
      </b-col>
      <b-col>
        <Weather :location="location" />
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
import { BContainer, BRow, BCol } from "bootstrap-vue";
export default {
  name: "app",
  components: {
    Map,
    Weather,
    LocInput,
    BContainer,
    BRow,
    BCol
  },
  data() {
    return {
      location: ""
    };
  },
  methods: {
    onSubmit(loc) {
      this.$set(this, "location", loc);
    }
  }
};
</script>
