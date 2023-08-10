import store from '@/store'




export function checkPermission2(permission,roles){


  // console.log(permission)

  if(!!roles.whitelist){
    for (let i = 0; i < roles.whitelist.length; i++) {
      const white = roles.whitelist[i];
      if(white=='all'||white==permission)return true;
      if(permission.indexOf(white+'.')===0)return true;
    }
  }
  if(!!roles.blacklists){
   for (let i = 0; i < roles.blacklists.length; i++) {
     const black = roles.blacklists[i];
     if(black=='all'||black==permission)return false;
     if(permission.indexOf(black+'.')===0)return false;
   }
 }
 if(!!roles.enables){
   for (let i = 0; i < roles.enables.length; i++) {
     const enable = roles.enables[i];
     if(enable=='all'||enable==permission)return true;
     if(permission.indexOf(enable+'.')===0)return true;
   }
 }
 return false;


}
/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    let hasPermission=permissionRoles.some(permission=>{
      return checkPermission2(permission,roles)
    })
    return hasPermission;

/*     for (let index = 0; index < permissionRoles.length; index++) {
      const permission = permissionRoles[index];
      if(checkPermission2(permission,roles)){
        return true;
      }
      return false;      
    } */


    // let hasPermission = roles.some(role => {
    //   return permissionRoles.includes(role)
    // })

    // if(roles.includes('super_admin')){
    //   hasPermission=true;
    // }

    // if (!hasPermission) {
    //   return false
    // }
    // return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
