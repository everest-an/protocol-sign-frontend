<template>
    <div class="contract-wrap">
        <Step :currentStep="1"></Step>
        <div class="content">
            <img class="img" src="../../assets/ico-add.png">
            <p class="txt">Drop documents here to get start</p>
            <button class="bt-start" @click="handlerStart">Start Now</button>
            <input type="file" ref="fileInput" style="display:none" @change="handleFileInputChange" accept='.pdf,.docx'>
        </div>
    </div>
</template>
<script>
import Step from '@/components/step.vue'
import html2pdf from 'html2pdf.js';
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
            let type = file.name.split('.');
            if (type[1] !== 'pdf') {
                //打开word
                // 创建用于读取文件的FileReader实例
                const reader = new FileReader();
                // 读取文件数据
                reader.readAsText(file);
                // 当文件加载完成时执行以下代码
                reader.onload = (event) => {
                    const fileData = event.target.result;
                    // 创建一个隐藏的<div>元素，用于将Word内容显示为HTML
                    const div = document.createElement('div');
                    div.innerHTML = fileData;
                    div.style.display = 'none';
                    // 将<div>元素添加到DOM中
                    document.body.appendChild(div);
                    // 将<div>元素转换为PDF文档流
                    html2pdf()
                        .from(div)
                        .outputPdf('datauristring')
                        .then((pdfDataUri) => {
                            // PDF文档流可用于进一步处理或显示
                            console.log('pdf============', pdfDataUri);
                            this.$store.commit('SET_WORD2PDF', pdfDataUri)
                        })
                        .finally(() => {
                            // 完成后删除<div>元素
                            document.body.removeChild(div);
                        });
                };
                
            } else {
                //打开PDF
                console.log('pdf===', file)
                this.$store.commit('SET_PDF', file)
            }
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