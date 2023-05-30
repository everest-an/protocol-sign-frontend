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
            console.log('1111111111', placeSign);
            pageList = placeSign
        },
        //生成PDF
        buildPDF() {
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
            console.log('pageList====', arr)
            const pdf = new jsPDF('', 'pt', [540, 960]);
            let pageI = 1;
            let p = new Promise((resolve, reject) => {
                arr.map((itemArr, pageIndex) => {
                    console.log('pageIndex====', pageIndex)
                    let i = pageIndex + 1;
                    const canvasElement = document.getElementById('page' + i);
                    //绘制页面
                    itemArr.map((item, index) => {
                        console.log('signIndex====', index)
                        // 获取要合并的Canvas和div的引用
                        const divElement = document.getElementById('signed' + index);

                        // 创建一个新的Canvas作为目标Canvas
                        const mergedCanvas = document.createElement('canvas');
                        const mergedContext = mergedCanvas.getContext('2d');
                        console.log('canvasElement====', canvasElement)
                        // 获取Canvas和div的宽度和高度
                        const width = Math.max(canvasElement.width, divElement.offsetWidth);
                        const height = Math.max(canvasElement.height, divElement.offsetHeight);

                        // 设置目标Canvas的宽度和高度
                        mergedCanvas.width = width;
                        mergedCanvas.height = height;

                        // 使用html2canvas将Canvas和div的内容绘制到目标Canvas上
                        Promise.all([
                            html2canvas(canvasElement),
                            html2canvas(divElement)
                        ]).then(([canvasImg, divImg]) => {
                            // 将Canvas和div的内容绘制到目标Canvas上
                            mergedContext.drawImage(canvasImg, 0, 0);
                            let left = parseInt(divElement.style.left);
                            let top = parseInt(divElement.style.top);
                            mergedContext.drawImage(divImg, left, top);
                            const screenshotUrl = mergedCanvas.toDataURL('image/jpeg', 1.0);
                            // 将图像数据添加到当前页面的 PDF 中
                            // for(pageI;)
                            pdf.setPage(pageI - 1, [width,height], "portrait")
                            pdf.addImage(screenshotUrl, "JPEG", 0, 0);
                            if (pageI < arr.length) {
                                pageI++
                                pdf.addPage();
                            }
                            // pdf.setPage(pageI - 1, [width,height], "portrait")
                            // pdf.addImage(screenshotUrl, 'PNG', 0, 0);
                            // pdf.save(`canvas_${pageIndex + 1}.pdf`);
                            // // 如果不是最后一个 Canvas，则跳转到下一页
                            // if (i < canvasList.length - 1) {
                            //     pdf.setPage(i + 2);
                            // }

                            // // 创建一个下载链接并触发下载
                            // const link = document.createElement('a');
                            // link.href = screenshotUrl;
                            // link.download = 'screenshot.png';
                            // link.click();
                        });
                    })
                })
            })


            setTimeout(() => {
                pdf.save("merged_pdf.pdf");
            }, 3000)
        },
        //生成PDF并上传
        finishHandle() {
            this.buildPDF()
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
