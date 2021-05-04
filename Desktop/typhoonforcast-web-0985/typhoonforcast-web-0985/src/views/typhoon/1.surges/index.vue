<template>
  <div class="" style="position: relative; height: 2000px">
    <el-button
      type="round"
      @click="dialog = true"
      style="position: absolute; top: 0; left: 83px; z-index: 2"
    ></el-button>
    <el-drawer
      :visible.sync="dialog"
      direction="ltr"
      custom-class="demo-drawer"
      ref="drawer"
      :modal-append-to-body="false"
      style="position: absolute"
      z-index="3"
      :modal="false"
      size="20%"
    >
      <div style="padding: 10px">
        <div>站点预报</div>
        <div id="pointList" style="padding: 10px">
          <el-radio
            v-for="city in radioCities"
            :key="city"
            v-model="radioValue"
            :label="city"
            style="width: 100%; margin-right: 0"
            @change="valueChange"
          ></el-radio
          ><br />
        </div>
      </div>
    </el-drawer>
    <Surges ref="surges" />
  </div>
</template>

<script>
import Surges from '@/components/surges/index'

export default {
  name: '',
  components: {
    Surges
  },
  props: [],
  data () {
    return {
      table: false,
      dialog: false,
      loading: false,
      radioValue: '',
      originCityPoints: [
        {
          city: '上海',
          points: [
            [121, 31],
            [121, 30],
            [121, 32]
          ]
        },
        {
          city: '连云港',
          points: [
            [119, 34],
            [120, 32],
            [119, 35]
          ]
        }
      ],
      radioCities: []
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.originCityPoints.forEach((currentValue) => {
      this.radioCities.push(currentValue.city)
    })
  },
  methods: {
    valueChange () {
      for (const city of this.originCityPoints) {
        if (city.city == this.radioValue) {
          this.$refs.surges.addPoint(city.points)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tableTitle {
  font-size: 20px;
  color: #6b655f;
  padding-left: 20px;
  padding-bottom: 10px;
}
label.el-radio {
  font-size: 20px;
}
.demo-drawer {
  width: 20%;
}
.el-checkbox {
  padding: 5px;
}
/deep/ .el-drawer__header {
  margin-bottom: 0;
}
/deep/ .el-divider--horizontal {
  margin-bottom: 10px;
}
</style>
