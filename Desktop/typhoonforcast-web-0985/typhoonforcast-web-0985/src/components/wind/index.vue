<template>
  <div>
    <div id="map"></div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
/* eslint-disable */

// import "../../dist/wind-gl.js";
import WindGL from "@/utils/index.js";

export default {
  name: "wind",
  mounted() {
    let that = this;

    // 高德地图
    var map = new AMap.Map("map", {
      zoom: 5,
      zooms: [5, 8],
      center: [126.397428, 29.90923], //中心点坐标
      mapStyle: "amap://styles/dbedf07b463df58b9e6f966ec36b90d8", //设置地图的显示样式
    });
    // using var to work around a WebKit bug
    var canvas = document.getElementById("canvas");

    // map.on("zoomend", mapZoomend);

    // function mapZoomend() {
    //   console.log("缩放完成");
    //   console.log(map.Ce.zoom);
    //   updateRetina(map.Ce.zoom);
    // }

    // devicePixelRatio: 返回当前显示设备的物理像素分辨率与 CSS 像素分辨率的比率
    const pxRatio = Math.max(Math.floor(window.devicePixelRatio) || 1, 2);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // console.log(
    //   `canvas.height is ${canvas.height}, canvas.width is ${canvas.width}`
    // );

    // antialiasing: 抗锯齿处理
    const gl = canvas.getContext("webgl", { antialias: true });

    const wind = (window.wind = new WindGL(gl));
    // numParticles: 粒子数量
    wind.numParticles = 12800;

    function frame() {
      if (wind.windData) {
        wind.draw();
      }
      // requestAnimationFrame: 准备在屏幕上更新动画
      requestAnimationFrame(frame);
    }
    frame();

    // dat.gui: 一个GUI控制组件
    // const gui = new dat.GUI();
    // gui.add(wind, "numParticles", 1024, 589824);
    // gui.add(wind, "fadeOpacity", 0.96, 0.999).step(0.001).updateDisplay();
    // gui.add(wind, "speedFactor", 0.05, 1.0);
    // gui.add(wind, "dropRate", 0, 0.1);
    // gui.add(wind, "dropRateBump", 0, 0.2);

    const windFiles = {
      0: "2016112000",
      6: "2016112006",
      12: "2016112012",
      18: "2016112018",
      24: "2016112100",
      30: "2016112106",
      36: "2016112112",
      42: "2016112118",
      48: "2016112200",
    };

    // const meta = {
    //   "2016-11-20+h": 0,
    //   "retina resolution": true,
    //   "github.com/mapbox/webgl-wind": function () {
    //     window.location = "https://github.com/mapbox/webgl-wind";
    //   },
    // };
    // // gui.add(meta, '2016-11-20+h', 0, 48, 6).onFinishChange(updateWind);
    // if (pxRatio !== 1) {
    //   gui.add(meta, "retina resolution").onFinishChange(updateRetina);
    // }

    // function updateWind(name) {
    //   getJSON("../wind/" + windFiles[name] + ".json", function (windData) {
    //     const windImage = new Image();
    //     windData.image = windImage;
    //     windImage.src = "../wind/" + windFiles[name] + ".png";
    //     windImage.onload = function () {
    //       wind.setWind(windData);
    //     };
    //   });
    // }

    function updateWind(name) {
      getJSON("../../../static/wind/xxsb.json", function (windData) {
        const windImage = new Image();
        windData.image = windImage;
        windImage.src = "../../../static/wind/xxsb.png";
        windImage.onload = function () {
          wind.setWind(windData);
        };
      });
    }

    // AMap增加图层
    let CanvasLayer = new AMap.CanvasLayer({
      canvas: canvas,
      bounds: new AMap.Bounds([-180.0, -90.0], [180.0, 90.0]),
    });

    CanvasLayer.setMap(map);

    // 绘制风场
    // 重要代码！！！
    updateWind(0);
    updateRetina(2);

    function updateRetina(zoom) {
      // const ratio = meta["retina resolution"] ? pxRatio : 1;
      // console.log(zoom);
      const ratio = zoom;
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      // console.log(
      //   `canvas.height is ${canvas.height}, canvas.width is ${canvas.width}`
      // );
      wind.resize();
    }

    function getJSON(url, callback) {
      that.axios.get(url).then((response) => {
        callback(response.data);
      });
    }
  },
};
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100vw;
}
#canvas {
  display: block;
  width: 100vw;
  height: 100vh;
  position: absolute;
}
.dg .function .property-name {
  width: 100%;
}
</style>
