<template>
  <div>
    <div class="img-list">
      <img src="@/assets/footer/1.png">
      <img src="@/assets/footer/2.png">
      <img src="@/assets/footer/3.png">
      <img src="@/assets/footer/4.png">
      <img src="@/assets/footer/5.png">
    </div>
    <div class="tips">
      © 2023 Dsign Foundation. All rights reserved.
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

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.img-list {
  display: flex;
  justify-content: center;

  img {
    width: 25px;
    height: auto;
    object-fit: contain;
    margin-right: 5px;
  }
}
.tips{
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
