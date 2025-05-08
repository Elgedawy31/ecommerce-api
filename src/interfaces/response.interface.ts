export interface ResponseShape {
  data:any,
  limit?:number ,
  page?:number ,
  total?:number ,
  totalPages?:number ,
  error?:string , 
  message?:string, 
  success?:boolean
}