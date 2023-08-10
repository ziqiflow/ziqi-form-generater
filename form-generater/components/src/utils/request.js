import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken,secret } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL:window.baseURL, //process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
  transformResponse: [function (data) {
    // console.log('刚收到',data)
    if (!!data && data.constructor == String) {
      // Do whatever you want to transform the data
      var JSONBigInt = require('json-bigint-string');
      //console.log(JSONBigInt.parse(data));
      return JSONBigInt.parse(data);
    }
    return data;
  }],
})

// request interceptor
service.interceptors.request.use(
  config => {
      // Do something before request is sent
      console.log("12222222222222222222")
      let {encrypt}=window.conf;
      if (store.getters.token) {
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        //config.headers['X-Token'] = getToken()
        // console.log('config',config);
  
  
        if (!config.data) {
          config.data = {}
        }
  
        for (let key in window.env) {
          let e = window.env[key];
  
          // add to headers
          let token = getToken(e.CookieTokenKey);
          if (!!token) {
            config.headers[e.HeaderTokenKey] = token;
            if (!!config.data && config.data.constructor.name == 'FormData') {
              config.data.append(e.postTokenKey, token)
            } else {
              config.data[e.postTokenKey] = token;
            }
          }
        }
  
        if (!!config.data && config.data.constructor.name == 'FormData') {
          config.data.append('_href', window.location.href)
          config.data.append('_version', window.conf.version)
        } else {
          config.data._href = window.location.href
          config.data._version = window.conf.version
        }
        /*
              if(window.envname=='test'&&!!config.canTest){
                config.headers[window.env.test.HeaderTokenKey] = getToken(window.env.test.CookieTokenKey);
              }else{
                if(window.envname=='test'){
                  config.headers[window.env.prod.HeaderTokenKey] = getToken()    
                }else{
                  config.headers[window.env[window.envname].HeaderTokenKey] = getToken(window.env[window.envname].CookieTokenKey) 
                }
              }
        
              if (!config.data) {
                config.data = {}
              }
        
              if(!!config.data&&config.data.constructor.name=='FormData'){
        
                if(window.envname=='test'&&!!config.canTest){
                  config.data.append(window.env.test.postTokenKey,getToken(window.env.test.CookieTokenKey))   
                }else{
        
                  if(window.envname=='test'){
                    config.data.append(window.env.prod.postTokenKey,getToken())   
                  }else{
                    config.data.append(window.env[window.envname].postTokenKey,getToken(window.env[window.envname].CookieTokenKey))   
                  }
                }  
                config.data.append('_href',window.location.href)
        
              }else{
              // config.data._employeetoken = getToken()
              if(window.envname=='test'&&!!config.canTest){
                config.data[window.env.test.postTokenKey]= getToken(window.env.test.CookieTokenKey)   
              }else{
        
              if(window.envname=='test'){
                config.data[window.env.prod.postTokenKey]= getToken()  
              }else{
                config.data[window.env[window.envname].postTokenKey]= getToken(window.env[window.envname].CookieTokenKey)
              }
                
              }  
              config.data._href = window.location.href
            }*/
      }
      // console.log('发送前',   JSON.stringify(config.data));
  
      
  
      // console.log('config',config)
       if(typeof encrypt=='undefined'||encrypt==true){//全局
  
        if(typeof config.encrypt=='undefined'||config.encrypt==true){//局部
  
          if(config.method=='post' && (!config.data||config.data.constructor.name!='FormData')
          // &&!!config.headers
          // &&config.headers['Content-Type'].indexOf('application/json')!=-1
          ){
            //application/json 转换成 text/plain
            config.headers={
              'Content-Type': 'text/plain'
            }
            if(!!config.data){
               if(config.data.constructor==String){
                config.data=secret(config.data,0);
              }else{
                config.data=secret(JSON.stringify(config.data),0);
              }
            }
          }
  
        }
        
      }
  
  
  
      return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  // response => response,
  response => {

    if (response && response.data && Number(response.data.code) == 200) {

      let data = response.data;

      // console.log('解析前，', data.data);
      // console.log('data', data)
      //尝试解密，解密不开的按原数据显示
      try {
        if (!!data.data && data.data.constructor == String) {
          let parseString = secret(data.data, 1);
          if (!!parseString && parseString.constructor == String) {
            // Do whatever you want to transform the data
            var JSONBigInt = require('json-bigint-string');
            //console.log(JSONBigInt.parse(data));
            data.data = JSONBigInt.parse(parseString);
          } else {
            data.data = JSON.parse(parseString);
          }
          // console.log('解析后，', data.data);
        }
      } catch (e) {
        // data.data = parseString;
        console.log(e)
      }
    }
    return response;
  },
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  /*   response => {
      const res = response.data
      if (res.code !== 20000) {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          // 请自行在引入 MessageBox
          // import { Message, MessageBox } from 'element-ui'
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        }
        return Promise.reject('error')
      } else {
        return response.data
      }
    }, */
  error => {
    console.log('err' + error) // for debug
    console.log(error);
    window.last_error = error;
    Message({
      message: !!error.response ? error.response.data.msg : error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
