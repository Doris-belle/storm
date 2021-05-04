class Map {
  constructor(container, styleId) {
    this.map = new AMap.Map(container, {
      zoom: 5,
      zooms: [5, 7],
      center: [132.881113, -1.257119],
      mapStyle: `amap://styles/${styleId}`,
      resizeEnable: true
    });
    this.map.plugin(["AMap.RangingTool"], () => {
      this.rulerCase = new AMap.RangingTool(this.map);
    });
    this.map.plugin(['AMap.CustomLayer'], () => {
      this.northeastCanvas = this.createCanvas("northeast");
      this.southeastCanvas = this.createCanvas("southeast");
      this.southwestCanvas = this.createCanvas("southwest");
      this.northwestCanvas = this.createCanvas("northwest");

      this.northeast = this.createCustomLayer(this.northeastCanvas);
      this.southeast = this.createCustomLayer(this.southeastCanvas);
      this.southwest = this.createCustomLayer(this.southwestCanvas);
      this.northwest = this.createCustomLayer(this.northwestCanvas);
    });

  }

  createCanvas(decoration) {
    let canvas = document.createElement('canvas');
    let att = document.createAttribute("id");
    att.value = decoration;
    canvas.setAttributeNode(att);

    return canvas
  }

  createCustomLayer(canvas) {
    return new AMap.CustomLayer(canvas, {
      zooms: [5, 7],
      alwaysRender: true,  //缩放过程中是否重绘，复杂绘制建议设为false
      zIndex: 12,
      opacity: 0.24
    });
  }

  zoomIn() {
    this.map.setZoom(this.map.getZoom() + 1)
  }

  zoomOut() {
    this.map.setZoom(this.map.getZoom() - 1)
  }

  zoomReset() {
    this.map.setZoom(5)
  }

  positioning() {
    AMap.plugin('AMap.Geolocation', () => {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: false,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(0, 0),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true     //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      this.map.addControl(geolocation);
      geolocation.getCurrentPosition((status, result) => {
        if (status == 'complete') {
          console.log(result);
        } else {
          console.log(result);
        }
      });
    });
  }

  addPoint(center, speed) {
    let color = speed >= 51 ? 'red' : speed >= 50.9 ? 'purple' : speed >= 41.4 ? 'orange' : speed >= 32.6 ? 'green' : speed >= 24.4 ? 'blue' : 'yellow'

    let circleMarker = new AMap.CircleMarker({
      center: center,
      radius: 4,
      strokeColor: "white",
      strokeWeight: 2,
      strokeOpacity: 0.5,
      fillColor: color,
      fillOpacity: 0.5,
      zIndex: 10,
      bubble: false,
      cursor: "pointer",
      clickable: true,
    });

    circleMarker.setMap(this.map);

    return circleMarker;
  }

  drawLine(path, speed, specialColor, strokeStyle) {
    let color = speed >= 51 ? 'red' : speed >= 50.9 ? 'purple' : speed >= 41.4 ? 'orange' : speed >= 32.6 ? 'green' : speed >= 24.4 ? 'blue' : 'yellow'

    let polyline = new AMap.Polyline({
      path: path,
      borderWeight: 1,
      strokeStyle: strokeStyle == 1 ? "dashed" : "solid",
      strokeDasharray: [10, 5],
      strokeColor: specialColor == undefined ? color : specialColor,
      lineJoin: "round",
      lineCap: 'round',
    });

    this.map.add(polyline);
  }

  addText(content, position, color) {
    let text = new AMap.Text({
      text: content,
      anchor: 'center', // 设置文本标记锚点
      offset: new AMap.Pixel(0, 100),
      draggable: false, // 是否可拖拽
      cursor: 'pointer', //鼠标样式
      style: {
        'background-color': 'rgba(0, 0, 0, 0)', // 背景色
        'width': '16px', // 宽度
        'height': '180px', // 高度
        'border-width': 0,
        'text-align': 'center', // 文本位置
        'font-size': '16px', // 字体大小
        'color': color, // 字体颜色
        'writing-mode': 'vertical-lr', // 文字竖向排列
        'letter-spacing': '8px'
      },
      position: position
    });
    text.setMap(this.map);
  }

  rulerOn() {
    this.rulerCase.turnOn()
  }

  rulerOff() {
    this.rulerCase.turnOff()
  }

  addTyphoonArea(center, one, two, three, four) {
    this.drawCanvas(this.northeastCanvas, this.northeast, center, one, two, three, four)
    this.drawCanvas(this.southeastCanvas, this.southeast, center, one, two, three, four)
    this.drawCanvas(this.southwestCanvas, this.southwest, center, one, two, three, four)
    this.drawCanvas(this.northwestCanvas, this.northwest, center, one, two, three, four)
  }

  drawCanvas(canvas, customLayer, center, one, two, three, four) {
    let renderMethod = () => {
      let size = this.map.getSize();
      let width = size.width;
      let height = size.height;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.width = width;
      canvas.height = height; //清除画布
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgb(247, 181, 0)';
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 0.1;
      let pos = this.map.lngLatToContainer(center);
      // let pos2 = this.map.lngLatToContainer(center);
      ctx.beginPath();
      if (customLayer == this.northeast) {
        ctx.moveTo(pos.x, pos.y);
        ctx.arc(pos.x, pos.y, one, 0, Math.PI * 0.5);
      } else if (customLayer == this.southeast) {
        ctx.moveTo(pos.x, pos.y);
        ctx.arc(pos.x, pos.y, two, Math.PI * 0.5, Math.PI * 1.0);
      } else if (customLayer == this.southwest) {
        ctx.moveTo(pos.x, pos.y);
        ctx.arc(pos.x, pos.y, three, Math.PI * 1.0, Math.PI * 1.5);
      } else if (customLayer == this.northwest) {
        ctx.moveTo(pos.x, pos.y);
        ctx.arc(pos.x, pos.y, four, Math.PI * 1.5, Math.PI * 2.0);
      }
      ctx.lineTo(pos.x, pos.y);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
    customLayer.render = renderMethod;
    customLayer.setMap(this.map);
    customLayer.show();
  }

  panBy() {
    this.map.panBy(0.01, 0.01);
  }

  clear() {
    this.map.clearMap()
  }
}

export default Map
