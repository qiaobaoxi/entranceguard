<template>
  <el-pagination :page-size="pageSize" background layout="prev, pager, next" :total="total" @current-change="FnCurrentChange">
  </el-pagination>
</template>
<script>
import { toRefs, ref } from "vue";
export default {
    props:{
      pageSize:{
          type:Number,
          default:10
      },
      total:{
          type:Number,
          default:0
      }
    },
    setup(props,context) {
        const { pageSize,total } = toRefs(props);
        function FnCurrentChange(page){
          context.emit("FnCurrentChange",page)
        }
        return {
            pageSize,
            total,
            FnCurrentChange
        } 
    },
}
</script>