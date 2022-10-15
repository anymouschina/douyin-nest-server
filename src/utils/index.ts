export function str2obj(str){
    const [complete,key,value] = str.match(/(.*): (.*)/) || []
    if(key){
        return [key,value]
    }else{
        return [];
    }
}