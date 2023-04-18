<template>
    <div class="container">
        <div class="form-container">
            <div class="left">

                <img src="../assets/login-left.png">
            </div>
            <div class="right" v-if="!currentType">
                <div class="styles {{curentType=='fox'?'select':''}}" @click="handleSelectLogin('fox')"><span class="txt">MetaMast</span><img class="img" src="../assets/ico-fox.png"></div>
                <div class="styles {{curentType=='email'?'select':''}}" @click="handleSelectLogin('email')"><span class="txt">Email</span><img class="img" src="../assets/ico-emial.png"></div>
            </div>
            <div class="sign-in" v-if="currentType=='email'">
                <div class="title">Log In</div>
                <div class="list">
                    <div class="name">Email</div>
                    <input placeholder="Enter Email">
                    <div class="err">dsfsfs</div>
                </div>
                <div class="list">
                    <div class="name">Email</div>
                    <input placeholder="Enter Email"><span class="code">Send email code</span>
                    <div class="err">dsfsfs</div>
                </div>
                <div class="tips">By clicking Get Started, you agree to DocuSign’s Privacy Notice and Terms & Conditions.</div>
                <div class="bt-submit">LOG  IN</div>
            </div>
        </div>
    </div>
</template>

<script>
    // import {
    //     ElMessage
    // } from 'element-plus';
    export default {
        name: "Login",
        components: {},
        data() {
            return{
                currentType:'',
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
        methods: {
            handleSelectLogin(type){
                this.currentType=type;

            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/login', this.ruleForm).then(res => {
                            if(res.result_code == 200) {
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
    .container{
        // background: url(../assets/bg.png) no-repeat center;
        // background-size: 100% 100%;
        // background-attachment: fixed;
        height: calc(100vh - 60px);
        display: flex;
        align-items: center;
    }
    .form-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 980px;
        margin: 0 auto;
        height: 426px;
        background: #FFFFFF;
        border-radius: 8px;
        .left{
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
        flex:1;
        padding: 0 50px 28px 0;
        border-radius: 8px;
       
        
        .styles{
            width: 232px;
            height: 72px;
            border-radius: 8px;
            padding:0 36px;
            border: 1px solid #DDDDDD;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin:0 auto 24px;
            .txt{
                display: block;
            }
            .img{
                display: block;
                width: 40px;
            }
        }
        .select{
            background: rgba(0,0,0,0.05);
            border: 1px solid #000000;
        }
    }
    .sign-in{
        flex: 1;
        padding: 0 90px 28px;
        text-align: left;
        .title{
            font-size: 20px;
            font-family: HarmonyOS_Sans_Black;
            color: #333333;
            line-height: 29px;
            margin:0 0 30px;
        }
        .list{
            position: relative;
            .name{
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 20px;
                margin: 7px 0 8px;
            }
            input{
                padding: 0 14px;
                width: 274px;
                height: 40px;
                border-radius: 8px;
                border: 1px solid #DDDDDD;
            }
            .code{
                position: absolute;
                top:37px;
                right:30px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #0E37FF;
                line-height: 20px;
            }
            .err{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #F31515;
                line-height: 17px;
            }
            
        }
        .tips{
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 18px;
            margin: 34px 0 16px;
        }
        .bt-submit{
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
        }
    }
</style>