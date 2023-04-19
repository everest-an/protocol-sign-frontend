<template>
    <div class="auth-wrap">
        <div class="auth-content">
            <div class="auth-self">
                <div class="left">
                    <img class="img" src="../../assets/ico-person.png">
                    <span class="txt">{{address}}</span>
                    <img class="copy" src="../../assets/ico-copy.png">
                </div>
                <div class="right"><button class="bt-start">Authentication</button></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Authentication",
    components: {},
    data() {
        return{
            currentType:'',
            address:''
        }
    },
    mounted(){
        this.address = sessionStorage.getItem('address');
    },
    methods:{

    },
}
</script>
<style scoped lang="scss">
.auth-wrap{
    padding: 20px 24px;
    .auth-content{
        margin: 40px;
        .auth-self{
            padding: 30px;
            display: flex;
            align-items: center;
            border: 1px solid #eee;
            .left{
                flex:1;
                display: flex;
                align-items: center;
                .img{
                    display:block;
                    width: 40px;
                    height: 40px;
                }
                .txt{
                    font-size: 16px;
                    font-family: HarmonyOS_Sans;
                    color: #333333;
                    margin:0 10px;
                   
                }
                .copy{
                    width: 32px;
                    height: 32px;
                    display: block;
                }
            }
            .right{
                width: 140px;
                .bt-start{
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