<template>
  <div class="" style="position: relative; height: 2000px">
    <el-button type="text" @click="dialog = true"
      >打开嵌套 Form 的 Drawer</el-button
    >
    <el-drawer
      :visible.sync="dialog"
      direction="ltr"
      custom-class="demo-drawer"
      ref="drawer"
      :modal-append-to-body="false"
      style="position: absolute"
      z-index="3"
      :modal="false"
    >
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="活动名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            @click="$refs.drawer.closeDrawer()"
            :loading="loading"
            >{{ loading ? "提交中 ..." : "确 定" }}</el-button
          >
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: [],
  data() {
    return {
      table: false,
      dialog: false,
      loading: false,
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "80px",
      timer: null,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
