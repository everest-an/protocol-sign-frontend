<template>
<div class="contract-wrap">
    <Step :currentStep="2"></Step>
    <div class="content">
        <div class="title">Add recipients</div>
        <div class="buttons">
            <div class="bt-button"><img src="../../assets/ico-add1.png"><button class="bt-start">Start Now</button></div>
            <div class="input-button"><input placeholder="email，wallete addres" /><button>Add</button></div>
        </div>
        <div class="list">
            <div class="text-box">
                <div class="img"><img src="../../assets/ico-logo.png"></div>
                <div class="text">
                    <p class="txt1">dsfsfss</p>
                    <p class="txt2">dsfsdfsfsf</p>
                </div>
                <div class="del"><img src="../../assets/ico-del.png"></div>
            </div>
            <div class="text-box">
                <div class="img"><img src="../../assets/ico-logo.png"></div>
                <div class="text">
                    <p class="txt1">dsfsfss</p>
                    <p class="txt2">dsfsdfsfsf</p>
                </div>
                <div class="del"><img src="../../assets/ico-del.png"></div>
            </div>
        </div>

    </div>
</div>



</template>
<script>
import Step from '@/components/step.vue'
export default {
    name: "Manage",
    components: {Step},
    data() {
        return{
            currentType:'',
        }
    },
    methods:{

    },
}
</script>
<style scope lang="scss">
.contract-wrap{
    padding:40px 24px;
    
    .content{
        text-align: left;
        .title{
            font-size: 16px;
            font-family: HarmonyOS_Sans_Black;
            color: #333333;
            line-height: 23px;
            margin: 30px 0 20px;
        }
        .buttons{
            display: flex;
            .bt-button{
                width: 191px;
                height: 40px;
                border-radius: 20px;
                border: 1px solid #000000;
                display: flex;
                align-items: center;
                justify-content: center;
                img{
                    width: 13px;
                    height: 13px;
                    display: block;
                }
                button{
                    border: none;
                    background:none;
                }
            }
        }
        .input-button{
            display: flex;
            align-items: center;
            width: 488px;
            height: 40px;
            border-radius: 20px;
            border: 1px solid #000000;
            margin:0 0 0 20px;
            input{
                display: block;
                height: 38px;
                line-height: 38px;
                flex: 1;
                border: none;
                background: none;
                padding:0 0 0 10px;
            }
            button{
                width: 88px;
                height: 40px;
                background: #000000;
                border-radius: 0px 20px 20px 0px;
                border: 1px solid #000000;
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
            }
        }
        .list{
            display: flex;
            flex-wrap: wrap;
            margin:50px 0 0;
            .text-box{
                width: calc( 50% - 68px);
                display: block;
                padding:20px;
                border-radius: 8px;
                border: 1px solid #EEEEEE;
                margin: 0 10px;
                display: flex;
                align-items: center;
                .img{
                    display: block;
                    width: 64px;
                    height: 64px;
                    overflow: hidden;
                    background: #D8D8D8;
                    border-radius: 100%;
                    img{
                        display: block;
                        width: 64px;
                        height: 64px;
                    }
                }
                .text{
                    flex: 1;
                    margin:0 10px;
                    p{
                        margin: 0;
                    }
                    .txt1{
                        font-size: 14px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #333333;
                        line-height: 20px;
                    }
                    .txt2{
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #999999;
                        line-height: 17px;
                    }
                }
                .del{
                    width: 24px;
                    height: 24px;
                    img{
                        display: block;
                        width: 24px;
                        height: 24px;
                    }
                }
            }
        }
    }
}

</style>