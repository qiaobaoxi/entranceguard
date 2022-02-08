export const formatTime = function (row,column){
   const date = new Date(row[column.property])
   return date.getFullYear()+"-"+FnPad(date.getMonth()+1)+'-'+FnPad(date.getDate())+" "+FnPad(date.getHours())+":"+FnPad(date.getMinutes())+":"+FnPad(date.getSeconds())
}
























function FnPad(num){
   return num.toString().padStart('0',2)
}