import {getWwAppJsapiConf } from '@/api/login'

export function initWWJsConfig(){
    if(window.conf.is_sass&&window.conf.thirdPlatform=='wechatwork'){
        getWwAppJsapiConf({}).then(({data:res})=>{
          let {config,AgentConfig}=res.data  
            
          wx.config(
              config
          );
          wx.ready(function(){
              wx.agentConfig(Object.assign(AgentConfig,{   
                success: function(res) {
                      // 回调
                      console.log('success',res)
                      window.conf.wxagent_res=res;
                  },
                  fail: function(res) {
                    window.conf.wxagent_res=res;
                      console.error('fail',res)
                      if(res.errMsg.indexOf('function not exist') > -1){
                          console.error('版本过低请升级')
                      }
                  }
              }));
          });
          wx.error(function(res){
              console.log('失败');
          });
        })
      }
}