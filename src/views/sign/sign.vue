<template>
    <div class="home-wrap">
        <div class="content">
            <!-- <p class="txt">Sign Page</p> -->
            <pdf-canvas ref="pdfcanvas" :show-menu="false"></pdf-canvas>
        </div>
    </div>
</template>
<script>
import PdfCanvas from '@/components/pdf.vue'
export default {
    name: "Home",
    components: {PdfCanvas},
    data() {
        return{
            currentType:'',
        }
    },
    methods:{
        handlerStart(){
            this.$router.push({
                name:'Step1'
            })
        },
        gotoPage(id){
            this.$router.push({ name: 'Sign' })
        }
    },
}
</script>
<style lang="scss" scoped>
.home-wrap{
    display: flex;
    justify-content: center;
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
            cursor: pointer;
        }
    }
}
</style>
