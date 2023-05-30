<template>
    <div class="contract-wrap">
        <Step :currentStep="4"></Step>
        <div class="content">
            <div class="auth-part">
                <div class="auth">
                    <label>Authentication:<input name="auth" value="option1" type="radio" v-model="selectedOption"
                            @click="handleOptionClick('option1')">yes</label>
                    <label><input name="auth" value="option2" type="radio" v-model="selectedOption"
                            @click="handleOptionClick('option2')">no</label>
                </div>
                <div class="button" v-if="isVerfy"><button @click="verfyIdentity">verify</button></div>
            </div>
            <div class="pay-method">
                <div class="title">Pay <span class="red">$1</span> to Dsign, Select payment method</div>
                <div class="pay-list">
                    <div class="list " :class="payMetaMask ? 'selected' : ''" @click="payMethods('metamask')">
                        <img src="../../assets/ico-fox.png">
                        <span>Pay with metamask</span>
                    </div>
                    <div class="list" :class="!payMetaMask ? 'selected' : ''" @click="payMethods('paypal')">
                        <img src="../../assets/ico-paypal.png">
                        <span></span>
                    </div>
                    <!-- <div class="list" :class="!payMetaMask ? 'selected' : ''" @click="payMethods('card')">
                        <img src="../../assets/ico-add.png">
                        <span>Pay with a card</span>
                    </div> -->
                </div>
            </div>
        </div>
        <!-- <div id="paypal-button-container-P-85191607KB5209331MRW2YPA"></div> -->
        <div class="foot">
            <span @click="handlerBack">Back</span>
            <span v-if="!isPay" class="black" @click="handlerPay">Pay</span>
            <span v-else class="black" @click="handlerStatus">Send</span>
        </div>
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="showModal = false">&times;</span>
                <p>{{ message }}</p>
            </div>
        </div>
        <div v-if="show" class="toast">
            {{ toastMsg }}
        </div>
    </div>
</template>
<script>
import Step from '@/components/step.vue'
export default {
    name: "Manage",
    components: { Step },
    data() {
        return {
            currentType: '',
            selectedOption: 'option2',
            isVerfy: false,
            showModal: false,
            message: 'Authenticating...',
            toastMsg: 'Authentication Ok！',
            show: false,
            payMetaMask: true,
            isPay:false,//是否支付成功
        }
    },
    mounted() {
        // paypal.Buttons({
        //     style: {
        //         shape: 'rect',
        //         color: 'silver',
        //         layout: 'vertical',
        //         label: 'subscribe'
        //     },
        //     createSubscription: function (data, actions) {
        //         return actions.subscription.create({
        //             /* Creates the subscription */
        //             plan_id: 'P-85191607KB5209331MRW2YPA',
        //             quantity: 1, // The quantity of the product for a subscription
        //             price: 5
        //         });
        //     },
        //     onApprove: function (data, actions) {
        //         alert(data.subscriptionID); // You can add optional success message for the subscriber here
        //     }
        // }).render('#paypal-button-container-P-85191607KB5209331MRW2YPA'); // Renders the PayPal button
    },
    methods: {
        payMethods(type) {
            if (type == 'metamask') {
                this.payMetaMask = true
            } else {
                this.payMetaMask = false
            }
        },
         handlerPay() {

            this.message = "waiting..."
            this.showModal = true;
            // setTimeout(() => {
            //     this.showModal = false;
            // }, 2000)
            let datas={
                total:1,
                currency:'USD',
                description:'',
                localOrderNo:'',
            };
            

            if(!this.payMetaMask){
                // 发送POST请求
                this.$axios.get('/web/pay/payPai',{params:datas}).then((response) => {
                    if(response.code==0){
                        this.showModal = false;
                        this.isPay=true;
                    }
                    
                    console.log(response)
                    
                }).catch(function (error) {
                    console.log(error);
                });
            }
            


        },
        handlerSend(){
            console.log('www')
            let file = this.$store.state.pdfFile;
            let receiverEmail = JSON.stringify(this.$store.state.receiverEmail);
            let placeMark = JSON.stringify(this.$store.state.placeMark);
            let authentication = this.selectedOption == 'option2' ? 0 : 1;
            //创建一个FormData对象
            var formData = new FormData();
            // 添加文件
            formData.append('file', file);
            // 添加参数
            formData.append('authentication', authentication);
            formData.append('fileName', file.name);
            formData.append('placeMark', placeMark);
            formData.append('receiverEmail', receiverEmail);
            
                // this.message = "waiting..."
                // this.showModal = true;
                // setTimeout(() => {
                //     this.showModal = false;
                // }, 2000)

                if(!this.payMetaMask){
                    // 发送POST请求
                    this.$axios.post('/web/contract/addContractByAuthor', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((response) => {
                        this.showModal = false;
                        this.$router.push({
                            name: 'Manage'
                        })
                    }).catch(function (error) {
                        console.log(error);
                    });
                }  
                
           
        },
        handlerStatus() {
            this.$axios.post('/web/contract/queryPayStatus').then((response) => {
                if(response.code==0){
                   
                }
                console.log(response)
                
             }).catch(function (error) {
                console.log(error);
                
            });
             //this.handlerSend();
            


        },
        handlerBack() {
            this.$router.push({
                name: 'Step3'
            })
        },
        handleOptionClick(options) {
            if (options == 'option1') {//是
                this.isVerfy = true
            } else {//否
                this.isVerfy = false
            }
        },
        verfyIdentity() {
            this.message = "Authenticating...";
            this.toastMsg = "Authentication Ok!";
            this.showModal = true
            setTimeout(() => {
                this.showModal = false;
                this.show = true;
                setTimeout(() => {
                    this.show = false;
                }, 2000)
            }, 2000)
        },
    },
}
</script>
<style scoped lang="scss">
.toast {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: white;
    padding: 16px;
    border-radius: 5px;
    z-index: 9999;
}

.contract-wrap {
    padding: 40px 24px;

    .content {
        text-align: left;
        margin: 40px 0;

        .auth-part {
            display: flex;
            align-items: center;

            .auth {}

            .button {
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
                position: absolute;
                left: 400px;
                cursor: pointer;

                button {
                    display: block;
                    background: none;
                    border: none;
                    height: 100%;
                    width: 100%;
                    cursor: pointer;
                }
            }
        }

        .pay-method {
            margin: 20px 0;

            .title {
                margin: 20px 0;
            }

            .pay-list {
                display: flex;
                flex-wrap: wrap;

                .list {
                    width: 748px;
                    border: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    // margin: 0 10px;
                    padding: 5px 0;

                    img {
                        display: block;
                        // width: 40px;
                        height: 40px;
                    }

                    span {
                        font-size: 14px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #333333;
                        line-height: 20px;
                    }
                }

                .selected {
                    border: 2px solid #0E37FF;
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

.modal {
    display: block;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
</style>