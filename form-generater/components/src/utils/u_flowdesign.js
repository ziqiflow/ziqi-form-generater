export const getrequireDataList = (widgetForm) => {
  let requireDataList = []
  if (widgetForm.list) {
    requireDataList = finddatalist(widgetForm.list)
  }
  return requireDataList
}
//递归用的
export const RecursiveFormList = (list, callback) => {
  for (let i = 0; i < list.length; i++) {
    const ele = list[i];
    if (ele.type == 'grid' && !!ele.columns) {
      if (ele.columns.length) {
        for (let k = 0; k < ele.columns.length; k++) {
          const elek = ele.columns[k];
          if (elek.list.length) {
            RecursiveFormList(elek.list, callback)
          }
        }
      }
    } else {
      callback(ele)
    }
  }
  return null;
}
//[vue-form-marking data 相关]
export const getFormItemByKey = (list, key) => {

  for (let i = 0; i < list.length; i++) {
    const ele = list[i];
    // console.log('ele',ele);
    if (ele.type == 'grid' && !!ele.columns) {
      if (ele.columns.length) {
        for (let k = 0; k < ele.columns.length; k++) {
          const elek = ele.columns[k];
          if (elek.list.length) {
            let back = getFormItemByKey(elek.list, key)
            if (!!back) return back;
          }
        }
      }
    } else {
      //console.log({ name: ele.name, key: ele.key, model: ele.model, index: ele.keyindex})
      //ele.key==
      if (ele.key == key) {
        return ele;
      }

    }
  }

  return null;
}

//[vue-form-marking data 相关]
export const finddatalist = (list) => {
  let datalist = []
  // console.log('list',list);
  for (let i = 0; i < list.length; i++) {
    const ele = list[i];
    // console.log('ele',ele);
    if (ele.type == 'grid' && !!ele.columns) {
      if (ele.columns.length) {
        for (let k = 0; k < ele.columns.length; k++) {
          const elek = ele.columns[k];
          if (elek.list.length) {
            datalist = datalist.concat(finddatalist(elek.list))
          }
        }
      }
    } else {
      //console.log({ name: ele.name, key: ele.key, model: ele.model, index: ele.keyindex})

      //这个根据填写的数据
      let type = ele.type;

      //if(type=='placeholderhtml')continue;


      if (!!ele.options.componentName) {
        type = ele.options.componentName;
      }

      // if(ele.type=='select'){
      // }

      datalist.push({
        name: ele.name,
        key: ele.key,
        model: ele.model,
        index: ele.keyindex,
        type: type
      })
    }

  }
  return datalist
}

export const tranResultData = (result, datalist) => {}



export const initFormSetItem = (item) => {



  if (!item.rules) item.rules = [];

  //item.options.defaultValue;
  //检查默认值有没有存在，如果不存在的话，那么就删除
  if (Object.keys(item.options).indexOf('options') >= 0 && item.options.remote == false) {

    let vallist = item.options.options.map(v => {
      return v.value;
    })


    console.log(item.name);
    if (!!item.options.defaultValue) {
      if (item.options.defaultValue.constructor == Array) {
        for (let k = item.options.defaultValue.length - 1; k >= 0; k--) {
          const ele = item.options.defaultValue[k];
          if (!vallist.some(v => {
              return v == ele
            })) {
            item.options.defaultValue.splice(k, 1);
          }
        }
      }

      if (item.options.defaultValue.constructor == String) {
        if (!vallist.some(v => {
            return v == item.options.defaultValue
          })) {
          item.options.defaultValue = null
        }
      }
    }
  }

  //  console.log('调整后的表单设置',item);


}

export const tran_msgstatus = (status) => {

  const statuslist = [{
      n: '待处理',
      v: 1
    },
    {
      n: '取消',
      v: 2
    },
    {
      n: '撤回',
      v: 8
    },
    {
      n: '处理结束',
      v: 3
    },
    {
      n: '或签结束',
      v: 4
    },
    {
      n: '消息模式',
      v: 5
    },
    {
      n: '抄送模式',
      v: 6
    },
    {
      n: '结束s',
      v: 7
    }
  ]
  for (let i = 0; i < statuslist.length; i++) {
    const element = statuslist[i]
    if (element.v == status) {
      return element.n
    }
  }
  return '无'

}

