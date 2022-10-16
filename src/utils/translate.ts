const  CryptoJS = require('crypto-js') 
const request = require('request');
var SecretId = "AKIDAE4f3C7g05xe7MfkaBXlmY8VtBMMBqLe";
var SecretKey = "A7tVt2zsdDbm2MvaBe8c2xlNq7Nf1RuP";

var reqMethod = "GET";
var host = "tmt.tencentcloudapi.com";
var hostPath = "/";

var Nonce = Math.floor(Math.random() * 1000000000);
var date = new Date();
var timestamp = Math.floor(date.getTime() / 1000);
// 参数对转成字符串
 function paramsToStr(params)
 {
     // 按参数名的字典序排序
 
     params.sort(function(a,b){
         if(a[0] < b[0]) return -1;
         else if(a[0] > b[0]) return 1;
         return 0;
     });
 
     // 连成字符串
 
     var parPairStrArr = [];
     for (var i in params)
     {
         var par = params[i];
         var parStr = par.join("=");
         parPairStrArr.push(parStr);
     }
     var str = parPairStrArr.join("&");
     return str;
 }
 
 function makeBaseUrl(host, hostPath)
 {
     return host + hostPath;
 }
 
 // 声称签名
 function makeSignature(reqMethod, host, hostPath, reqParams)
 {
     var paramsStr = paramsToStr(reqParams);
 
     // 签名原文字符串
     var signStr = reqMethod + makeBaseUrl(host, hostPath) + "?" + paramsStr;
 
     // 签名
     var hs = CryptoJS.HmacSHA1(signStr, SecretKey);
     var rawSig = CryptoJS.enc.Base64.stringify(hs);
     console.log("rawSig=" + rawSig);
     var sig = encodeURIComponent(rawSig);
     return sig;
 }
 
 export function isCode(str:string){
    const [promptAll,prompt] = str.match(/特点-(.*)/)||['',''],
        [nPromptAll,nprompt] = str.match(/瑕疵-(.*)/)||['','']
    return {
        isPrompt:!!prompt,
        prompt,
        isNprompt:!!nprompt,
        nprompt
    }
 }
 // 发送翻译请求
 export async function sendTrans(sourceText:string)
 {
     if(sourceText == null || sourceText == "")
     {
         return;
     }

     var reqParams = [
         [ "Action", "TextTranslate" ],
         [ "Nonce", Nonce ],
         [ "ProjectId", 0],
         ["Region", "ap-beijing"],
         ["SecretId", SecretId],
         ["Source","auto"],
         ["SourceText", sourceText],  // 生成签名时，使用原文本
         ["Target","en"],
         ["Timestamp",timestamp ],
         ["Version","2018-03-21"]
     ];
 
     // 生成签名
     var sig = makeSignature(reqMethod, host, hostPath, reqParams);
 
     // 原文本中所有的空格替换成+号，然后uri编码
     var iSourceText = reqParams.findIndex((p)=>(p[0]=="SourceText"));
     reqParams[iSourceText][1] = encodeURI(sourceText.replace(/\ /g,"+"));
     var paramsStr = paramsToStr(reqParams);
 
     var url = "https://" + makeBaseUrl(host, hostPath) + "?" + paramsStr + "&Signature=" + sig;
     console.log("url=" + url);
    return new Promise((r,j)=>{
        request(url,(err,res)=>{
            if(err){
                j()
                throw err

            }else{
                r(JSON.parse(res.body));
            }
        })
    })
 }