<template>
  <div class="index">
    <div class="left"></div>
    <div class="center">
      <router-view/>
    </div>
    <div class="right"></div>
    
    <!-- <div class="container">
      <div class="container-header">
        <div class="flex-row-center">
          <Hamburger :is-active="sidebar.opened" @toggleClick="toggleSideBar" />
         
        </div>
        <div class="flex-row-center">
          <Screenfull id="screenfull" class="right-menu-item hover-effect" />
          <div class="logout" @click="logout">退出</div>
        </div>
      </div>
      <div class="container-info">
        
      </div>
    </div> -->
  </div>
</template>

<script>

// import Hamburger from '@/components/Hamburger/index.vue'
// import Screenfull from '@/components/Screenfull/index.vue'

export default {
  name: "Index",
  components: {
    // Hamburger,
    // Screenfull
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$router.replace({
        name: 'Login'
      })
      localStorage.setItem('token', '')
    }
  },
  computed: {
    // ...mapGetters([
    //   'sidebar',
    // ]),
   
  }
}
</script>

<style lang="scss" scoped>
.flex-row-center {
  display: flex;
  align-items: center;
}
.index {
  display: flex;
  // width: 980px;
  margin: 32px auto 0;
  min-height: 100vh;
  overflow: hidden;
  
  // background-color: #FFFFFF;
  .left{
    width: 207px;
  }
  .center{
    flex: 1;
    background-color: #fff;
  }
  .right{
    width: 207px;
  }
}

.container {
  flex: 1;
  width: calc(100vw - 200px);
  height: 100vh;
}

.container-header {
  background-color: #fff;
  height: 72px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(146, 146, 146, 0.4);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(146, 146, 146, 0.4);
}

.logout {
  font-size: 14px;
  cursor: pointer;
  padding-right: 8px;
}

.container-info {
  border-radius: 4px;
  margin: 4px;
  background-color: #fff;
  overflow-y: scroll;
  /*width: calc(100vw - 204px);*/
  /*width: 100%;*/
  height: calc(100vh - 88px);
}

.container-info::-webkit-scrollbar {
  display: none;
}

.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;

&.hover-effect {
   cursor: pointer;
   transition: background .3s;

&:hover {
   background: rgba(0, 0, 0, .025)
 }
}
}
</style>
