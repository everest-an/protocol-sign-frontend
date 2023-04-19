<template>
    <div class="manage-wrap">
        <div class="top"><button class="bt-start" @click="startNow">Start Now</button></div>
        <div class="content">
            <!-- <div class="title">Add Documents </div> -->
            <div class="table-wrap">
                <div class="table-title"><span class="col1">Subject</span><span class="col2">Status</span><span
                        class="col3">Last Change</span><span class="col4"></span></div>
                <div class="table-content">
                    <div class="list">
                        <div class="col1">
                            <p class="txt1">数字签名合同范本</p>
                            <p class="txt2">To：123455667@163.com</p>
                        </div>
                        <div class="col2">waiting</div>
                        <div class="col3">23242423</div>
                        <div class="col4">
                            <button>Sign</button>
                            <!-- <button class="grey">Sign</button> -->
                            <!-- <button>Download</button> -->
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Manage",
    components: {},
    data() {
        return {
            currentType: '',
        }
    },
    methods: {
        startNow() {
            this.$router.push({
                name: 'Step1'
            })
        }
    },
}
</script>
<style scoped lang="scss">
.manage-wrap {
    text-align: left;
    padding: 20px 24px;

    .top {
        .bt-start {
            width: 174px;
            height: 32px;
            border-radius: 16px;
            border: 1px solid #000000;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 20px;
            display: block;
            background-color: #fff;

        }
    }

    .content {
        margin: 20px 0 10px;

        .title {
            font-size: 16px;
            font-family: HarmonyOS_Sans_Black;
            color: #333333;
            line-height: 23px;
        }

        .table-wrap {
            .col1 {
                flex: 1;
                display: block;
            }

            .col2 {
                width: 120px;
                display: block;
            }

            .col3 {
                width: 180px;
                display: block;
            }

            .col4 {
                width: 100px;
                display: block;
            }

            .table-title {
                height: 32px;
                background: #F7F7F7;
                border-radius: 8px;
                line-height: 32px;
                display: flex;
                font-size: 12px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #000000;
                line-height: 32px;
            }

            .table-content {
                .list {
                    display: flex;
                    align-items: center;
                    padding: 10px 0;

                    .col1 {
                        p {
                            margin: 0;
                        }

                        .txt1 {
                            font-size: 12px;
                            font-family: PingFangSC-Semibold, PingFang SC;
                            font-weight: 600;
                            color: #333333;
                            line-height: 23px;
                        }

                        .txt2 {
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #999999;
                            line-height: 23px;
                        }
                    }

                    .col2 {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #333333;
                    }

                    .col3 {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #333333;
                    }

                    .col4 {
                        button {
                            width: 76px;
                            height: 24px;
                            background: #000000;
                            border-radius: 16px;
                            border: 1px solid #000000;
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #FFFFFF;
                            margin: 2px 0;
                        }

                        .grey {
                            opacity: 0.25;
                        }
                    }

                }
            }
        }
    }
}
</style>