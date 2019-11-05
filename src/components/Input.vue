<template>
    <div id="inputwrapper">
        <div id="form">
            <label>
                <input id='textInput' v-on:keyup.enter="updatedata" v-model="message"
                       placeholder="Enter Address or Zip">
            </label>
            <button id='textButton' v-on:click="updatedata">Submit</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Input",
        data() {
            return {
                message: '',
            }
        },
        methods: {
            updatedata: function () {
                alert(this.message)
            }
        }
    }
</script>

<style scoped>
    * {
        margin: 0;
        padding: 0;
        font-family: Asap, sans-serif;
        font-weight: bold;
    }

    #textInput {
        height: 50px;
        font-size: 30pt;
    }

    #textButton {
        height: 50px;
        font-size: 30pt;
        color: #292C34;
        background: white
    }


</style>