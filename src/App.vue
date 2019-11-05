<template>
    <div class="pageWrapper">
        <div class="headerWrapper">
            <ul id="nav">
                <li><a>Welcome!</a></li>
                <li>
                    <div class="inputWrapper">
                        <InputComp/>
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
            <WeatherTest id="weather"/>
            <MapTest id="map"/>
        </div>


    </div>
</template>

<script>
    import WeatherTest from "./components/WeatherTest";
    import MapTest from "./components/MapTest";
    import Input from "./components/Input";

    export default {
        name: 'app',
        components: {
            WeatherTest,
            MapTest,
            InputComp: Input
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
        width: 100%;
        font-size: 46px;
        text-align: center;
        position: relative;
        height: 80vh;
    }

    #map {
        position: absolute;
        top: 0;
        left: 0;
        background: red;
        width: 50%;
        height: 100%;
    }

    #weather {
        position: absolute;
        background: aqua;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
    }
</style>