export const arch_interval_type_options = [{
    v: 'month',
    n: '按月'
  },
  {
    v: 'quarterly',
    n: '按季度'
  },
  {
    v: 'year',
    n: '按年'
  },
]
export const arch_data_before_options = [{
  v: '3months',
  n: '3个月'
}, {
  v: '9months',
  n: '9个月'
}, {
  v: '1year',
  n: '1年'
}, {
  v: '2years',
  n: '2年'
}, {
  v: '3years',
  n: '3年'
}, {
  v: '4years',
  n: '4年'
}];


export const tran_dealtype = (dealtype) => {
  const dealtypelist = [{
      n: '通知',
      v: 'message'
    },
    {
      n: '会签',
      v: 'andsign'
    },
    {
      n: '或签',
      v: 'orsign'
    }, {
      n: '事件',
      v: 'event'
    }
  ]
  for (let i = 0; i < dealtypelist.length; i++) {
    const element = dealtypelist[i]
    if (element.v == dealtype) {
      return element.n
    }
  }
  return '无'
}

//主逻辑和下面的creatDiagramData一致
export const autoCreatLinkDescList = (funlist) => {

  //根据funlist生成
  // linkDescList 数据格式：[from to desc u_id:更新者]
  //生成后，对人工编辑的的数据保留；

  let linkDataArray = [];

  const add_funid_for_event = function (fun) {


    fun.event_set.maybe_fun_list.forEach(e => {

      e.funids.forEach(funid => {
        linkDataArray.push({
          from: fun.id,
          to: funid,
          desc: e.showName
        })
      })


    })


  }

  const add_funid = function (funid, fun, desc) {
    if (funid) {
      let idlist = null
      if (typeof funid === 'object') {
        idlist = funid
      } else {
        idlist = [funid]
      }
      idlist.forEach(id => {
        if (id) {
          linkDataArray.push({
            from: fun.id,
            to: id,
            desc: desc
          })
        }
      })
    }
  }

  const add_sonfunid = function (funid, fun, desc) {
    if (funid) {
      let idlist = null
      if (typeof funid === 'object') {
        idlist = funid
      } else {
        idlist = [funid]
      }
      idlist.forEach(ele => {
        if (ele.v) {
          linkDataArray.push({
            from: fun.id,
            to: ele.v,
            desc: desc
          })

        }
      })
    }
  }


  for (let i = 0; i < funlist.length; i++) {
    const fun = funlist[i]

    // 读取btn按键。然后依次解析
    if (!fun.is_start && fun.dealtype == 'message') { //不是第一步同时是消息类型
      // 通知模式无一个环节
      // 默认is_start 写的也是通知模式；
      continue
    } else if (fun.dealtype == 'event') {
      //如果是事件节点的话；
      add_funid_for_event(fun)

    } else {
      //剩下的全部是有btngroup的情况
      for (let k = 0; k < fun.btnGroup.length; k++) {
        const btn = fun.btnGroup[k]

        if (fun.dealtype == 'andsign' && k != 0) {
          // 会签只取第一个button;
          break
        }

        add_funid(btn.defaultFunId, fun, `<${btn.name}>后 默认走`)

        add_sonfunid(btn.defaultSonFlowId, fun, `<${btn.name}>后 默认走`)

        if (!!btn.handler && !!btn.handler.funId) {
          add_funid(btn.handler.funId, fun, `<${btn.name}>后 触发走`)
        }

        if (!!btn.handler && !!btn.handler.SonFlowId) {
          add_sonfunid(btn.handler.SonFlowId, fun, `<${btn.name}>后 触发走`)
        }

        var replace_D=function(str){
          if(!str){
            return ''
          }
          return str.replace(/_\d+/g,'');
        }

        btn.NextFun.forEach(NextFun => {
          if (NextFun.funId) {
            if(!!NextFun.name){
              add_funid(NextFun.funId, fun, NextFun.name)
            }else{
              add_funid(NextFun.funId, fun, `<${btn.name}>后，条件为 ${replace_D(NextFun.if)}`)
            }
          }

          if (NextFun.SonFlowId) {
            if(!!NextFun.name){
              add_sonfunid(NextFun.SonFlowId, fun,  NextFun.name)
            }else{
              add_sonfunid(NextFun.SonFlowId, fun, `<${btn.name}>后，条件为 ${replace_D(NextFun.if)}`)
            }
           
          }
        })
      }
    }
  }
  console.log('linkDataArray', linkDataArray)
  return linkDataArray;
}

