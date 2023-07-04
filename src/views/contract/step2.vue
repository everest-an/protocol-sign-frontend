<template>
    <div class="contract-wrap">
        <Step :currentStep="2"></Step>
        <div class="content">
            <div class="title">Add recipients</div>
            <div class="buttons">
                <div class="bt-button" @click="addMyself"><img src="../../assets/ico-add1.png">
                    <div class="bt-start">Add Myself</div>
                </div>
                <div class="input-button"><input placeholder="email，wallete addres" v-model="email" /><button
                        @click="addOrther">Add</button></div>
            </div>
            <div class="list">
                <div v-for="(item, index) in userArr" :key="index" class="text-box">
                    <div style="display: flex;align-items: center;">
                        <div class="img"><img src="../../assets/circle.png"></div>
                        <div class="text">
                            <p class="txt1">{{ item.address || item.email }}</p>
                            <!-- <p class="txt2">对方暂未注册</p> -->
                        </div>
                        <div class="del" @click="deleteAccount(index)"><img src="../../assets/ico-del.png"></div>
                    </div>
                    <div class="add-email" v-if="item.address">
                        <div>Recipient email</div>
                        <el-input v-model="item.email" placeholder="Please enter your email address"
                            style="width: 300px;" />
                    </div>
                </div>
            </div>

        </div>
        <div class="foot"><span @click="handlerBack">Back</span><span class="black" @click="handlerNext">Next</span></div>
    </div>
</template>
<script>
import Step from '@/components/step.vue'
import { ElMessage } from 'element-plus'
export default {
    name: "Manage",
    components: { Step },
    data() {
        return {
            currentType: '',
            userArr: [],
            email: '',
            address: '',
        }
    },
    methods: {
        validateEmail(email) {
            // 邮箱验证正则表达式
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        deleteAccount(index) {
            this.userArr.splice(index, 1);
            // console.log(this.userArr);
            let arr = [];
            this.userArr.map(item => {
                arr.push(item.address)
            })
            console.log('arr==', arr)
            this.$store.commit('SET_EMAIL', arr)
        },
        addMyself() {
            this.address = localStorage.getItem('address');
            let obj = { email: '', address: this.address }
            this.userArr.push(obj);
            // let arr = [];
            // this.userArr.map(item => {
            //     arr.push(item.address)
            // })
            // console.log('arr==', arr)
            // this.$store.commit('SET_EMAIL', arr)
        },
        addOrther() {
            var isValid = this.validateEmail(this.email);

            if (isValid) {
                console.log("邮箱格式正确");
            } else {
                ElMessage.error('Email error')
                console.log("邮箱格式错误");
                return
            }
            if (this.userArr.length > 4) {
                ElMessage.error('Add up to 5 recipients')
                return
            }
            let obj = { email: this.email }
            this.userArr.push(obj);
           
            // let arr = [];
            // this.userArr.map(item => {
            //     arr.push(item.address)
            // })
            // this.$store.commit('SET_EMAIL', arr)
        },
        handlerNext() {

            let isEmail = true;
            let emailError = false;
            this.userArr.map(item => {
                if (!item.email) {
                    isEmail = false
                }
            })
            if (isEmail == false) {
                ElMessage.error('Please enter your email address')
                return
            }
            this.userArr.map(item => {
                if (!this.validateEmail(item.email)) {
                    emailError = true
                }
            })
            if (emailError) {
                ElMessage.error('Email error')
                return
            }
            let arr = [];
            this.userArr.map(item => {
                arr.push(item.email)
            })
            this.$store.commit('SET_EMAIL', arr);
            this.$store.commit('SET_USERARR', this.userArr);
            this.$router.push({
                name: 'Step3'
            })
        },
        handlerBack() {
            this.$router.push({
                name: 'Step1'
            })
        },
    },
}
</script>
<style scoped lang="scss">
.contract-wrap {
    padding: 40px 24px;

    .content {
        text-align: left;
        min-height: 500px;

        .title {
            font-size: 16px;
            font-family: HarmonyOS_Sans_Black;
            color: #333333;
            line-height: 23px;
            margin: 30px 0 20px;
        }

        .buttons {
            display: flex;

            .bt-button {
                width: 191px;
                height: 40px;
                border-radius: 20px;
                border: 1px solid #000000;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;

                img {
                    width: 13px;
                    height: 13px;
                    display: block;
                    margin-right: 10px;
                }

                button {
                    border: none;
                    background: none;
                }
            }
        }

        .input-button {
            display: flex;
            align-items: center;
            width: 488px;
            height: 40px;
            border-radius: 20px;
            border: 1px solid #000000;
            margin: 0 0 0 20px;

            input {
                display: block;
                height: 38px;
                line-height: 38px;
                flex: 1;
                border: none;
                background: none;
                padding: 0 0 0 10px;
            }

            button {
                width: 88px;
                height: 40px;
                background: #000000;
                border-radius: 0px 20px 20px 0px;
                border: 1px solid #000000;
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
                cursor: pointer;
            }
        }

        .list {
            display: flex;
            flex-wrap: wrap;
            margin: 50px 0 0;

            .text-box {
                // width: calc(50% - 68px);
                display: block;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #EEEEEE;
                margin: 0 10px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-top: 20px;

                .img {
                    display: block;
                    width: 64px;
                    height: 64px;
                    overflow: hidden;
                    background: #eee;
                    border-radius: 100%;

                    img {
                        display: block;
                        width: 64px;
                        height: 64px;
                    }
                }

                .text {
                    flex: 1;
                    margin: 0 10px;

                    p {
                        margin: 0;
                    }

                    .txt1 {
                        font-size: 14px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #333333;
                        line-height: 20px;
                    }

                    .txt2 {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #999999;
                        line-height: 17px;
                    }
                }

                .del {
                    width: 24px;
                    height: 24px;
                    cursor: pointer;

                    img {
                        display: block;
                        width: 24px;
                        height: 24px;
                    }
                }
            }
        }
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
}

.add-email {
    display: flex;
    align-items: center;
    white-space: nowrap;

    div {
        margin-right: 10px;
        margin-top: 10px;
    }
}
</style>