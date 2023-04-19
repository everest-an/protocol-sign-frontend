<template>
<div class="contract-wrap">
    <Step :currentStep="4"></Step>
    <div class="content">
        <div class="auth-part">
            <div class="auth">
                <label>authentication:<input name="auth" value="0" type="radio">是</label>
                <label><input name="auth" value="1" type="radio">否</label>
            </div>
            <div class="button"><button>verfy</button></div>
        </div>
        <div class="pay-method">
            <div class="title">Pay <span class="red">$10</span> to Dsign, Select payment method</div>
            <div class="pay-list">
                <div class="list selected">
                    <img src="../../assets/ico-fox.png">
                    <span>Pay with metamask</span>
                </div>
                <div class="list">
                    <img src="../../assets/ico-add.png">
                    <span>Pay with a card</span>
                </div>
            </div>
        </div>
    </div>
    <div class="foot"><span @click="handlerBack">Back</span><span class="black" @click="handlerNext">Pay and Send</span></div>

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
         handlerNext(){
            
        },
        handlerBack(){
            this.$router.push({
                name:'Step3'
            })
        },
    },
}
</script>
<style scope lang="scss">
.contract-wrap{
    padding:40px 24px;
    .content{
        text-align: left;
        margin: 40px 0;
        .auth-part{
            display: flex;
            align-items: center;
            .auth{}
            .button{
                width: 104px;
                height: 32px;
                line-height: 32px;
                border-radius: 16px;
                border: 1px solid #000000;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #000000;
                margin: 0 0 0 30px;
                button{
                    display: block;
                    background: none;
                    border:none;
                    height: 100%;
                    width: 100%;
                }
            }
        }
        .pay-method{
            margin: 20px 0;
            .title{
                margin: 20px 0;
            }
            .pay-list{
                display: flex;
                flex-wrap: wrap;
                .list{
                    width: calc( 50% - 40px);
                    border:1px solid #ddd;
                    display: flex;
                    align-items: center;
                    margin: 0 10px;
                    padding:10px 0;
                    img{
                        display: block;
                        width: 40px;
                        height: 40px;
                    }
                    span{
                        font-size: 14px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #333333;
                        line-height: 20px;
                    }
                }
                .selected{
                    border: 2px solid #0E37FF;
                }
            }
        }

    }
     .foot{
        display: flex;
        justify-content: flex-end;
        span{
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
        .black{
            background: #000000;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
        }
    }
}

</style>