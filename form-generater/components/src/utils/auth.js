import Cookies from 'js-cookie'
import JSEncrypt from 'jsencrypt'
// import EncryptLong from 'encryptlong'
// import { Encrypt } from "rsa-encrypt-long";

import { Base64 } from 'js-base64';
import CryptoJS from 'crypto-js'
import httpBuildQuery from 'http-build-query';
import md5 from 'md5';

const TokenKey = 'Admin-Token'//window.CookieTokenKey;//'Admin-Token'



export function filesignToken(uid){
  //根据
  let agent=window.navigator.userAgent;
  let data={agent,uid:uid,time:Date.parse(new Date())/1000};
  data.sign=md5(httpBuildQuery(data)+'&token='+getToken());//此处强制使用管理员(正式)的token；
  // console.log(getToken());
  return httpBuildQuery(data);
}

export function getRefreshHistoryNum(){

  let nowkey=Math.floor(Date.parse(new Date())/10000);
  let refresh_history=getRefreshHistory();

  if(!!refresh_history[nowkey]){
    return refresh_history[nowkey];
  }
  return 0;
}

export function getRefreshHistory(){

    let refresh_history=localStorage.getItem('refresh_history');

    if(refresh_history==null)
    {
      refresh_history={}
    }else{
      refresh_history=JSON.parse(refresh_history)
    }
    
    return refresh_history;
}

export function addRefreshHistory(){
  let refresh_history=getRefreshHistory();

  let nowkey=Math.floor(Date.parse(new Date())/10000);
  if(!!refresh_history[nowkey]){
      refresh_history[nowkey]++;
  }else{
    refresh_history={}
    refresh_history[nowkey]=1;
  }
  localStorage.setItem('refresh_history',JSON.stringify(refresh_history));
}




//默认获取正式的token;
export function getToken(key=null) {
  return Cookies.get(!!key?key:window.env.prod.CookieTokenKey)
}

export function setToken(token,key=null,expires=null) {

  let options={}

  if(!!expires){
    options.expires=Number(expires);
  }





  if(process.env.NODE_ENV !== 'production'){
    Object.assign(options,{sameSite: 'Strict'})
  }

  if(window.location.protocol=='https:'){
    options['secure']=true;
  }

  return Cookies.set(!!key?key:window.env.prod.CookieTokenKey, token,options)
  

  // TypeError: attributes.expires.toUTCString is not a function

}

export function removeToken(key=null) {
  return Cookies.remove(!!key?key:window.env.prod.CookieTokenKey)
}

