<template>
   <div class="step-wrap">
        <div :class="[currentStep==1?'step step1 selected':'step step1']">
            <span class="num">{{1<currentStep?'√':'1'}}</span><span class="txt">Add documents</span>
        </div>
        <div :class="[currentStep==2?'step step2 selected':'step step2']">
            <span class="num">{{2<currentStep?'√':'2'}}</span><span class="txt">Add recipients</span>
        </div>
        <div :class="[currentStep==3?'step step3 selected':'step step3']">
            <span class="num">{{3<currentStep?'√':'3'}}</span><span class="txt"> Prepare documents</span>
        </div>
        <div :class="[currentStep==4?'step step4 selected':'step step4']">
            <span class="num">{{4<currentStep?'√':'4'}}</span><span class="txt"> Authentication and payments</span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Step',
  props: {
    currentStep: Number,
  },
  data(){
    return{
     
     
    }
  },
  mounted(){
    console.log(this.$route)
  },
  watch:{
    '$route'(val){
      // this.currentName=val.name;
      // console.log(val)
    },
    "currentStep"(val){
      console.log(val)
    },
  },
  methods:{
    // handlerMenu(val){
    //   this.$router.push({name:val})
    // },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.step-wrap{
    display: flex;
    margin-bottom: 20px;
    // justify-content: space-between;
    .step{
        flex:1;
        position:relative;
       
        .num{
            width: 26px;
            height: 26px;
            line-height: 26px;
            border: 1px solid #BFBFBF;
            border-radius: 100%;
            display: block;
            color: #8C8C8C;
            margin: 0 auto;
            background-color: #fff;
            position: relative;
             z-index: 2;
        }
        // .num::after{
        //     width: 100%;
        //     display: inline-block;
        //     content: ' ';
        //     border-bottom: 1px solid #ddd;
        // }
        
        .txt{
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #8C8C8C;
            display: block;
        }
    }
    .selected .num{
        background: #3862CF;
        border: 1px solid #3862CF;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        
    }
    .step::after{
        position: absolute;
        top:12px;
        left: 0;
        display: inline-block;
        width: 100%;
        content: ' ';
        border-bottom: 1px solid #ddd;
        z-index:1;
    }
    .step4::after{
        width: 50%;
    }
    .step1::after{
        left:50%;
        width: 50%;
    }
}
</style>
