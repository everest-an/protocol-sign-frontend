<template>
<div class="contract-wrap">
    <Step :currentStep="1"></Step>
     <div class="content">
        <img class="img" src="../../assets/ico-add.png">
        <p class="txt">drop  documents here to get started</p>
        <button class="bt-start" @click="handlerStart">Start Now</button>
    </div>
</div>
</template>
<script>
import Step from '@/components/step.vue'
export default {
    name: "Manage",
    components: {Step},
    data() {
        return{
            currentType:'',
        }
    },
    methods:{
        handlerStart(){
            this.$router.push({
                name:'Step2'
            })
        },
    },
}
</script>
<style scope lang="scss">
.contract-wrap{
    padding:40px 24px;
    .content{
        width: 100%;
        margin: 150px 0 0;
        
        // border: 1px solid #D5D5D5;
        .img{
            display: block;
            width: 48px;
            height: 48px;
            margin: 0 auto;
        }
        .txt{
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 17px;
            margin: 12px 0;
            display: block;
        }
        .bt-start{
            width: 102px;
            height: 24px;
            border-radius: 16px;
            border: 1px solid #000000;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 20px;
            display: block;
            margin: 0 auto;
        }
    }
}

</style>