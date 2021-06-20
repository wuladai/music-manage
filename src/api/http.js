import axios from 'axios';
axios.defaults.timeout = 5000; //超时时间5秒
axios.defaults.withCredentials = true; //允许跨域
/**
 * 响应头
 */
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
/**
 * 基础url
 */
axios.defaults.baseURL = "http://localhost:8888"
/**
 * 相应拦截器
 */
axios.interceptors.response.use(
  response => {
    //如果response里面的status是200，说明访问接口访问到了，否则错误
    if(response.status == 200){
      return Promise.resolve(response); // Promise: 异步执行框架  Promise.resolve(response): 让程序正常继续返回执行
    }else {
      return Promise.reject(response);  //程序不会继续往下执行
    }
  },
  error => {
    if(error.response.status){
      switch (error.response.status) {
        // 未登录
        case 401:
          // 重定向
          router.replace({
            path: '/',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
          break;

        // 未找到
        case 404:
          break;
      }
      return Promise.reject(error.response);
    }
  }
);

/**
 * 封装get方法
 */
export function get(url, params={}){
  // new Promise(): 让其异步访问，有两种情况
  return new Promise((resolve, reject) => {
    axios.get(url, {params: params})
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            reject(err);
          })
  });
}

/**
 * 封装post方法
 */
export function post(url, data={}){
  // new Promise(): 让其异步访问，有两种情况
  return new Promise((resolve, reject) => {
    axios.post(url, data)
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            reject(err);
          })
  });
}




















