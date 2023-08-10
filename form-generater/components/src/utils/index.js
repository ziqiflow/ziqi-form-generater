/**
 * Created by PanJiaChen on 16/11/18.
 */

import store from '@/store'
import {
  checkPermission2
} from '@/utils/permission'


export function changeGutter(list) {

  for (let i = 0; i < list.length; i++) {
    const ele = list[i];
    if (ele.type == 'grid' && !!ele.columns) {
      ele.options.gutter = 10;
      // console.log('gutter',ele.options.gutter);
      if (ele.columns.length) {
        for (let k = 0; k < ele.columns.length; k++) {
          const elek = ele.columns[k];
          if (elek.list.length) {
            changeGutter(elek.list)
          }
        }
      }
    }
  }

  return null;
}


export function screenType() {
  // var screen_width = window.screen.width;
  let width=window.document.body.clientWidth

  if (width < 768) {
    return 'mobile'
  }
  if (width < 992) {
    return 'pad'
  }
  return 'pc'
}

export function WidgetFormInit(WidgetForm) {

  let type = screenType()

  if (type == 'pc') {
    return;
  }
  changeGutter(WidgetForm.list)

  if (type == 'mobile') {
    WidgetForm.config = Object.assign(WidgetForm.config, WidgetForm.config.xs_config);
  } else {
    WidgetForm.config = Object.assign(WidgetForm.config, WidgetForm.config.sm_config);
  }

}

export function ifperm(needroles) {

  const roles = store.getters && store.getters.roles


  if (needroles && needroles instanceof Array) {
    if (needroles.length > 0) {
      const permissionRoles = needroles

      let hasPermission = permissionRoles.some(permission => {
        return checkPermission2(permission, roles)
      })
      // if(roles.some(role => {
      //   return ['super_admin'].includes(role)
      // }))

      return hasPermission;


    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }


}




/**
 * http://localhost:8099/dingtalk/index.html?arch=2019_allz_dc9d4696#/flowadmin/5cda28a5f93f8379b3367de2?abxujin=mojapa
 */
//返回数据
// afterh: "#/flowadmin/5cda28a5f93f8379b3367de2?abxujin=mojapa"
// beforeask: "http://localhost:8099/dingtalk/index.html"
// query: {arch: '2019_allz_dc9d4696'}
export function parseurl(url) {

  let query = {};
  let beforeask = '';
  let afterh = '';
  let paramsstr = '';
  if (url.indexOf('?') == -1) {
    //不存在？ 

    if (url.indexOf('#') == -1) {
      afterh = '';
      beforeask = url;
    } else {
      beforeask = url.substring(0, url.indexOf('#'));
      afterh = url.substring(url.indexOf('#')); //#/flowadmin/5cda28a5f93f8379b3367de2?abxujin=mojapa
    }


  } else {
    //存在？  
    beforeask = url.substring(0, url.indexOf('?'))
    afterh = '';
    if (url.indexOf('#') == -1) {
      //beforeask=url;
      //paramsstr='';
      paramsstr = url.substring(url.indexOf('?') + 1)
    } else {
      if (url.indexOf('#') < url.indexOf('?')) {
        beforeask = url.substring(0, url.indexOf('#'));
        afterh = url.substring(url.indexOf('#'));
      } else {
        paramsstr = url.substring(url.indexOf('?') + 1, url.indexOf('#'))
        afterh = url.substring(url.indexOf('#'));
      }

    }

  }

  let strs = [];

  if (!!paramsstr) {
    strs = paramsstr.split("&");
  }
  for (var i = 0; i < strs.length; i++) {
    let arr = strs[i].split("=");
    query[arr[0]] = unescape(arr[1]);
  }
  return {
    query,
    beforeask,
    afterh,
  }
}
export function urlWithGlobalParams(url) {


  let {
    query,
    beforeask,
    afterh
  } = parseurl(url);
  let {
    query2,
    beforeask2,
    afterh2
  } = parseurl(window.location.href);

  // Object.assign(query,query2)
  let GlobalValueKeys = ['arch'];
  for (let key2 in query2) {
    if (GlobalValueKeys.indexOf(key2) != -1) {
      query[key2] = query2[key2]
    }
  }

  let strarr = [];
  for (let key in query) {
    strarr.push(key + '=' + query[key]);
  }
  let str = strarr.join('&');
  return beforeask + (str ? ('?' + str) : '') + afterh;












}



/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}




