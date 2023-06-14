<template>
    <div class="manage-wrap">
        <div class="top"><button class="bt-start" @click="startNow">Start Now</button></div>
        <div class="content">
            <div class="title">My uploaded files</div>
            <div class="table-wrap">
                <div class="table-title"><span class="col1">Subject</span><span class="col2">Status</span><span
                        class="col3">Last Change</span><span class="col4"></span></div>
                <div class="table-content">
                    <div class="list" v-for="item in list" :key="item.id">
                        <div class="col1">
                            <p class="txt1">{{ item.fileName }}</p>
                            <!-- <p class="txt2">To：{123455667@163.com}</p> -->
                        </div>
                        <div class="col2">waiting</div>
                        <div class="col3">{{ item.createTime }}</div>
                        <div class="col4">
                            <button @click="gotoPage(item)" v-if="item.status == 0 ">Sign</button>
                            <!-- <button class="grey">Sign</button> -->
                            <button v-else @click="downPdf(item)">Download</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import FileSaver from 'file-saver';
import { baseURL } from '@/http'
export default {
    name: "Manage",
    components: {},
    data() {
        return {
            currentType: '',
            list: []
        }
    },
    mounted() {
        this.$axios.post('/web/contract/queryPage', { size: 20, current: 1 }).then((res) => {
            console.log(res);
            this.list = res.results.records;
        }).catch(function (error) {
            console.log(error);
        });
    },
    methods: {
        startNow() {
            this.$router.push({
                name: 'Step1'
            })
        },
        gotoPage(item) {
            this.$router.push({ name: 'Sign', query: { 'fileCode': item.fileCode } });
            sessionStorage.setItem('placeMark', item.placeMark)
        },
        //下载pdf
        downPdf(item) {
            this.$axios({
                url: baseURL + '/web/contract/loadContract',
                method: 'post',
                responseType: 'blob',
                header: { "Content-Type": "multipart/form-data" },
                data: {
                    'fileCode': item.fileCode
                }
            }).then(res => {
                // 使用FileSaver.js下载文件
                FileSaver.saveAs(new Blob([res], { type: 'application/pdf' }), item.fileName);
            }).catch(() => {

            });
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
            cursor: pointer;
        }
    }

    .content {
        margin: 20px 0 10px;

        .title {
            font-size: 16px;
            font-family: HarmonyOS_Sans_Black;
            color: #333333;
            line-height: 23px;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .table-wrap {
            .col1 {
                flex: 1;
                display: block;
                padding-left: 20px;
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

                button {
                    cursor: pointer;
                }
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