// 此函数还有php端的，如果此处修改，php也要修改
export const creatDiagramDataOld = (funlist, layoutset = [], nowfunid = null,
  //isVertical=false//是否垂直
) => {

  const getloc = function (key) {

    for (let l = 0; l < layoutset.length; l++) {
      const ele = layoutset[l];
      if (ele.key == key) {
        console.log('ele.loc', ele.loc);
        // if(isVertical){
        //   let arr= ele.loc.split(' ');
        //   return arr[1]+' '+arr[0];
        // }
        return ele.loc;
      }
    }
    return '0 100'

  }
  console.log('nowfunid', nowfunid);

  const nodeDataArray = []
  const linkDataArray = []
  const hasInNodeData = function (nodeDataArray, key) {
    for (let k = 0; k < nodeDataArray.length; k++) {
      const arr = nodeDataArray[k]
      if (arr.key == key) {
        return true
      }
    }
    return false
  }

  const add_funid_for_event = function (fun) {


    fun.event_set.maybe_fun_list.forEach(e => {

      e.funids.forEach(funid => {
        linkDataArray.push({
          from: fun.id,
          to: funid
        })
      })


    })


  }

  const add_funid = function (funid, fun) {
    if (funid) {
      let idlist = null
      if (typeof funid === 'object') {
        idlist = funid
      } else {
        idlist = [funid]
      }
      idlist.forEach(id => {
        if (id) {
          linkDataArray.push({
            from: fun.id,
            to: id,
            "category": "Motion",
            "text": "will change here in 2 months"
          })
        }
      })
    }
  }

  const add_sonfunid = function (funid, fun) {
    if (funid) {
      let idlist = null
      if (typeof funid === 'object') {
        idlist = funid
      } else {
        idlist = [funid]
      }
      idlist.forEach(ele => {
        if (ele.v) {
          linkDataArray.push({
            from: fun.id,
            to: ele.v,
            "category": "Motion",
            "text": "will change here in 2 months"
          })

          if (!hasInNodeData(nodeDataArray, ele.v)) {
            nodeDataArray.push({
              loc: getloc(ele.v),
              key: ele.v,
              text: '【外部流程】' + ele.n,
              color: '#515a6e',
              stroke: 'white'
              // fill: "white"
            })
          }
        }
      })
    }
  }

  for (let i = 0; i < funlist.length; i++) {
    const fun = funlist[i]

    let color = 'lightblue';

    if (nowfunid == fun.id) {
      color = '#f704c2';
    } else if (fun.is_start) {
      color = 'orange';
    } else if (fun.dealtype == 'event') {
      color = 'yellow';
    }


    nodeDataArray.push({
      loc: getloc(fun.id),
      key: fun.id,
      stroke: (nowfunid == fun.id ? 'white' : 'black'),
      text: fun.name + (fun.is_start ? '' : '(' + tran_dealtype(fun.dealtype) + ')') + (nowfunid == fun.id ? '[当前位置]' : ''),
      color: color
    })
    // 读取btn按键。然后依次解析
    if (!fun.is_start && fun.dealtype == 'message') { //不是第一步同时是消息类型
      // 通知模式无一个环节
      // 默认is_start 写的也是通知模式；
      continue
    } else if (fun.dealtype == 'event') {
      //如果是事件节点的话；
      add_funid_for_event(fun)

    } else {
      //剩下的全部是有btngroup的情况
      for (let k = 0; k < fun.btnGroup.length; k++) {
        const btn = fun.btnGroup[k]

        if (fun.dealtype == 'andsign' && k != 0) {
          // 会签只取第一个button;
          break
        }

        add_funid(btn.defaultFunId, fun)

        /*       if (!!btn.defaultFunId) {
                  let idlist = null
                  if (typeof btn.defaultFunId === 'object') {
                      idlist = btn.defaultFunId
                  } else {
                      idlist = [btn.defaultFunId]
                  }
                  idlist.forEach(id => {
                      if (id) {
                          linkDataArray.push({
                              from: fun.id,
                              to: id
                          })
                      }
                  })
              } */

        add_sonfunid(btn.defaultSonFlowId, fun)

        /*  if (!!btn.defaultSonFlowId) {
             let idlist = null
             if (typeof btn.defaultSonFlowId === 'object') {
                 idlist = btn.defaultSonFlowId
             } else {
                 idlist = [btn.defaultSonFlowId]
             }
             idlist.forEach(ele => {
                 if (ele.v) {
                     linkDataArray.push({
                         from: fun.id,
                         to: ele.v
                     })

                     if(!hasInNodeData(nodeDataArray,ele.v)){
                         nodeDataArray.push({
                             key: ele.v,
                             text: ele.n+'(外部流程)',
                             color: '#515a6e'
                         })
                     }

                 }

             })
         } */

        console.log(btn.handler)

        if (!!btn.handler && !!btn.handler.funId) {
          add_funid(btn.handler.funId, fun)
          /*         let idlist = null
                  if (typeof btn.handler.funId === 'object') {
                      idlist = btn.handler.funId
                  } else {
                      idlist = [btn.handler.funId]
                  }
                  idlist.forEach(id => {
                      if (id) {
                          linkDataArray.push({
                              from: fun.id,
                              to: id
                          })
                      }
                  }) */
        }

        if (!!btn.handler && !!btn.handler.SonFlowId) {
          add_sonfunid(btn.handler.SonFlowId, fun)
          /*  let idlist = null
           if (typeof btn.handler.SonFlowId === 'object') {
               idlist = btn.handler.SonFlowId
           } else {
               idlist = [btn.handler.SonFlowId]
           }
           idlist.forEach(ele => {
               if (ele.v) {
                   linkDataArray.push({
                       from: fun.id,
                       to: ele.v
                   })

                   if(!hasInNodeData(nodeDataArray,ele.v)){
                       nodeDataArray.push({
                           key: ele.v,
                           text: ele.n+'(外部流程)',
                           color: '#515a6e'
                       })
                   }
               }
           }) */
        }

        btn.NextFun.forEach(NextFun => {
          if (NextFun.funId) {
            add_funid(NextFun.funId, fun)
            /*  let idlist = null
             if (typeof NextFun.funId === 'object') {
                 idlist = NextFun.funId
             } else {
                 idlist = [NextFun.funId]
             }
             idlist.forEach(id => {
                 if (id) {
                     linkDataArray.push({
                         from: fun.id,
                         to: id
                     })
                 }
             }) */
          }

          if (NextFun.SonFlowId) {
            add_sonfunid(NextFun.SonFlowId, fun)
            /*  let idlist = null
             if (typeof NextFun.SonFlowId === 'object') {
                 idlist = NextFun.SonFlowId
             } else {
                 idlist = [NextFun.SonFlowId]
             }
             idlist.forEach(ele => {
                 if (ele.v) {
                     linkDataArray.push({
                         from: fun.id,
                         to: ele.v
                     })

                     if(!hasInNodeData(nodeDataArray,ele.v)){
                         nodeDataArray.push({
                             key: ele.v,
                             text: ele.n+'(外部流程)',
                             color: '#515a6e'
                         })
                     }
                 }
             }) */
          }
        })
      }
    }
  }

  // console.log('linkdataarray',linkDataArray)
  return {
    linkDataArray,
    nodeDataArray
  }
}

