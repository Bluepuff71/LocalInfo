<template>
    <div class='mainWrapper'>
        <iframe
                width=100%
                height=100%
                style="border:0"
                :src="defaultSrc" allowfullscreen>
        </iframe>
    </div>
</template>

<script>
    export default {
        name: "Map",
        data() {
            return {
                defaultSrc: "https://www.google.com/maps/embed/v1/place?key=AIzaSyDhYnee1SxMDL2hiaZ_Vi5WNNrCIyNo3JA&q=Texas+Tech",
            }
        },
        methods: {
            updateMap(message) {
                this.defaultSrc = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDhYnee1SxMDL2hiaZ_Vi5WNNrCIyNo3JA&q=" + message;
            }
        },
        mounted() {
            this.$root.$on("updateVisuals", (message) => {
                this.updateMap(message);
            });
        }
    }
</script>

<style scoped>

</style>