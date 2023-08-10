import cloneDeep from 'lodash.clonedeep';

export const getnowUserdeptList = (list, type, deptid = '1', deptname = '') => {
  // 用于适配
  const arr = []
  for (let i = 0; i < list.length; i++) {
    const ele = list[i]
    if (ele.deptname) {
      const newobj = {
        label: ele.deptname
      }
      if (type == 'multiple') {
        newobj.id = ele._uuid
      } else {
        newobj.id = null
      }
      if (ele.children) {
        if (ele.children.length > 0) {
          newobj.children = getnowUserdeptList(ele.children, type, ele._uuid, ele.deptname)
        } else {
          continue
        }
      }
      arr.push(newobj)
    }
    if (ele.username) {
      arr.push({
        id: deptid + '__' + ele._uuid,
        label: (deptname ? '<' + deptname + '>' : '') + ele.username
      })
    }
  }
  return arr
}


// 冯旭臣
// 陈仙丹(10009122)
// 徐启杰(10010279)

export const getuserList=(list)=>{
  // 用于适配
  let arr = []
  for (let i = 0; i < list.length; i++) {
      //const titileArr = this.copyobject(titiles)
      const ele = list[i]
      if (!!ele.username) {
          //arr.push(ele.username);
          const newobj = {
              label:
                  // this.intend(titileArr.length)
                  // (titileArr.join('-') ? titileArr.join('-') + '-' : '') +
                  ele.username + (!!ele.userjobid ? '(' + ele.userjobid + ')' : '')
          }
          //titileArr.push(ele.deptname)
          // if (type == 'multiple') {
          newobj.id = ele._uuid
          // } else {
          //   newobj.id = null
          // }
          arr.push(newobj)

          // arr.push(newobj)
      }

      if (!!ele.children) {
          if (ele.children.length > 0) {
              const back = getuserList(ele.children)
              if (back.length > 0) {

                  back.forEach(ele => {

                      if (!arr.some(v => {
                              return v.label == ele.label
                          })) {
                          arr.push(ele);
                      }

                  });
                  //对于已经存在的元素不进行添加
                  // arr = arr.concat(back)
                  // newobj.children=back;
              }
          } else {
              continue
          }
      }
  }
  // console.log('arr', arr)
  return arr
}


export const getdeptList=(list, titiles = [])=> {
  // 用于适配
  let arr = []
  for (let i = 0; i < list.length; i++) {
      const titileArr = cloneDeep(titiles)
      const ele = list[i]
      if (ele.deptname) {
          const newobj = {
              label:
                  // this.intend(titileArr.length)
                  (titileArr.join('-') ? titileArr.join('-') + '-' : '') +
                  ele.deptname
          }
          titileArr.push(ele.deptname)
          // if (type == 'multiple') {
          newobj.id = ele._uuid
          // } else {
          //   newobj.id = null
          // }

          arr.push(newobj)

          if (ele.children) {
              if (ele.children.length > 0) {
                  const back = getdeptList(ele.children, titileArr)
                  if (back.length > 0) {
                      arr = arr.concat(back)
                      // newobj.children=back;
                  }
              } else {
                  continue
              }
          }
          // arr.push(newobj)
      }
  }
  // console.log('arr', arr)
  return arr
}