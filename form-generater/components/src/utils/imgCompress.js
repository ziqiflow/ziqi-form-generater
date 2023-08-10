
//https://blog.csdn.net/qq_23244029/article/details/124709292
export const imgCompress =async function(file) {
    // 将文件转img对象
    const img = await fileToImg(file)
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      // 获取文件宽高比例
      const { width: originWidth, height: originHeight } = img

      let minWidth=800;
      let minHeight=800;

      //是否需要压缩
      
      if(originWidth<=minWidth){
        //按原始尺寸
        resolve(file)
        return 
      }
      if(originHeight<=minHeight){
        //按原始尺寸
        resolve(file)
        return 
      }
       // 自定义等比例缩放宽高属性，这里我用的是固定800宽度，高度是等比例缩放
       const scale = +(originWidth / originHeight).toFixed(2) // 比例取小数点后两位)
       let targetWidth=null;
       let targetHeight=null;
      if(originHeight>originWidth){
            targetWidth = minWidth // 固定宽
            targetHeight = Math.round(targetWidth / scale) // 等比例缩放高
      }else{
            targetHeight = minHeight // 固定宽
            targetWidth = Math.round(targetHeight * scale) // 等比例缩放高
      }
      canvas.width = targetWidth
      canvas.height = targetHeight

      context.clearRect(0, 0, targetWidth, targetHeight)
      // canvas重新绘制图片
      context.drawImage(img, 0, 0, targetWidth, targetHeight)
      // canvas转二进制对象转文件对象，返回
      const type = 'image/png'
      canvas.toBlob(function (blob) {
        const f = new File([blob], file.name, {
          type,
          lastModified: file.lastModified
        })
        resolve(f)
      }, type)
    })
  };
   
  // file转换成img对象
  export const   fileToImg = async function  (file) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()
      reader.onload = function (e) {
        img.src = e.target.result
      }
      reader.onerror = function (e) {
        reject(e)
      }
      reader.readAsDataURL(file)
      img.onload = function () {
        resolve(img)
      }
      img.onerror = function (e) {
        reject(e)
      }
    })
  };




  //https://blog.csdn.net/rudy_zhou/article/details/117434725
  //没有用上
  // 图片base64数据获取
  export const photoCompress = (file, compressedOption, callback) => {
    let fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      let fileResult = fileReader.result
      canvasDataURL(fileResult, compressedOption, callback)
    }
  }

// 图片渲染至画布 并获取指定质量图片
export  const canvasDataURL = (path, compressedOption, callback) => {
    let img = new Image()
    img.src = path
    img.onload = () => {
      // 设置压缩后图片规格
      let quality = compressedOption.quality
      let w = compressedOption.width || img.width

      // 判断只存在宽度时，根据比例设置高度
      let h = compressedOption.height || (compressedOption.width ? compressedOption.width / (img.width / img.height) : '') || img.height

      // 生成canvas
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')

      // 设置宽高并渲染图片
      canvas.width = w
      canvas.height = h
      ctx.drawImage(img, 0, 0, w, h)

      let base64 = canvas.toDataURL('image/jpeg', quality)
      // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL

      // 回调函数返回base64的值
      callback(base64)
    }
  }

// 图片转码处理
export  const convertBase64UrlToFile = (urlData, filename) => {
    let arr = urlData.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]

    let bstr = atob(arr[1])
    // https://www.runoob.com/jsref/met-win-atob.html
    let n = bstr.length

    let u8arr = new Uint8Array(n)
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    }

    // return new Blob([u8arr], { type: mime })
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Blob

    return new File([u8arr], filename, { type: mime })
    // https://developer.mozilla.org/zh-CN/docs/Web/API/File
  }