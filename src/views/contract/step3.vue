<template>
    <div class="contract-wrap">
        <Step :currentStep="3"></Step>
        <pdf-canvas ref="pdfcanvas" :show-menu="true"></pdf-canvas>
        <!-- <div id="word"></div> -->
        <div class="foot"><span @click="handlerBack">Back</span><span class="black" @click="handlerNext">Next</span></div>
    </div>
</template>
<script>
import Step from '@/components/step.vue'
import PdfCanvas from '@/components/pdf.vue'
import { baseURL } from '@/http';
import { renderAsync } from "docx-preview";

export default {
    name: "Manage",
    components: { Step, PdfCanvas },
    data() {
        return {

        }
    },
    mounted() {
        this.$refs.pdfcanvas.loadFile()

        // renderAsync(this.$store.state.pdfFile, document.getElementById("word"), null,
        //     {
        //         className: "docx", // 默认和文档样式类的类名/前缀
        //         inWrapper: true, // 启用围绕文档内容渲染包装器
        //         ignoreWidth: false, // 禁止页面渲染宽度
        //         ignoreHeight: false, // 禁止页面渲染高度
        //         ignoreFonts: false, // 禁止字体渲染
        //         breakPages: true, // 在分页符上启用分页
        //         ignoreLastRenderedPageBreak: true,//禁用lastRenderedPageBreak元素的分页
        //         experimental: false, //启用实验性功能（制表符停止计算）
        //         trimXmlDeclaration: true, //如果为真，xml声明将在解析之前从xml文档中删除
        //         debug: false, // 启用额外的日志记录
        //     }
        // );
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