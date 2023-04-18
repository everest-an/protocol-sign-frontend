<template>
   <div>
       <topMenu></topMenu>
      <router-view />
    </div>
</template>

<script>

import topMenu from './components/topMenu.vue'
export default {
  name: 'App',
  components: {
    topMenu,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
body{
   background: url(./assets/bg.png) no-repeat center;
        background-size: 100% 100%;
        background-attachment: fixed;
}
</style>
