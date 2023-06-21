<template>
  <div class="top-bar" v-if="showBar">
    <img class="logo" src="../assets/logo.png">
    <div class="menus">
      <div v-if="menuList.indexOf(currentName) > -1">
        <span v-for="(item, idx) in menuLists" :key="idx" @click="handlerMenu(item)"
          :class="{ 'selected': currentName == item }">{{ item }}</span>
      </div>
    </div>
    <div class="login-part" @click="logout"><img src="../assets/ico-login.png"><span>{{ logMsg }}</span></div>
  </div>
</template>

<script>
export default {
  name: 'TopMenu',
  props: {
    msg: String
  },
  data() {
    return {
      menuList: ['Home', 'Manage', 'Authentication', 'Step1', 'Step2', 'Step3', 'Step4'],
      menuLists: ['Home', 'Manage', 'Authentication'],
      currentName: 'Home',
      logMsg: 'Login',
      showBar: false
    }
  },
  mounted() {
    // console.log('gg==', this.$route);

  },
  watch: {
    '$route'(val) {
      this.currentName = val.name;
      console.log('=======', val)
      if (val.name == 'Introduce' || val.name == 'Step3') {
        this.showBar = false
      }else{
        this.showBar = true
      }
      if (val.path == '/login') {
        this.logMsg = "Login"
      } else {
        let token = localStorage.getItem('token');
        if (token) {
          this.logMsg = "Logout"
        }
      }
    },
  },
  methods: {
    handlerMenu(val) {
      this.$router.push({ name: val })
    },
    logout() {
      this.logMsg = "Login"
      localStorage.clear();
      this.$router.push({ name: 'Login' })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.top-bar {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  border-bottom: 2px solid #efefef;

  .logo {
    display: block;
    width: 157px;
    margin: 0 50px 0 0;
  }

  .menus {
    flex: 1;
    text-align: left;

    span {
      display: inline-block;
      margin: 0 64px 0 0;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 65px;
      cursor: pointer;
    }

    .selected {
      border-bottom: 3px solid #000;
    }
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
