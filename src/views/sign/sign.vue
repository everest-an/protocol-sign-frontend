<template>
    <div class="home-wrap">
        <div class="content" id="ddd">
            <!-- <p class="txt">Sign Page</p> -->
            <pdf-canvas ref="pdfcanvas" :show-menu="false" :place-mark="placeMark"></pdf-canvas>
            <div class="finish" @click="finishHandle()">Finish</div>
        </div>
    </div>
</template>
<script>
import PdfCanvas from '@/components/pdf.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import FileSaver from 'file-saver'
// import {} from 'http'
let pageList = []
export default {
    name: "Home",
    components: { PdfCanvas },
    data() {
        return {
            currentType: '',
            placeMark: [],
            fileCode: '',
            pageList: []
        }
    },
    mounted() {
        this.fileCode = this.$route.query.fileCode;
        this.$refs.pdfcanvas.loadFile(this.fileCode);
        this.placeMark = JSON.parse(sessionStorage.getItem('placeMark'));
        console.log('placeMark====', this.placeMark);

    },
    methods: {
        handlerStart() {
            this.$router.push({
                name: 'Step1'
            })
        },
        gotoPage(id) {
            this.$router.push({ name: 'Sign' })
        },
        async buildPDF2() {
            const pdf = new jsPDF(
                {
                    orientation: 'landscape', // 纵向，或使用 'landscape' 横向
                    unit: 'pt',
                    format: [768, 432], // 页面格式，可以是 'a4'、'letter' 等
                    compress: true // 是否压缩 PDF
                }
            );
            let elements = document.getElementsByClassName('page-container');
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                await html2canvas(element, { scale: 2 }).then(canvasImg => {
                    const screenshotUrl = canvasImg.toDataURL('image/png');
                    console.log('canvasImg', canvasImg.width)
                    console.log('canvasImg', canvasImg.height)
                    pdf.addImage(screenshotUrl, "PNG", 0, 0, 768, 432);
                    if (i + 1 < elements.length) {
                        pdf.addPage();
                    }
                })
            }
            // pdf.save("merged_pdf.pdf");
            // return
            const pdfData = pdf.output('arraybuffer');
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            console.log('blob====', blob)
            FileSaver.saveAs(blob, 'converted11.pdf');
            // 增加 jspdf 的输出质量：在生成 PDF 文件之前，尝试设置 jspdf 的输出质量参数。你可以将 jspdf 实例的 setFontSize、setTextColor 和 setProperties 等方法
            return
            // 发送POST请求
            // 创建FormData对象并将Blob添加到其中
            const formData = new FormData();
            formData.append('file', blob, 'converted.pdf');
            formData.append('fileCode', this.fileCode);
            this.$axios.post('/web/contract/addContractByUser', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                this.$router.push({
                    name: 'Manage'
                })
            }).catch(function (error) {
                console.log(error);
            });
            return pdfData
        },
        //生成PDF并上传
        finishHandle() {
            this.buildPDF2()
        }
    },
}
</script>
<style lang="scss" scoped>
.home-wrap {
    display: flex;
    justify-content: center;
    position: relative;

    .content {
        width: 100%;

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

.finish {
    position: fixed;
    right: 210px;
    bottom: 20px;
    background: #000000;
    font-size: 14px;
    color: #FFFFFF;

    width: 102px;
    height: 32px;
    line-height: 32px;
    border-radius: 16px;
    cursor: pointer;
}
</style>
