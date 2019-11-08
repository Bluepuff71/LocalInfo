<template>
  <b-card no-body class="h-100">
    <b-card-body class="p-2">
      <iframe
        width="100%"
        height="100%"
        style="border:0"
        :src="'https://www.google.com/maps/embed/v1/place?key=' + googleAPIKey + '&q=' + location"
        allowfullscreen
        @load="onLoad"
      ></iframe>
    </b-card-body>
  </b-card>
</template>

<script>
import { BCard, BCardBody } from "bootstrap-vue";
export default {
  name: "Map",
  components: {
    BCard,
    BCardBody
  },
  data: function() {
    return {
      googleAPIKey: process.env.VUE_APP_GOOGLE_EMBED_KEY
    }
  },
  props: {
    location: {
      type: String,
      required: true
    }
  },
  methods: {
    onLoad(){
      this.$emit("ready");
    }
  }
};
</script>