// 此函数还有php端的，如果此处修改，php也要修改
export const creatDiagramData = (funlist, layoutset = [], linkDescList = [], hideremark = false, nowfunid = null,
  //isVertical=false//是否垂直
) => {


  console.log('layoutset',JSON.stringify(layoutset))
  console.log('linkDescList', linkDescList);

  const getloc_remark = function (key,key_comment) {

    for (let l = 0; l < layoutset.length; l++) {
      const ele = layoutset[l];
      if (ele.key == key_comment) {
        return ele.loc;
      }
    }

    let str= getloc(key);
    let arr= str.split(' ');
    console.log('getloc_remark',arr)
    return (Number(arr[0])-200)+' '+(Number(arr[1])+50);

  }

  const getloc = function (key) {

    for (let l = 0; l < layoutset.length; l++) {
      const ele = layoutset[l];
      if (ele.key == key) {
        console.log('ele.loc', ele.loc);
        // if(isVertical){
        //   let arr= ele.loc.split(' ');
        //   return arr[1]+' '+arr[0];
        // }
        return ele.loc;
      }
    }
    return '0 100'

  }
  console.log('nowfunid', nowfunid);

  const nodeDataArray = []
  const linkDataArray = []
  const hasInNodeData = function (nodeDataArray, key) {
    for (let k = 0; k < nodeDataArray.length; k++) {
      const arr = nodeDataArray[k]
      if (arr.key == key) {
        return true
      }
    }
    return false
  }

  const find_desc = function (from, to) {
    for (let k = 0; k < linkDescList.length; k++) {
      const ele = linkDescList[k];
      if (ele.from == from && ele.to == to) {
        return ele.desc;
      }
    }
    return '';
  }

  const add_funid_for_event = function (fun) {


    fun.event_set.maybe_fun_list.forEach(e => {

      e.funids.forEach(funid => {
        linkDataArray.push({
          from: fun.id,
          to: funid,
          text: find_desc(fun.id, funid)
        })
      })


    })


  }

  const add_funid = function (funid, fun) {
    if (funid) {
      let idlist = null
      if (typeof funid === 'object') {
        idlist = funid
      } else {
        idlist = [funid]
      }
      idlist.forEach(id => {
        if (id) {
          linkDataArray.push({
            from: fun.id,
            to: id,
            text: find_desc(fun.id, id)
          })
        }
      })
    }
  }

  const add_sonfunid = function (funid, fun) {
    if (funid) {
      let idlist = null
      if (typeof funid === 'object') {
        idlist = funid
      } else {
        idlist = [funid]
      }
      idlist.forEach(ele => {
        if (ele.v) {
          linkDataArray.push({
            from: fun.id,
            to: ele.v,
            text: find_desc(fun.id, ele.v)
          })

          if (!hasInNodeData(nodeDataArray, ele.v)) {
            nodeDataArray.push({
              loc: getloc(ele.v),
              key: ele.v,
              text: '【外部流程】' + ele.n,
              color: '#515a6e',
              stroke: 'white',
              contents:[],
              // fill: "white"
            })
          }
        }
      })
    }
  }

  for (let i = 0; i < funlist.length; i++) {
    const fun = funlist[i]

    let color = 'lightblue';

    if (nowfunid == fun.id) {
      color = '#f704c2';
    } else if (fun.is_start) {
      color = 'orange';
    } else if (fun.dealtype == 'event') {
      color = 'yellow';
    }

    let contents=[];

    
    if(fun.dealtype!='event'){

    contents=(fun.dealers.length>0&&!fun.is_start)?[{name:'接收人：'}].concat(fun.dealers.map(e=>{return {name:'    +'+e.name}})):[];
    

    contents=contents.concat((fun.cc.length>0&&!fun.is_start)?[{name:'抄送人：'}].concat(fun.cc.map(e=>{return {name:'    +'+e.name}})):[]);

    contents=contents.concat(fun.is_start?[{name:'创建人：'}].concat(fun.creatPermission.map(e=>{return {name:'    +'+(!!e.name?e.name:'全公司')}})):[]);
    

    if (fun.is_start ||(fun.dealtype=='orsign'||fun.dealtype=='andsign')) { //不是第一步同时是消息类型

      let btns_string= fun.btnGroup.map(e=>{
        return "<"+e.name+">"
      }).join('|');

      if(btns_string){
        contents=contents.concat([{name:'按键组：'},{name:btns_string}])
      }

    }

    contents.forEach((e,index)=>{
      if(['接收人：','创建人：','抄送人：','按键组：'].indexOf(e.name)>-1){
        e.ishead=true;
        e.isitem=false;
        //表示查询到了
        if(!!contents[index-1]){
          contents[index-1].addline=true;
        }
      }else{
        e.ishead=false;
        e.isitem=true;
      }
      e.addline=false;
    })

    }



    nodeDataArray.push({
      loc: getloc(fun.id),
      key: fun.id,
      stroke: ((nowfunid == fun.id) ? 'white' : 'black'),
      text: fun.name + (fun.is_start ? '' : '(' + tran_dealtype(fun.dealtype) + ')') + (nowfunid == fun.id ? '[当前位置]' : ''),
      contents:contents,
      color: color
    })
    // 读取btn按键。然后依次解析
    if (!fun.is_start && fun.dealtype == 'message') { //不是第一步同时是消息类型
      // 通知模式无一个环节
      // 默认is_start 写的也是通知模式；
      continue
    } else if (fun.dealtype == 'event') {
      //如果是事件节点的话；
      add_funid_for_event(fun)

    } else {
      //剩下的全部是有btngroup的情况
      for (let k = 0; k < fun.btnGroup.length; k++) {
        const btn = fun.btnGroup[k]

        if (fun.dealtype == 'andsign' && k != 0) {
          // 会签只取第一个button;
          break
        }

        add_funid(btn.defaultFunId, fun)

        /*       if (!!btn.defaultFunId) {
                  let idlist = null
                  if (typeof btn.defaultFunId === 'object') {
                      idlist = btn.defaultFunId
                  } else {
                      idlist = [btn.defaultFunId]
                  }
                  idlist.forEach(id => {
                      if (id) {
                          linkDataArray.push({
                              from: fun.id,
                              to: id
                          })
                      }
                  })
              } */

        add_sonfunid(btn.defaultSonFlowId, fun)

        /*  if (!!btn.defaultSonFlowId) {
             let idlist = null
             if (typeof btn.defaultSonFlowId === 'object') {
                 idlist = btn.defaultSonFlowId
             } else {
                 idlist = [btn.defaultSonFlowId]
             }
             idlist.forEach(ele => {
                 if (ele.v) {
                     linkDataArray.push({
                         from: fun.id,
                         to: ele.v
                     })

                     if(!hasInNodeData(nodeDataArray,ele.v)){
                         nodeDataArray.push({
                             key: ele.v,
                             text: ele.n+'(外部流程)',
                             color: '#515a6e'
                         })
                     }

                 }

             })
         } */

        console.log(btn.handler)

        if (!!btn.handler && !!btn.handler.funId) {
          add_funid(btn.handler.funId, fun)
          /*         let idlist = null
                  if (typeof btn.handler.funId === 'object') {
                      idlist = btn.handler.funId
                  } else {
                      idlist = [btn.handler.funId]
                  }
                  idlist.forEach(id => {
                      if (id) {
                          linkDataArray.push({
                              from: fun.id,
                              to: id
                          })
                      }
                  }) */
        }

        if (!!btn.handler && !!btn.handler.SonFlowId) {
          add_sonfunid(btn.handler.SonFlowId, fun)
          /*  let idlist = null
           if (typeof btn.handler.SonFlowId === 'object') {
               idlist = btn.handler.SonFlowId
           } else {
               idlist = [btn.handler.SonFlowId]
           }
           idlist.forEach(ele => {
               if (ele.v) {
                   linkDataArray.push({
                       from: fun.id,
                       to: ele.v
                   })

                   if(!hasInNodeData(nodeDataArray,ele.v)){
                       nodeDataArray.push({
                           key: ele.v,
                           text: ele.n+'(外部流程)',
                           color: '#515a6e'
                       })
                   }
               }
           }) */
        }

        btn.NextFun.forEach(NextFun => {
          if (NextFun.funId) {
            add_funid(NextFun.funId, fun)
            /*  let idlist = null
             if (typeof NextFun.funId === 'object') {
                 idlist = NextFun.funId
             } else {
                 idlist = [NextFun.funId]
             }
             idlist.forEach(id => {
                 if (id) {
                     linkDataArray.push({
                         from: fun.id,
                         to: id
                     })
                 }
             }) */
          }

          if (NextFun.SonFlowId) {
            add_sonfunid(NextFun.SonFlowId, fun)
            /*  let idlist = null
             if (typeof NextFun.SonFlowId === 'object') {
                 idlist = NextFun.SonFlowId
             } else {
                 idlist = [NextFun.SonFlowId]
             }
             idlist.forEach(ele => {
                 if (ele.v) {
                     linkDataArray.push({
                         from: fun.id,
                         to: ele.v
                     })

                     if(!hasInNodeData(nodeDataArray,ele.v)){
                         nodeDataArray.push({
                             key: ele.v,
                             text: ele.n+'(外部流程)',
                             color: '#515a6e'
                         })
                     }
                 }
             }) */
          }
        })
      }
    }
  }

  if (!hideremark) {


    //新增加的针对备注栏目的
    for (let i = 0; i < funlist.length; i++) {
      let fun = funlist[i];
      if (!fun.desc) {
        continue
      }
      let key = fun.id + '_comment';
      nodeDataArray.push({
        loc: getloc_remark(fun.id,key),
        key: key,
        text: fun.desc,
        category: "Comment"
      })
      linkDataArray.push({
        from: key,
        to: fun.id,
        category: "Comment"
      })
    }
  }


  // console.log('linkdataarray',linkDataArray)
  return {
    linkDataArray,
    nodeDataArray
  }
}

/*
 */
export const creatDeptTree = (list, parent_id) => {
  const tree = []
  for (let i = 0; i < list.length; i++) {
    const ele = list[i]
    // ele.title=ele.name;
    ele.expand = true

    if (ele.parent_id == parent_id) {
      // console.log(tree)
      ele.children = creatDeptTree(list, ele._uuid)
      tree.push(ele)
    }
  }
  return tree
}
