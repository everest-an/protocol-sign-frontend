<template>
  <div class="top-bar" :style="'opacity:' + opacity">
    <div class="left">
      <img class="logo-img" src="../assets/logo.png">
      <!-- <img class="logo" src="../assets/circle.png">
      <div class="txt">
        <div class="logo-title">Protocol Sign</div>
        <div class="logo-des">Decentralized Signature</div>
      </div> -->
    </div>
    <div class="login-part" @click="goHome"><img src="../assets/ico-login.png"><span>{{ logMsg }}</span></div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    opacity: String
  },
  data() {
    return {
      logMsg: 'Login',
      token:''
    }
  },
  mounted() {
    let token = localStorage.getItem('token');
    this.token = token;
    if (token) {
      this.logMsg = "Home"
    } else {
      this.logMsg = "Protocol Sign"
    }
  },
  methods: {
    goHome() {
      if (this.token) {
        this.$router.push({ name: 'Home' })
      } else {
        this.$router.push({ name: 'Login' })
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.top-bar {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  height: 72px;

  .left {
    display: flex;
    align-items: center;
    margin-left: 20px;

    .txt {
      text-align: left;
      margin-left: 12px;

      .logo-title {
        font-size: 30px;
        font-weight: bold;
      }

      .logo-des {
        font-size: 12px;
      }
    }
  }

  .logo {
    display: block;
    width: 62px;
    height: auto;
    object-fit: cover;
  }
  .logo-img{
    width: 160px;
  }



  .login-part {
    padding: 0 16px;
    height: 32px;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;

    img {
      display: block;
      width: 18px;
      margin: 0 6px 0 0;
    }

    span {
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
