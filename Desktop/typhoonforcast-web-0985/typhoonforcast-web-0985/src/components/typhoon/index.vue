<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import Map from "@/utils/map.js";

export default {
  name: "typhoon",
  props: {
    typhoonData: {
      type: Array,
      required: true,
    },
    typhoonForecastData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      map: {},
      rulerCase: {},
      alarm_24: [
        [127, 34],
        [127, 22],
        [120, 18],
        [120, 11],
        [113, 4.5],
        [105, 0],
      ],
      alarm_48: [
        [132, 34],
        [132, 15],
        [120, 0],
        [105, 0],
      ],
    };
  },
  mounted() {
    this.map = new Map("map", "784442f44707064e95811e718713b5c9");
    this.drawAlarm();
  },
  watch: {
    typhoonData() {
      this.drawObservation();
      this.drawForecast();
      this.drawAlarm();
    },
  },
  methods: {
    drawObservation() {
      this.map.clear();

      let infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
      });

      this.typhoonData.forEach((typhoonRow) => {
        typhoonRow.data.forEach((currentValue) => {
          let point = this.map.addPoint(
            currentValue.position,
            currentValue.speed
          );

          point.on("click", (e) => {
            this.map.addTyphoonArea(e.lnglat, 50, 100, 150, 200);
            this.map.panBy();
          });

          point.on("mouseover", (e) => {
            infoWindow.setContent(
              `<div style="background-color: rgba(255, 255, 255, 0.9); border-radius: 8px; padding: 16px; line-height: 24px">
              <p>${typhoonRow.no + " " + typhoonRow.name}</p>
              <p>${
                currentValue.date.slice(4, 6) +
                "月" +
                currentValue.date.slice(6) +
                "日" +
                currentValue.time.slice(0, 2) +
                "时"
              }</p>
              <p>中心位置：${currentValue.position[1]}N/${
                currentValue.position[0]
              }E</p>
              <p>最大风速：${currentValue.maxSpeed}米/秒</p>
              <p>中心气压：${currentValue.MinAPinCenter}百帕</p>
              <p>移动方向：${currentValue.direction}</p>
              <p>移动速度：${currentValue.speed}公里/小时</p>
            </div>`
            );
            infoWindow.open(this.map.map, e.lnglat);
          });

          point.on("mouseout", () => {
            infoWindow.close();
          });
        });

        // 绘制轨迹
        let mid = typhoonRow.data;
        for (let i = 1; i < mid.length; i++) {
          const start = mid[i - 1].position;
          const stop = mid[i].position;
          let path = [start, stop];

          this.map.drawLine(path, mid[i].speed);
        }
      });
    },
    drawForecast() {
      let infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
      });

      this.typhoonForecastData.forEach((typhoonForecastRow) => {
        typhoonForecastRow.data.forEach((currentValue) => {
          let point = this.map.addPoint(
            currentValue.position,
            currentValue.maxSpeed
          );

          point.on("click", (e) => {
            this.map.addTyphoonArea(e.lnglat, 50, 100, 150, 200);
            this.map.panBy();
          });

          point.on("mouseover", (e) => {
            infoWindow.setContent(
              `<div style="background-color: rgba(255, 255, 255, 0.9); border-radius: 8px; padding: 16px; line-height: 24px">
              <p>${typhoonForecastRow.no + " " + typhoonForecastRow.name}</p>
              <p>中心位置：${currentValue.position[1]}N/${
                currentValue.position[0]
              }E</p>
              <p>最大风速：${currentValue.maxSpeed}米/秒</p>
              <p>中心气压：${currentValue.MinAPinCenter}百帕</p>
            </div>`
            );
            infoWindow.open(this.map.map, e.lnglat);
          });

          point.on("mouseout", () => {
            infoWindow.close();
          });
        });

        let mid = typhoonForecastRow.data;
        for (let i = 1; i < mid.length; i++) {
          const start = mid[i - 1].position;
          const stop = mid[i].position;
          let path = [start, stop];

          this.map.drawLine(path, mid[i].maxSpeed, undefined, 1);
        }
      });
    },
    drawAlarm() {
      for (let i = 1; i < this.alarm_24.length; i++) {
        let path = [this.alarm_24[i - 1], this.alarm_24[i]];
        this.map.drawLine(path, 0, "yellow");
      }
      this.map.addText("24小时警戒线", [127, 34], "orange");

      for (let i = 1; i < this.alarm_48.length; i++) {
        let path = [this.alarm_48[i - 1], this.alarm_48[i]];
        this.map.drawLine(path, 0, "yellow", 1);
      }
      this.map.addText("48小时警戒线", [132, 34], "#7FFF00");
    },

    zoomReset() {
      this.map.zoomReset();
    },
    zoomIn() {
      this.map.zoomIn();
    },
    zoomOut() {
      this.map.zoomOut();
    },
    rulerOn() {
      this.map.rulerOn();
    },
    rulerOff() {
      this.map.rulerOff();
    },
    positioning() {
      this.map.positioning();
    },
  },
};
</script>

<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>