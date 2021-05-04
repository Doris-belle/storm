<template>
  <div id="map"></div>
</template>

<script>
import Map from "@/utils/map";

export default {
  name: "surges",
  props: {},
  data: function () {
    return {
      map: {},
      pointArr: [],
    };
  },
  mounted() {
    this.map = new Map("map", "b5879d84c6818cf4fa1c37d2dab6cc47");
  },
  methods: {
    addPoint(arr) {
      this.map.clear();
      this.pointArr = [];
      arr.forEach((currentValue) => {
        let point = this.map.addPoint(currentValue, this.map);
        this.pointArr.push(point);
      });
    },
  },
};
</script>

<style>
</style>