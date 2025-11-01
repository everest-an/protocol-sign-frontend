<template>
    <div class="manage-wrap">
        <div class="top"><button class="bt-start" @click="startNow">Start Now</button></div>
        <!-- <input type="file" ref="fileInput" @change="handleFileInputChange" accept='.jpg,.png'> -->
        <div class="content">
            <div class="title">My files</div>
            <div class="table-wrap">
                <div class="table-title"><span class="col1">Subject</span><span class="col2">Status</span><span
                        class="col3">Last Change</span><span class="col4"></span></div>
                <div class="table-content">
                    <div class="list" v-for="item in list" :key="item.id">
                        <div class="col1">
                            <p class="txt1">{{ item.fileName }}</p>
                            <!-- <p class="txt2">To：{123455667@163.com}</p> -->
                        </div>
                        <div class="col2" v-if="item.status !== 1">waiting</div>
                        <div class="col2" v-else>complete</div>
                        <div class="col3">{{ item.createTime }}</div>
                        <div class="col4">
                            <button @click="gotoPage(item)" v-if="item.status == 0">Sign</button>
                            <button class="grey" v-if="item.status == 2">Waiting</button>
                            <button v-if="item.status == 1" @click="downPdf(item)">Download</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <el-dialog v-model="centerDialogVisible">
            <div class="dialog-content">
                <div id='veriff-root'></div>
            </div>
        </el-dialog>
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
            list: [],
            centerDialogVisible: false
        }
    },
    mounted() {

        // this.$axios.post('/web/contract/queryPage', { size: 20, current: 1 }).then((res) => {
        this.$axios.post('/web/contract/queryPageBySign', { size: 20, current: 1 }).then((res) => {
            console.log(res);
            this.list = res.results.records;
        }).catch((error) => {
            console.log(error);
        });

    },
    methods: {
        startNow() {
            this.$router.push({
                name: 'Step1'
            })
        },

        handleFileInputChange(event) {
            const file = event.target.files[0];
            //KYC
            //创建一个FormData对象
            var formData = new FormData();
            // 添加参数
            formData.append('issuingCountry', 'CHN');
            formData.append('email', 'wjkcool@gmail.com');
            formData.append('idType', 'drivers_license');
            formData.append('idImage', file);

            this.$axios.post('https://rest-api.argoskyc.com/v3/submission/step1', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-api-key': 'jsOoheVIjb2Xihn3Utk87gNH48E0NMb1nXr2Wkyj'
                    }
                }
            ).then((res) => {
                console.log(res);
            }).catch((error) => {
                console.log(error);
            });
        },
        gotoPage(item) {
            if (item.identityStatus == 1 || item.authentication == 0) {//已验证
                this.$router.push({ name: 'Sign', query: { 'fileCode': item.fileCode } });
                sessionStorage.setItem('placeMark', item.placeMark)
            } else {//去人脸认证
                this.centerDialogVisible = true;
                this.$nextTick(() => {
                    const veriff = Veriff({
                        apiKey: 'f19cb8a2-a203-4995-9089-a585a72cd573',
                        parentId: 'veriff-root',
                        onSession: function (err, response) {
                            // received the response, verification can be started / triggered now
                            console.log('response=====', response)
                            // redirect
                            window.location.href = response.verification.url;
                        }
                    });
                    veriff.setParams({
                        person: {
                            givenName: ' ',
                            lastName: ' '
                        },
                        vendorData: item.customerNumber
                    });
                    veriff.mount({
                        submitBtnText: 'Get verified'
                    });
                })
            }
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

.dialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>