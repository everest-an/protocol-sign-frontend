<template>
    <div class="auth-wrap">
        <div class="auth-content">
            <div class="auth-self">
                <div class="left">
                    <img class="img" src="../../assets/ico-person.png">
                    <span class="txt">{{ address }}</span>
                    <img class="copy" src="../../assets/ico-copy.png" @click="copyContent">
                </div>
                <div class="right">
                    <!-- <button class="bt-start">Authentication</button> -->
                    <span style="margin-right: 10px;">Identity status:</span>
                    <el-switch v-model="switchStatus" />
                </div>
                <!-- <div class="right"><button class="bt-start">Verified</button></div> -->
            </div>
        </div>
    </div>
</template>
<script>
import { ElMessage } from 'element-plus';
export default {
    name: "Authentication",
    components: {},
    data() {
        return {
            currentType: '',
            address: '',
            switchStatus: false
        }
    },
    mounted() {
        this.address = localStorage.getItem('address');
        this.$axios.post('/web/customer/queryInfo', {}).then((res) => {
            console.log(res);
            if (res.results.identityStatus == 1) {//已认证
                this.switchStatus = true
            }
        }).catch((error) => {
            console.log(error);
        });
    },
    methods: {
        copyContent() {
            const content = this.address; // 将需要复制的内容替换成你想要复制的实际内容

            const textarea = document.createElement('textarea');
            textarea.value = content;

            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            ElMessage.success('Content copied')
            // 复制成功后的提示或其他逻辑
            console.log('Content copied');
        }
    },
}
</script>
<style scoped lang="scss">
.auth-wrap {
    padding: 20px 24px;

    .auth-content {
        margin: 40px;

        .auth-self {
            padding: 30px;
            display: flex;
            align-items: center;
            border: 1px solid #eee;

            .left {
                flex: 1;
                display: flex;
                align-items: center;

                .img {
                    display: block;
                    width: 40px;
                    height: 40px;
                }

                .txt {
                    font-size: 16px;
                    font-family: HarmonyOS_Sans;
                    color: #333333;
                    margin: 0 10px;

                }

                .copy {
                    width: 32px;
                    height: 32px;
                    display: block;
                    cursor: pointer;
                    
                }
            }

            .right {
                display: flex;
                align-items: center;
                font-size: 18px;
                .bt-start {
                    height: 24px;
                    background: #000000;
                    border-radius: 16px;
                    border: 1px solid #000000;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;

                }
            }
        }
    }
}
</style>