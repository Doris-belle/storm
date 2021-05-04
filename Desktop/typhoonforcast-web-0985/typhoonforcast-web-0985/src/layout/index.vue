<template>
  <el-container class="layout-container">
    <el-container>
      <el-header class="el-header navshadow" style="height:50px;background-color:#0c1a27;color:white;">
        <p style="float:left"><b>台风风暴潮智能预报系统</b></p>
        <!-- <i :class="{'el-icon-s-unfold':isCollapse,'el-icon-s-fold':!isCollapse}" style="float:left;padding-top:15px;cursor:pointer" @click="changeCollapse" /> -->
        <i class="el-icon-bell">{{'当前西北太平洋无活动台风'}}</i>
        <!-- <i class="el-icon-message-solid"></i> -->
        <el-dropdown trigger="click" style="float:right;">
          <span style="display:flex;align-items:center;">
            <img :src="getAvatarUrl" width="35px" height="35px" style="border-radius:20px;margin-right:15px;cursor:pointer" />
            <span style="font-weight:400;color:#8b9baf;cursor:pointer">{{getAccount}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip effect="dark" :content="fullscreen ? `取消全屏`:`全屏`" placement="bottom" style="float:right;font-size:25px;margin-right:20px;margin-top:14px;cursor:pointer">
          <i class="el-icon-full-screen" @click="handleFullScreen" />
        </el-tooltip>
      </el-header>
      <div style="position:relative;">
        <div style="position:absolute;left:0;z-index:3">
          <el-aside width="80px" class="el-aside" style="height:2000px;box-shadow: 2px 0px 2px #eee;">
            <Aside :is-collapse="isCollapse" style="overflow:hidden" />
          </el-aside>
        </div>
        <div>
          <div class="" style="width:100%;position:absolute;">
            <router-view />
          </div>
        </div>
      </div>
    </el-container>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex'
import Aside from './components/SideBar/index'
import breadcrumb from './components/BreadCrumb/index'
export default {
  name: 'layout',
  components: {
    Aside,
    breadcrumb
  },
  data () {
    return {
      avatarUrl: '',
      isCollapse: false,
      fullscreen: false
    }
  },
  created () {
  },
  methods: {
    changeCollapse () {
      this.isCollapse = !this.isCollapse
      // console.log(this.isCollapse)
    },
    logout () {
      // this.$store.commit('insertCurrentPage', 'main')
      // this.$store.commit('insertLoginState', '')
      // this.$store.commit('insertRole', '')
      sessionStorage.clear()
      this.$router.push('/login')
      window.location.reload() // 刷新vuex
    },
    handleFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }
  },
  computed: {
    ...mapGetters(['getAccount', 'getAvatar']),
    getAvatarUrl () {
      return this.getAvatar
    }
    // First (studentRouterMapping) {
    //   var F = this.studentRouterMapping.Fname
    //   // console.log(this.studentRouterMapping)
    //   return F
    // },
    // Second (studentRouterMapping) {
    //   var S = this.studentRouterMapping.Sname
    //   return S
    // },
    // Third (studentRouterMapping) {
    //   var T = this.studentRouterMapping.Tname
    //   return T
    // }
    // username () {
    //   const loginState = JSON.parse(sessionStorage.getItem('loginState'))
    //   return loginState.account
    // }
  }
}
</script>
<style scoped>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.el-container {
  height: 100%;
  width: 100%;
}

.el-header {
    background-color: #f7f7f7;
    color: #333;
    text-align: center;
    /* height: 50px; */
    line-height: 50px;
    /* border: 1px solid red; */
    /* box-shadow:0 3px 4px rgba(0, 21, 41, 0.08); */
    z-index: 20;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    /* text-align: center; */
    line-height: 200px;
}
</style>
