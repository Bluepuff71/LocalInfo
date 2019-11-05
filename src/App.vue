<template>
    <div class="pageWrapper">
        <div class="headerWrapper">
            <ul id="nav">
                <li><a>Welcome!</a></li>
                <li>
                    <div class="inputWrapper">
                        <div id="form">
                            <label>
                                <input id='textInput' v-on:keyup.enter="updateData()" v-model="message"
                                       placeholder="Enter Address or Zip">
                            </label>
                            <button id='textButton' v-on:click="updateData()">Submit</button>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="creditWrapper">
                        <p>Dalton Eschberger</p>
                        <p>Emery Porter</p>
                        <p>Jeffery Lance</p>
                        <p>Mark Stelluti</p>
                    </div>
                </li>
            </ul>
        </div>

        <div class="visualsWrapper">
            <!-- <WeatherTest id="weather"/>-->
            <Map id="map"/>
        </div>


    </div>
</template>

<script>

    import Map from "./components/Map";


    export default {
        name: 'app',
        components: {
            Map
        },
        data() {
            return {
                message: '',
            }
        },
        methods: {
            updateData() {
                this.$root.$emit("updateVisuals", this.message);
            }
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Asap:400,500,700&display=swap');

    * {
        margin: 0;
        padding: 0;
        font-family: Asap, sans-serif;
        font-weight: bold;
    }

    #nav {
        background-color: #292C34;
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        position: relative;
    }

    .inputWrapper {
        position: absolute;
        left: 30%;
        margin: 10px auto;
        float: left;
        display: block;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
    }

    #nav > li > a {
        float: left;
        display: block;
        color: white;
        margin: 5px;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        font-size: 40pt;
    }

    .creditWrapper {
        padding: 14px 16px;
        position: absolute;
        right: 20px;
        float: right;
        color: white;
        text-align: center;
        text-decoration: none;
    }

    .visualsWrapper {
        border: 3px solid white;
        border-radius: 4px;
        font-size: 46px;
        text-align: center;
        position: relative;
        height: 80vh;
    }

    #map {
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
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
