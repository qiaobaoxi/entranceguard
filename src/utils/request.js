import axios from 'axios';
import router from '@/router'
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
});

import {ElMessage} from "element-plus"
ElMessage.warning("请重新登录")
 service.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token")
            ? localStorage.getItem("token")
            : "";
        config.headers["Authorization"] = "Bearer " + token;
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            if (response.status) {
                switch (response.status) {
                    // 401: 未登录
                    // 未登录则跳转登录页面，并携带当前页面的路径
                    // 在登录成功后返回当前页面，这一步需要在登录页操作。
                    case 401:
                        router.push("/login")
                        ElMessage.warning("请重新登录")
                        break;
                    case 403:
                        ElMessage.warning("登录过期，请重新登录")
                        router.push("/login")
                        break;
        
                    // 404请求不存在
                    case 404:
                        ElMessage.warning("网络请求不存在")
                        break;
                    // 其他错误，直接抛出错误提示
                    default:
                        ElMessage.warning("请求失败")
                }
            }
        }
    },
    error => {
        ElMessage.warning(error)
        return Promise.reject();
    }
);

export default service;
