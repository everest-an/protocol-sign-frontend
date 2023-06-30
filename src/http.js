import axios from 'axios';
import {
    qs
} from 'url-parse';

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus';
import router from '@/router'

NProgress.configure({
    showSpinner: true
})

// let loading;
function startLoading() {
    // loading = ElLoading.service({
    //     lock: true,
    //     text: '加载中……',
    //     background: 'rgba(0, 0, 0, 0.4)'
    // });
    NProgress.start();
}

function endLoading() {
    // loading.close();
    NProgress.done();
}

 const baseURL = 'https://tjtest.pugongyinghulian.com/dsign_api'
// const baseURL = 'https://www.ahawechat.com/dsign_api'

axios.defaults.baseURL = baseURL;

// let token = localStorage.getItem('token')
const request = axios.create({
    baseURL: baseURL,
    timeout: 60000,
    headers: {
        'isWeb': '0',
    },
})
let count = 0;//请求次数
let resCount = 0;//响应次数
// 请求拦截
request.interceptors.request.use(config => {
    count++
    console.log(config.data)
    if (config.data) {
        if (config.data instanceof FormData) {
            // config.data = JSON.stringify(config.data);
        } else if (!config.data.qs) {
            config.data = qs.stringify(config.data);
        }
    }

    config.headers = {
        'token': localStorage.getItem('token'),              // 这里自定义配置，这里传的是token
        // 'token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIweDUzNzYxYmEyNjdlYzI3OWRjMjk2MzQ1Y2I2MjE2OGEyMjUzNjY5NDUiLCJhdWRpZW5jZSI6IiIsImNyZWF0ZWQiOjE2ODU0MzUxNjg1MTQsImV4cCI6MTY4NTY5NDM2OH0.Ji_Khj_hlKALBPoEZSAK0-mVGrjtqCzTJY6GXHGP2UOuuwM4YoP8d-7tla6L2HUDejHphcW46crR4ff9nE15Yg',              // 这里自定义配置，这里传的是token
    };
    startLoading();
    //console.log(config)
    return config;
});

// 响应拦截
request.interceptors.response.use(response => {
    resCount++;
    if (count == resCount) {
        endLoading();
    }

    // console.log('http response===',response)
    if (response.data.code == '401') {
        localStorage.clear();
        sessionStorage.setItem('authCode', '401')
        console.log('router==', router)
        router.push({ name: 'Login' })
        ElMessage.error(response.data.msg);
        return Promise.reject(response.data.msg);
    }
    return response.data;
}, error => {
    // 请求失败
    resCount++;
    if (count == resCount) {
        endLoading();
    }
    // ElMessage('一条失败的消息提示');
    return Promise.reject(error);
})

export { request, baseURL };