export const loadJs = (url) => {

  return new Promise((resolve, reject) => {
    //检查是否有存在的地址如果有的话，那么就不能创建

    let scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));

    if (scripts.some(e => {
        return e.src == url
      })) {
      resolve()
      return;
    }
    const script = document.createElement('script')
    script.src = url
    script.type = 'text/javascript'
    document.body.appendChild(script)
    script.onload = () => {

      console.log('loadjs', resolve)
      resolve()


    }
  })
}

export const loadCss = (url) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)
    link.onload = () => {
      resolve()
    }
  })
}








export const getSrcUrl=(url)=>{
  if (/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
             return url;
  }else{
      return window.baseURL+url
  }
}

export const setTinymceContent=(content)=>{

let regexp1 = new RegExp(/(\<img )([^>]*)(\>)/, 'g');
content = content.replace(regexp1, (match, p1, p2, p3)=>{

 let arr = p2.match(/([^\s]*)=\"([^\s]*)\"/g)

 let attr = {};

 arr.forEach(e => {
     let arr2 = /([^\s]*)=\"([^\s]*)\"/.exec(e)
     if (arr2.length == 3) {
         attr[arr2[1]] = arr2[2];
     }
 })

 console.log('图片参数：', attr)

 let inline_text = '';
 //如果src存在 同时 源地址也存在，那么不会设置src
 for (let key in attr) {
     if (key == 'src') {
         if (!!arr['data-o-url']) {
             continue;
         }
     }
     const ele = attr[key];
     inline_text += ` ${key}="${ele}" `
 }
 if (!!attr['data-o-url']) {
     if (!!attr['data-imgid']) { //站内图片的标志
         inline_text += ` src="`+getSrcUrl(attr['data-o-url'])+`?x-process=style.readable" `
     } else {
         inline_text += ` src="`+getSrcUrl(attr['data-o-url'])+'" '
     }

 }

 return p1 + inline_text + p3;
});

// return content;
//把content替换成
console.log('setTinymceContent', content)
return content;
}



//全局formEditLimit和局部的结合
export const extend_global_formEditLimit=(nowfun,global)=>{

  console.log('nowfun',nowfun)
  console.log('global',global)

  let nowset= !!global?deepClone(global):[];

  nowfun.forEach(e=>{

      let findindex= nowset.findIndex(c=>{
          return e.key==c.key
      })

      if(findindex==-1){
          //没有查询到,插入
          nowset.push(deepClone(e));
      }else{
          //查询到了。如果是
          if(e.t=='table'){
              let globaltype=nowset[findindex].type;
              let nowtablelist=extend_global_formEditLimit(e.son,nowset[findindex].son)
              nowset[findindex]=deepClone(e);
              nowset[findindex].son=nowtablelist;
              if(!e.type){
                  //没有选择任何模式的情况下:
                  nowset[findindex].type=globaltype;
              }
          }else{
              let globaltype=nowset[findindex].type;
              nowset[findindex]=deepClone(e);
              if(!e.type){
                  //没有选择任何模式的情况下:
                  nowset[findindex].type=globaltype;
              }                      
          }
              
      }
  })


  console.log('nowset',nowset)

  nowset.forEach(e=>{
      // if(e.t=='table'){
          if(!e.type){
              //对于全局和局部都没有设置的情况下，均设置成readonly
              e.type='readonly'
          }
      // }
  })

  return nowset;





}