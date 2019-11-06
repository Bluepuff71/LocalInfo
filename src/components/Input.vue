<template>
  <b-input-group>
    <b-form-input v-model="location" placeholder="Address, Zipcode, or Place" v-on:keyup.enter="onClick(location)"></b-form-input>
    <b-input-group-append>
      <b-button variant="info" @click="onClick(location)">Submit</b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
import {
  BButton,
  BFormInput,
  BInputGroupAppend,
  BInputGroup
} from "bootstrap-vue";
export default {
  components: {
    BButton,
    BFormInput,
    BInputGroupAppend,
    BInputGroup
  },
  data() {
    return {
        location: ""
    };
  },
  methods: {
    onClick(location){
        this.$emit("submit", location)
    }
  },
};
</script>