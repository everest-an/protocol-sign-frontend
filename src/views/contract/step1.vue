<template>
    <div class="contract-wrap">
        <Step :currentStep="1"></Step>
        <div class="content">
            <img class="img" src="../../assets/ico-add.png">
            <p class="txt">Drop documents here to get started</p>
            <button class="bt-start" @click="handlerStart">Start Now</button>
            <input type="file" ref="fileInput" style="display:none" @change="handleFileInputChange" accept='.pdf,.docx'>
        </div>
    </div>
</template>
<script>
import Step from '@/components/step.vue'
export default {
    name: "Manage",
    components: { Step },
    data() {
        return {
            currentType: '',
        }
    },
    methods: {
        handlerStart() {
            // this.$router.push({
            //     name:'Step2'
            // })
            this.$refs.fileInput.click();
        },
        // 处理选择的文件
        handleFileInputChange(event) {
            const file = event.target.files[0];
            console.log(file);
            this.$store.commit('SET_PDF', file)
            this.$router.push({
                name: 'Step2'
            })
            // this.$store.dispatch('setPdf','abc')
        }
    },
}
</script>
<style scoped lang="scss">
.contract-wrap {
    padding: 40px 24px;

    .content {
        width: 100%;
        margin: 150px 0 0;
        text-align: center;

        // border: 1px solid #D5D5D5;
        .img {
            display: block;
            width: 48px;
            height: 48px;
            margin: 0 auto;
        }

        .txt {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 17px;
            margin: 12px 0;
            display: block;
        }

        .bt-start {
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