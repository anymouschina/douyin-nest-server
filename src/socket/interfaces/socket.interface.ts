export interface MessageBodyType {
    BizId?:Number
    content:CONTENTBODY
}
export interface CONTENTBODY{
    type:string
    data:Danmu | any

}
export interface Danmu{
   userId:string
   name:string
   msg:string
   avatar:string
}