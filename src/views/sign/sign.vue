<template>
    <div class="home-wrap">
        <div class="content" id="ddd">
            <!-- <p class="txt">Sign Page</p> -->
            <pdf-canvas ref="pdfcanvas" :show-menu="false" :place-mark="placeMark"
                @setPlaceMarkSign="setPlaceMarkSign"></pdf-canvas>
            <div class="finish" @click="finishHandle()">Finish</div>
        </div>
    </div>
</template>
<script>
import PdfCanvas from '@/components/pdf.vue'
import jsPDF from 'jspdf'
import FileSaver from 'file-saver';
import html2canvas from 'html2canvas'
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
        setPlaceMarkSign(placeSign) {
            pageList = placeSign
        },
        //生成PDF
        async buildPDF() {
            // 使用 reduce() 函数进行重新分组
            let arr = pageList.reduce((result, item) => {
                // 获取对象的 index 值
                const index = item.index;

                // index category 对应的数组
                if (result[index]) {
                    // 如果存在，将当前对象添加到对应的数组中
                    result[index].push(item);
                } else {
                    // 如果不存在，创建一个新的数组，并将当前对象添加进去
                    result[index] = [item];
                }

                return result;
            }, []);
            console.log('pageList====', JSON.parse(JSON.stringify(arr)))
            const pdf = new jsPDF(
                {
                    orientation: 'landscape', // 纵向，或使用 'landscape' 横向
                    unit: 'pt', // 单位为毫米
                    format: 'a4', // 页面格式，可以是 'a4'、'letter' 等
                    compress: true // 是否压缩 PDF
                }
            );
            let pageI = 1;
            await arr.map(async (itemArr, pageIndex) => {
                // console.log('pageIndex====', pageIndex)
                let i = pageIndex + 1;
                const canvasElement = document.getElementById('page' + i);
                //绘制页面
                await itemArr.map(async (item, index) => {
                    // console.log('signIndex====', item.signedIndex)

                    // 获取要合并的Canvas和div的引用
                    const divElement = document.getElementById('signed' + item.signedIndex);
                    // 创建一个新的Canvas作为目标Canvas
                    const mergedCanvas = document.createElement('canvas');
                    const mergedContext = mergedCanvas.getContext('2d');
                    // 获取Canvas和div的宽度和高度
                    const width = Math.max(canvasElement.width, divElement.offsetWidth);
                    const height = Math.max(canvasElement.height, divElement.offsetHeight);

                    // 设置目标Canvas的宽度和高度
                    mergedCanvas.width = width;
                    mergedCanvas.height = height;
                    // 使用html2canvas将Canvas和div的内容绘制到目标Canvas上
                    await html2canvas(canvasElement).then(async canvasImg => {
                        mergedContext.drawImage(canvasImg, 0, 0);
                        await html2canvas(divElement).then(async divImg => {
                            mergedContext.drawImage(divImg, 0, 0);
                            let left = parseInt(divElement.style.left);
                            let top = parseInt(divElement.style.top);
                            mergedContext.drawImage(divImg, left, top);
                            const screenshotUrl = mergedCanvas.toDataURL('image/jpeg');
                            await pdf.addImage(screenshotUrl, "JPEG", 0, 0);
                            pdf.setPage(pageIndex - 1)
                            if (pageI < arr.length) {
                                pageI++
                                pdf.addPage();
                            }
                        })
                    })

                    // // 创建一个下载链接并触发下载
                    // const link = document.createElement('a');
                    // link.href = screenshotUrl;
                    // link.download = 'screenshot.png';
                    // link.click();
                    // });

                })
            })
            setTimeout(() => {
                pdf.save("merged_pdf.pdf");
            }, 1000)
        },
        async buildPDF2() {
            const pdf = new jsPDF(
                {
                    orientation: 'landscape', // 纵向，或使用 'landscape' 横向
                    unit: 'px',
                    format: [640, 360], // 页面格式，可以是 'a4'、'letter' 等
                    // compress: true // 是否压缩 PDF
                }
            );
            let elements = document.getElementsByClassName('page-container');
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                await html2canvas(element).then(canvasImg => {
                    const screenshotUrl = canvasImg.toDataURL('image/png');
                    pdf.addImage(screenshotUrl, "PNG", 0, 0, element.offsetWidth*0.67, element.offsetHeight*0.67);
                    if (i + 1 < elements.length) {
                        pdf.addPage();
                    }
                })
            }
            pdf.save("merged_pdf.pdf");
        },
        //生成PDF并上传
        finishHandle() {
            this.buildPDF2()
            return

            // 获取要转换为PDF的HTML元素
            // const element = document.getElementById('pdfContainer');

            // 创建一个新的jsPDF实例
            const pdf = new jsPDF('', 'pt', [960, 540]);

            // 将HTML元素转换为PDF
            pdf.html(element, {
                callback: (pdf) => {
                    // 将PDF转换为二进制数据
                    const pdfData = pdf.output();
                    // const pdfData = pdf.output('arraybuffer');

                    // 创建一个Blob对象
                    const blob = new Blob([pdfData], { type: 'application/pdf' });

                    // 创建FormData对象并将Blob添加到其中
                    const formData = new FormData();
                    formData.append('file', blob, 'converted.pdf');
                    formData.append('fileCode', this.fileCode);
                    FileSaver.saveAs(blob, '2.pdf');
                    return
                    // 发送POST请求
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
                }
            });
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
