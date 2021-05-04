<template>
  <div class="">
    <input type="checkbox" id="inputBox" style="border: 3px solid red;">
    <span>111</span>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: [],
  data () {
    return {
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
#inputBox{
  background: #000;
}
input[type="checkbox"]{
  visibility: hidden;
}
</style>
