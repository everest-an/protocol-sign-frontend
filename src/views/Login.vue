<template>
    <div>
        <div class="container">
            <div class="form-container">
                <div class="left">

                    <img src="../assets/login-left.png">
                </div>
                <div class="right" v-if="!currentType">
                    <div class="styles {{curentType=='fox'?'select':''}}" @click="handleSelectLogin('fox')"><span
                            class="txt">MetaMask</span><img class="img" src="../assets/ico-fox.png"></div>
                    <div class="styles {{curentType=='email'?'select':''}}" @click="handleSelectLogin('email')"><span
                            class="txt">Email</span><img class="img" src="../assets/ico-emial.png"></div>
                </div>
                <div class="sign-in" v-if="currentType == 'email'">
                    <div class="title">Log In</div>
                    <div class="list">
                        <div class="name">Email</div>
                        <input placeholder="Enter Email" v-model="email">
                        <!-- <div class="err">Email is required have a value</div> -->
                    </div>
                    <div class="list">
                        <div class="name">Email Code</div>
                        <input placeholder="Enter Email Code" v-model="emailCode"><span class="code" @click="sendCode">Send
                            email code</span>
                        <!-- <div class="err">A Code is required</div> -->
                    </div>
                    <div class="tips">By clicking Get Started, you agree to Dsign's Privacy Notice and Terms & Conditions.
                    </div>
                    <div class="bt-submit" @click="loginEmail">LOG IN</div>
                </div>
            </div>
            <div style="margin-top: 100px;">
                <Footer></Footer>
            </div>
        </div>
    </div>
</template>

<script>
// import {
//     ElMessage
// } from 'element-plus';
// import * as PDF from "pdfjs-dist";
// import entry from "pdfjs-dist/build/pdf.worker.entry";
import Footer from '../components/footer.vue'
export default {
    name: "Login",
    components: {
        Footer
    },
    data() {
        return {
            currentType: '',
            email: '',
            emailCode: ''
        }

        // var validateuserName = (rule, value, callback) => {
        //     if (!value) {
        //         return callback(new Error('账号不能为空'));
        //     } else {
        //         callback();
        //     }
        // };
        // var validatePass = (rule, value, callback) => {
        //     if (!value) {
        //         return callback(new Error('密码不能为空'));
        //     } else {
        //         callback();
        //     }
        // };
        // return {
        //     ruleForm: {
        //         userName: '',
        //         password: ''
        //     },
        //     rules: {
        //         userName: [{
        //             validator: validateuserName,
        //             trigger: 'blur'
        //         }],
        //         password: [{
        //             validator: validatePass,
        //             trigger: 'blur'
        //         }]
        //     }
        //};
    },
    mounted() {
        // PDF.GlobalWorkerOptions.workerSrc = entry
    },
    methods: {
        handleSelectLogin(type) {
            if (type == 'fox') {//小狐狸登录
                // 检查MetaMask是否已经安装
                if (typeof window.ethereum !== 'undefined') {
                    console.log('MetaMask已安装');
                } else {
                    alert('MetaMask uninstall！')
                    return
                }
                // 请求用户授权登录
                ethereum.request({ method: 'eth_requestAccounts' })
                    .then((accounts) => {
                        // 用户已经授权登录
                        const account = accounts[0];
                        console.log(`用户已登录，账户地址为： ${account}`);
                        localStorage.setItem('address', account)

                        this.$axios.post('/web/login/authLogin', { accountAddress: account }).then((res) => {
                            console.log('login=========', res)
                            if (res.code == 0) {
                                localStorage.setItem('token', res.results.token)
                                this.$router.push({ name: 'Home' })
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                        // this.$router.push({ name: 'Index' })
                    })
                    .catch((error) => {
                        // 用户拒绝了授权登录请求
                        console.log(error);
                    });


            } else {//邮箱登录
                this.currentType = type;
            }
        },
        sendCode() {
            this.$axios.post('/web/login/sendCode', { emailAddress: this.email }).then((response) => {
                console.log(response);
            }).catch(function (error) {
                console.log(error);
            });
        },
        //邮箱登录
        loginEmail() {
            let data = {
                emailAddress: this.email,
                code: this.emailCode,
            }
            this.$axios.post('/web/login/emailLogin', data).then((res) => {
                console.log(res);
                if (res.code == 0) {
                    localStorage.setItem('address', res.results.accountAddress)
                    localStorage.setItem('token', res.results.token)
                    this.$router.push({
                        name: 'Home'
                    })
                } else {
                    alert(res.msg)
                }

            }).catch(function (error) {
                console.log(error);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post('/login', this.ruleForm).then(res => {
                        if (res.result_code == 200) {
                            localStorage.setItem('token', res.token.accessToken)
                            this.$router.push({ name: 'Index' })
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<style scoped lang="scss">
.container {
    // background: url(../assets/bg.png) no-repeat center;
    // background-size: 100% 100%;
    // background-attachment: fixed;
    // height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 980px;
    // margin: 0 auto;
    margin-top: 100px;
    height: 426px;
    background: #FFFFFF;
    border-radius: 8px;

    .left {
        width: 490px;
    }

}

.sign-title {
    text-align: center;
    color: #606266;
    line-height: 98px;
    padding-left: 100px;
}

.right {
    flex: 1;
    padding: 0 50px 28px 0;
    border-radius: 8px;


    .styles {
        width: 232px;
        height: 72px;
        border-radius: 8px;
        padding: 0 36px;
        border: 1px solid #DDDDDD;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto 24px;
        cursor: pointer;

        .txt {
            display: block;
        }

        .img {
            display: block;
            width: 40px;
        }
    }

    .select {
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid #000000;
    }
}

.sign-in {
    flex: 1;
    padding: 0 90px 28px;
    text-align: left;

    .title {
        font-size: 20px;
        font-family: HarmonyOS_Sans_Black;
        color: #333333;
        line-height: 29px;
        margin: 0 0 30px;
    }

    .list {
        position: relative;

        .name {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 20px;
            margin: 7px 0 8px;
        }

        input {
            padding: 0 14px;
            width: 274px;
            height: 40px;
            border-radius: 8px;
            border: 1px solid #DDDDDD;
        }

        .code {
            position: absolute;
            top: 37px;
            right: 30px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #0E37FF;
            line-height: 20px;
            cursor: pointer;
        }

        .err {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #F31515;
            line-height: 17px;
        }

    }

    .tips {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
        margin: 34px 0 16px;
    }

    .bt-submit {
        text-align: center;
        width: 302px;
        height: 40px;
        background: #000000;
        border-radius: 20px;
        border: 1px solid #000000;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 40px;
        cursor: pointer;
    }
}
</style>