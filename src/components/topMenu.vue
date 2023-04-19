<template>
    <div class="top-bar">
      <img class="logo" src="../assets/logo.png">
      <div class="menus">
        <div v-if="menuList.indexOf(currentName)>-1">
          <span v-for="(item,idx) in menuList" :key="idx" @click="handlerMenu(item)" :class="{'selected':currentName==item}">{{item}}</span>
        </div>
      </div>
      <div class="login-part"><img src="../assets/ico-login.png"><span>Login</span></div>
    </div>
</template>

<script>
export default {
  name: 'TopMenu',
  props: {
    msg: String
  },
  data(){
    return{
      menuList:['Home','Manage','Authentication'],
      currentName:'Home',
    }
  },
  mounted(){
    console.log(this.$route)
  },
  watch:{
    '$route'(val){
      this.currentName=val.name;
      console.log(val)
    }
  },
  methods:{
    handlerMenu(val){
      this.$router.push({name:val})
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.top-bar{
  display: flex;
  align-items: center;
  // justify-content: space-between;
  border-bottom: 2px solid #efefef;
  .logo{
    display: block;
    width:157px;
    margin: 0 50px 0 0;
  }
  .menus{
    flex:1;
    text-align: left;
    span{
      display: inline-block;
      margin:0 64px 0 0;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 65px;
    }
    .selected{
      border-bottom: 3px solid #000;
    }
  }
  .login-part{
    padding:0 16px;
    height: 32px;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.65);
    display: flex;
    align-items: center;
    margin-right: 20px;
    img{
      display: block;
      width: 18px;
      margin:0 6px 0 0;
    }
    span{
      display: block;
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 24px;
    }
  }
}
</style>
