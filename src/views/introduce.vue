<template>
    <div>
        <Header :opacity="opacity"></Header>
        <div class="content">
            <div class="content-1">
                <div class="part-1">
                    <div class="txt">
                        <div>
                            Web3 electronic contract signature,
                        </div>
                        <div>
                            Document send protocol
                        </div>
                    </div>
                    <img src="../assets/boll.png" class="boll">
                </div>

                <div class="txt-2">
                    <div>
                        <div class="des">
                            Protocol Sign is a private, secure, and anonymous way for you and your clients to sign
                            electronic
                            contracts and send documents.
                        </div>
                        <div class="des">
                            Bring blockchain to the people, guarantee contracts' safety and security, and the signatures are
                            permanently stored.
                        </div>
                    </div>
                    <div class="learn-more" @click="learnMore">Learn More</div>
                </div>

                <div class="content-2">
                    <div class="part-sign">
                        <div class="title">
                            Decentralized by Contract Signature
                        </div>
                        <div>
                            You sign it. You own it. Protocol Sign is built using web3 technologies: log in with Ethereum or
                            Email,
                            store your electronic contract on Arweave, and publish using Protocol Sign’s credibly-neutral
                            protocol.
                        </div>
                    </div>
                    <div class="part-send">
                        <div class="title">
                            Decentralized by Document Send
                        </div>
                        <div>
                            You don't need to worry about the platform viewing your documents, you can safely send encrypted
                            files to your partners. Protocol Sign is a decentralized non-custodial protocol.
                        </div>
                    </div>
                </div>

                <div class="content-3">
                    <div class="content-title">Why Protocol Sign</div>
                    <div class="content-part">
                        <div class="part">
                            <div class="title">Own your data</div>
                            <div class="des">
                                From now on, your data will be stored encrypted in your decentralized private storage and
                                only
                                accessible by you. You have full ownership. We can't see your data - no more data leaks and
                                data
                                breaches.
                            </div>
                        </div>
                        <div class="part">
                            <div class="title">Protect privacy and complete</div>
                            <div class="des">
                                Protect your contract' privacy
                                Stop having to worry about platform viewing ads, trackers, no trackers, no cookies. And
                                storage on the chain allows you to preview your contract for life.
                            </div>
                        </div>
                        <div class="part">
                            <div class="title">Stronger Legal Effect</div>
                            <div class="des">
                                We use biometrics, and legal identity authentication, to give contracts stronger legal
                                force. Based on blockchain technology and encryption, contracts cannot be tampered with.
                            </div>
                        </div>
                    </div>
                </div>



            </div>
            <div class="content-4">
                <div class="title">Store your contracts permanently</div>
                <div class="sub-title">Let Decentralized Signature lead the arrival of the era of data ownership</div>
            </div>
        </div>
        <div class="footer">
            <Footer></Footer>
        </div>
    </div>
</template>
<script>
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
export default {
    name: "Introduce",
    components: {
        Header,
        Footer
    },
    data() {
        return {
            opacity: '1',
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    unmounted() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        learnMore() {
            window.open('https://everest-research.gitbook.io/untitled/dsign/dsign-light-paper')
        },
        handleScroll() {
            let that = this
            window.addEventListener('scroll', function () {
                // 处理滚动事件
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                // console.log(scrollTop);
                if (scrollTop > 200) {
                    that.opacity = '0'
                } else {
                    that.opacity = 1 - (scrollTop / 200)
                }
            });
        }
    },
}
</script>
<style lang="scss" scoped>
.content {
    margin-top: 130px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.content-1 {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.part-1 {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-top: 110px;
    flex-wrap: wrap;
    .txt {
        text-align: left;
        font-size: 36px;
        padding: 0 20px;
    }

    .boll {
        width: 380px;
        height: auto;
        object-fit: cover;
        display: block;
    }

}

.txt-2 {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .des {
        margin-top: 20px;
        padding: 0 20px;
    }

    .learn-more {
        margin-top: 20px;
        font-size: 15px;
        font-weight: bold;
        border-radius: 10px;
        border: 1px solid #000;
        padding: 15px 8px;
        margin-left: 20px;
        cursor: pointer;
    }
}

.content-2 {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 100px;
    flex-wrap: wrap;
    .title {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 30px;
    }

    .part-sign {
        display: flex;
        flex-direction: column;
        width: 300px;
        background: linear-gradient(to bottom, rgba(20, 20, 22, 0.1), rgba(0, 0, 0, 0));
        padding: 40px;
        border-radius: 100px;
        border: 1px solid #fff;
        margin-bottom: 20px;
    }

    .part-send {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 300px;
        background: linear-gradient(to bottom, rgba(20, 20, 22, 0.1), rgba(0, 0, 0, 0));
        padding: 40px;
        border-radius: 100px;
        border: 1px solid #fff;
        margin-bottom: 20px;
        .title {
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 30px;
        }
    }
}

.content-3 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 150px;
    flex-wrap: wrap;
    .content-part {
        width: 100%;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .part {
        width: 280px;
        margin-bottom: 30px;
        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
    }

    .content-title {
        font-weight: bold;
        font-size: 25px;
        margin-bottom: 50px;
    }

    .des {
        font-size: 16px;
        line-height: 25px;
    }
}

.content-4 {
    margin-top: 150px;
    width: 100%;
    background-color: #fff;
    padding: 20px 0;

    .title {
        font-size: 43px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .sub-title {
        font-size: 14px;
        font-weight: bold;
    }
}

.footer {
    margin-top: 100px;
}
</style>
