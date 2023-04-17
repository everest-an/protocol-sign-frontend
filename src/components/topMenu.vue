<template>
    <div class="top-bar">
      <img class="logo" src="../assets/logo.png">
      <div class="login-part"><img src="../assets/ico-login.png"><span>Login</span></div>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.top-bar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo{
    display: block;
    width:157px;
  }
  .login-part{
    padding:0 16px;
    height: 32px;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.65);
    display: flex;
    align-items: center;
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