// 老的方式
export function secret_aes(code,string,operation){
  // let code='300045'
  code = CryptoJS.MD5(code).toString();
  var iv = CryptoJS.enc.Utf8.parse(code.substring(0,16));
  var key = CryptoJS.enc.Utf8.parse(code.substring(16));
  if(operation){
      return CryptoJS.AES.decrypt(string,key,{iv:iv,padding:CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
  }
  return CryptoJS.AES.encrypt(string, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString();

}
// 新的方式。公钥加密
//0 加密 1解密
export function secret(string,operation){

 
  let NodeRSA = require('node-rsa');
  
  // console.log('文字内容',string)
  let publickey=`-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyKZZvJDsCLoSbXPyPDnd
  eu9/5hKppwA7l2M7k4HZ9x09tA2/r6qeFeq2W8L2X6o+AW+reAsKqGMwvdPTOeL2
  du86J1ENYlNWY1X/rvQUdRDA+9gQQs0U2EcTs7/ktcOZlbAHsbqXO3uERnpHzz2k
  9h77WGakpjEPDVP666/ZdZ1+fFwfqQDwT6Ae3ECKQJLQGLq1s0fJAgXpQ2RbFkk5
  SBmuiUctfRqIVS329oNl8AkGksq+I7QnFZ+EkB8vi2EExr0t3/mQaA9bKpciQ7fw
  gCKu+Xp8/7CIYgSCCF822oUGsWE6aPnm5fLV6C2gu4XMc541EHqBIYM3DHiCyUNY
  wQIDAQAB
  -----END PUBLIC KEY-----`

  let keyRSA =  new NodeRSA(publickey);

  let encrypt= new JSEncrypt({default_key_size:2048})
  encrypt.setPublicKey(publickey);

  //公钥加密。私钥解密
  //私钥加密。公钥解密；

  // CryptoJS.(publicKey, Buffer.from(data)).toString('base64');

  //加密方法：md5(string)->32位数—>作为密码->公钥加密密码+加密数据

  // let f=encrypt.encrypt("9fa6766e210dbc60261bebeb8c57c413")
  // f=encrypt.decrypt(f)
  // console.log('gege',f)

  let code= md5(string);
  if(!operation){
    //加密
    return encrypt.encrypt(code)+"@"+secret_aes(code,string,operation);
  }else{
    //解密
    let codeencode=string.substring(0,string.indexOf("@"))
    let codedecode=keyRSA.decryptPublic(codeencode,"utf-8")
    // let codedecode=encrypt.decrypt(codeencode)
    return secret_aes(codedecode, string.substring(string.indexOf("@")+1),operation)
  }





  if(!operation){
    console.log('加密内容',encrypt.encrypt(string))

    return encrypt.encrypt(string);
  }
  return encrypt.decrypt(string)



  code = CryptoJS.MD5(code).toString();
  var iv = CryptoJS.enc.Utf8.parse(code.substring(0,16));
  var key = CryptoJS.enc.Utf8.parse(code.substring(16));
  if(operation){
      return CryptoJS.AES.decrypt(string,key,{iv:iv,padding:CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
  }
  return CryptoJS.AES.encrypt(string, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString();

}

export function encryptionPassword(pkey,password){
  /* 加密；

  let publickey=`-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyOPcMz7CDNj6123GOrqm
  ysTsiRNBxKAAI0YdlDbj+Uiguq6gpTIqgAbXaBUrIF3VweNJwmp8iCFY8KX0rtBG
  J340hoHvVwx/vICsw24aiing90MYtBY2CrY5RfoPVJmaVl67lP8QBWEgdZepAaW5
  o7s3O3LiVmaEHKvUxtCjNgazpVUwjsZltWjxcqJzPRALKt69SZ3sv5A1fjdBCvN+
  ul8WO2ADfnWJzUBAxfX8UG663go+2bgANc0Poa4FxO5VppFDu1DABIyfOVppugrC
  QBAIKrSfnp5U4xb57ImVn8lyr5N3Qmb9060o1zNIDob6zDou+l+FdU2gCYLc70T5
  DwIDAQAB
  -----END PUBLIC KEY-----`;
  let privatekey=`-----BEGIN RSA PRIVATE KEY-----
  MIIEpAIBAAKCAQEAyOPcMz7CDNj6123GOrqmysTsiRNBxKAAI0YdlDbj+Uiguq6g
  pTIqgAbXaBUrIF3VweNJwmp8iCFY8KX0rtBGJ340hoHvVwx/vICsw24aiing90MY
  tBY2CrY5RfoPVJmaVl67lP8QBWEgdZepAaW5o7s3O3LiVmaEHKvUxtCjNgazpVUw
  jsZltWjxcqJzPRALKt69SZ3sv5A1fjdBCvN+ul8WO2ADfnWJzUBAxfX8UG663go+
  2bgANc0Poa4FxO5VppFDu1DABIyfOVppugrCQBAIKrSfnp5U4xb57ImVn8lyr5N3
  Qmb9060o1zNIDob6zDou+l+FdU2gCYLc70T5DwIDAQABAoIBAQCXHN/9JE4v/9/g
  wVCFyPXCPZN4ISYt0/WGky2Y2hlu4TUWeFmbKjtSBtNuFc5VEIDE0kYfmp6GgB85
  Fn0SKtU6y/KS45a4Mky77UcH0wDfwVTaanxgqvyH3j8C5nE1wD2ajrQoBh11DnSu
  QCD/fjxAb4nCjE65k2/5aUArNbIv5lFbSZ8egXXQ04ZgQc4GHitR3BN2ZHQlOQPe
  ZcMo48wXK0P9nMo4ZU4LLlI9Yj5mF7XdLufzA3UxfJUmQ2IL3E2dK3yqwbCIIKDQ
  kE1RIhEAeo2XndbNI2MGeegHJ+xIlVBZXdurDil1umDA/lYRfIDCn28L1YnaxWVC
  KtczG1MxAoGBAOj6BgGtHVbPxhkVdYniUHDKnJ1B5jzEQrrVAeUvsVAaTfngOcsi
  wtYcK6KR1FqALxB1jnATePnBKfn2MGifbP2qIWYXiR1f5f0mB1Y5kh1FxM11zCNR
  XxHUEiaE2UDADCs4GteFBU9EFMOP9JaLFHJqSRygqsvCPL1v2Abh7MkbAoGBANy+
  F5ibwsWVAQnNNNBN5nLrjlb6pGiXWpnk6HRCf7vYuY1kBm4Wl+IqbTD07mETsZEv
  zeGFbm92MjKppk3K2yRnCAIqWNUudvUSn3Q/qBYOP1EBD1YzlTF/OO3HjNXyP72v
  Vd4fZLY8kmkvxxW3fN2HsXCDFHv27keK01LGkqMdAoGAOq428xcia6o7sDe6ejdZ
  oX83AVkG38ljMWHTb2Ga3J0zhLuYcvTXdEx2JSVsAjuFHzUs4kfVUbr4krASs1ds
  gVvnu6oz7AUqjZ+Ve39WsS7QihughkjJlFkBFViiy+9TYVNpV1123+c6/6LzrTNs
  vADPV3mUa2wKFoDkPZ+MH38CgYBmDNOnz8q5wWsbdu0FqB3z3waNG47Kc76FCxiU
  NvIKi+UsgqOeXX+WJXsZeQKDirE6p9kMe71UdlY6qceiizfImoFPTviGhdak8hkZ
  ixxQJgILluvaNDqzCVfuRaTMfBQPw3F1IRpUTah6TIZDefKWD9duZosfzEbYeEu+
  JuM/2QKBgQCe/nQpKEkuXP5hjrk9aQy00QfVM+iib0U5Gs0cdXXuxRUBNhNtU/ti
  DemPyXgZcE4tAIV9iv+7ZSVlwFxIdRlhv/2Brn0zaCqEGzlKY7sNIgpSgq65vTuQ
  lmGLCSxkVIEbX0lSRgmokerOWt+tSH/FDckLAlBlvAv2ENc26mAUOQ==
  -----END RSA PRIVATE KEY-----`; */



  // console.log(JSEncrypt);
  let encrypt= new JSEncrypt({default_key_size:2048})
  // console.log(encrypt);
  encrypt.setPublicKey(Base64.decode(pkey));
  let temp=encrypt.encrypt(password);
  /* console.log('temp',temp);
  let encrypt2= new JSEncrypt({default_key_size:2048})
  encrypt2.setPrivateKey(privatekey);
  console.log('back',encrypt2.decrypt('NDU3YTUyMzIyNDRiNTIzNjc4MzU1MzRiNGM1NTZiNjE0OTUwNTI0Nzc3NTU0YjczNjY0YzMwNDE1NjQ3NzE0NjZmNmM0ZDY0NTA3Njc4NDQzMTU3NDUzMDY1NmEzMDYzNGQzMDMwNzc3NTU2NDc3YTJmNzE2ODdhNjU2YjQxNjQ3OTU0NzkzOTU5MmIzMDM3NDg0OTM4NjY1YTRiNjQzMjY1MzI0MTRlMzM3OTMxNmQ3MTJmNDI0MzQxMzU3NzY2MzE0Mjc5NjM3MzQ5NjIzMjZiNjIzNTUyNzg3NjZkNDQ0NTUwNTI0MzU0NzkzOTc4MzI3OTY0NDc3NzU2NGIzNTc2NmUzMzY1NzM2NTUzNzM0MjY5NWE2NDJiNGI2MzQ0NzQ0YTVhNzk3OTU0NGQ3ODc2NmY0ZjU3Mzc2NjZhMzE2NDRjNDg1OTQ5NGE2MTMyNTI0MzUxNTgzOTRiNmU1OTM3NTM3YTMzNGE3MzYyNmE1MTU1N2E2ODM3Mzg3ODYyNGMzMDZkNTU1MTMwMzk3YTZiNzEzMDQ4MmI0OTY2NTczNzYxNTI0ZjY5NjE3NzUxNGE2YzZlNTc3MTM5NzM2ZjY5NjQ1NjQ5NGIzOTUzNGI2NzY3NDI1NzU1NzA3NjM1NzA2NjYyNGY2ZTRlNmMzMzY1NDk3NzM4NmQ3MzM0NzA1MjQzNzY0OTU5Nzk0NjY2N2EzOTRiNzM0MjRkNGY3MjZkNjg1NjRhNzIzMjQ0NTc2NjU5NDg3MjM0NTg2NTRjMzM2MTU0MzI1MTZhNTQzNDc2NTU3ODY1Nzc0ODM0MzE2NTRmNTc2NjM1Njg0YzRiNjE2NDUzMmIzNTcwNzA3NjU2NDYzNzJiMzYyYjRmNTU0NDc2NzU0MTM2Nzk0ZTQ3MzA2NTM2MzU2ZDcxNGQ2ODY3NGQ1MTNkM2QyNDMzNzY1NTQzNDE0MTYxNjk0NjZlNTgzMjQ0MzI2ZTM0NjY2NjUwNDU0YTU3NDc2NDM0NTEyZjMxNzU2ODQ4NjYzNTZlNmQ1NzM0NjI3NzU0NTQ2ZjRhNmQ1OTQ4MmI0ZTc2NTg2YjZiNzU0ZTc5MzMzMTM3NTk2MzQ5NDI3Mjc3NzQzNzM5Mzc3YTZlNzY0MTY3NDg3NDRkMmYzOTc0MmY1NDU2NTY2NDM5NDIzNzQ2NTY3MDU5NTQ0NzMxNTAzNTRkNTQzNjc0NzE0NDM0NDg2ZTcxNmU0OTZhNzg1MzQ3NGE2Njc1NTc3OTY3M2QzZDI0MzczNzM3MzA2MzM4MzYzMDYzMzgzNTMzMzkzNzMyMzc'));
   */
  return temp;
  /* 
  encodeURI(temp).replace(/\+/g, '%2B');
   */
}
