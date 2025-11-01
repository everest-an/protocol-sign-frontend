<template>
    <div class="contract-wrap">
        <Step :currentStep="3"></Step>
        <pdf-canvas ref="pdfcanvas" :show-menu="true"></pdf-canvas>
        <div class="foot"><span @click="handlerBack">Back</span><span class="black" @click="handlerNext">Next</span></div>
    </div>
</template>
<script>
import Step from '@/components/step.vue'
import PdfCanvas from '@/components/pdf.vue'
import { baseURL } from '@/http';

export default {
    name: "Manage",
    components: { Step, PdfCanvas },
    data() {
        return {

        }
    },
    mounted() {
        this.$refs.pdfcanvas.loadFile()
    },
    methods: {
        handlerNext() {
            this.$refs['pdfcanvas'].saveRectangles();
            this.$router.push({
                name: 'Step4'
            })
        },
        handlerBack() {
            this.$router.push({
                name: 'Step2'
            })
        },
    },
}
</script>
<style scoped lang="scss">
.contract-wrap {
    padding: 40px 24px;
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100vw - 280px);
    // height: calc(100vh - 100px);
}

.foot {
    display: flex;
    justify-content: flex-end;

    span {
        display: block;
        width: 102px;
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
        border: 1px solid #000000;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        margin: 0 10px 0 0;
        cursor: pointer;
    }

    .black {
        background: #000000;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
    }
}
</style>