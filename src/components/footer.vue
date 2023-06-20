<template>
  <div class="foot">
    <img class="logo" src="../assets/circle.png">
    <div class="des">Managed by Protocol Sign Foundation</div>
    <div class="img-list">
      <img src="@/assets/footer/1.png" @click="gotopage(1)">
      <img src="@/assets/footer/2.png" @click="gotopage(2)">
      <img src="@/assets/footer/3.png" @click="gotopage(3)">
      <img src="@/assets/footer/4.png" @click="gotopage(4)">
      <img src="@/assets/footer/5.png" @click="gotopage(5)">
    </div>
    <div class="tips">
      © 2023 Protocol Sign Foundation. All rights reserved.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',

  data() {
    return {

    }
  },
  mounted() {

  },

  methods: {
    gotopage(index) {
      let url = '';
      switch (index) {
        case 1:
          url = 'https://twitter.com/dsign_cloud';
          break;
        case 2:
          url = 'https://discord.gg/AbmGXYjr3U';
          break;
        case 3:
          url = 'https://www.youtube.com/watch?v=o7lMkLcm_tU';
          break;
        case 4:
          url = 'https://medium.com/@an_15429/dsign-decentralized-signature-291afa7acc27';
          break;
        case 5:
          url = 'https://everest-research.gitbook.io/untitled/dsign/dsign-light-paper';
          break;
      }
      window.open(url)
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.foot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.img-list {
  display: flex;
  justify-content: center;

  img {
    width: 25px;
    height: auto;
    object-fit: contain;
    margin-right: 5px;
    cursor: pointer;
  }
}

.tips {
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.des {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.logo {
  width: 50px;
  object-fit: cover;
  height: auto;
  margin-bottom: 20px;
}</style>
