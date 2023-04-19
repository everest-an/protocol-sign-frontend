import axios from 'axios';
import {
    qs
} from 'url-parse';

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
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

 //const baseURL = 'https://ec.pugongyinghulian.com/shopapi3/smallshop'
 const baseURL = 'https://tjtest.pugongyinghulian.com/dsign_api'

// const baseURL = 'http://192.168.1.22:8116/smallshop'
axios.defaults.baseURL = baseURL
const request = axios.create({
    baseURL: baseURL,
    headers: {
        'token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIweDliOTAyNDRiNzU1YWRhMDQ0ZWZlYmRjM2RkMmFlYzk1OWUzMWFjNjEiLCJhdWRpZW5jZSI6IiIsImNyZWF0ZWQiOjE2ODE4OTg5NjU0NzAsImV4cCI6MTY4MjE1ODE2NX0.fz2x0HBAuOh0ifS2FIQgav_tSpHU23I4a7kmboIiX_mBo_sL1BZMXsZTZDEQuGPdrjC_h64nRyKhcAeJjAfdWw',
        'isWeb':'0',
    },
})
let count = 0;//请求次数
let resCount = 0;//响应次数
// 请求拦截
request.interceptors.request.use(config => {
    count++
    console.log(config.data)
    if (config.data instanceof FormData) {
        // config.data = JSON.stringify(config.data);
    } else if (!config.data.qs) {
        config.data = qs.stringify(config.data);
    }
    startLoading();
    //console.log(config)
    return config;
});

// 响应拦截
request.interceptors.response.use(response => {
    resCount++;
    if(count==resCount){
      endLoading();
    }
    // console.log('http response===',response)
    return response.data.results || response.data;
}, error => {
    // 请求失败
    resCount++;
    if(count==resCount){
       endLoading();
    }
    ElMessage('一条失败的消息提示');
    return Promise.reject(error);
})

export {request, baseURL};