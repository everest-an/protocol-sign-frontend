<template>
    <div class="contract-wrap">
        <Step :currentStep="3"></Step>
        <pdf-canvas></pdf-canvas>
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
    methods: {
        handlerNext() {
            // let file = this.$store.state.pdfFile;
            // console.log(file)
            // let receiverEmail = this.$store.state.receiverEmail;
            // //创建一个FormData对象
            // var formData = new FormData();

            // // 添加文件
            // formData.append('file', file);

            // // 添加参数
            // formData.append('authentication', 0);
            // formData.append('fileName', 'pdf');
            // formData.append('placeMark', '[]');
            // formData.append('receiverEmail', '[]');

            // // 发送POST请求
            // this.$axios.post('/web/contract/addContractByAuthor', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // }).then(function (response) {
            //     console.log(response);
            //     this.$router.push({
            //         name: 'Step4'
            //     })
            // }).catch(function (error) {
            //     console.log(error);
            // });
            this.$router.push({
                    name: 'Step4'
                })
            return

            // var form = document.createElement("form");
            // form.id = "form";
            // form.name = "form";
            // document.body.appendChild(form);
            // // let arr = Object.keys(formData)
            // // arr.forEach(item => {
            // //     var input = document.createElement("input");
            // //     input.tpye = "hidden";
            // //     input.name = `${item}`; //参数名字
            // //     input.value = formData[item]; //参数值
            // //     form.appendChild(input);
            // // })
            // form.method = "POST"; //请求方式
            // form.action = baseURL + '/web/contract/addContractByAuthor';
            // form.submit();
            // document.body.removeChild(form);

            this.$router.push({
                name: 'Step4'
            })
            // this.$axios.post('/web/contract/addContractByAuthor', {

            // }).then(res => {
            //     this.handleSearch()
            // })
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