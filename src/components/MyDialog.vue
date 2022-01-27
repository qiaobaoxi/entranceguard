<template>
  <section>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="30%"
      :before-close="FnClose"
      :close-on-click-modal="false"
    >
      <slot></slot>
    </el-dialog>
  </section>
</template>

<script>
import { toRefs } from "vue";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "添加",
    },
  },
  setup(props,context) {
    const { dialogVisible,dialogTitle } = toRefs(props);
    const FnClose=()=>{
       context.emit("FnDialogClose")
    }
    return {
      dialogVisible,
      dialogTitle,
      FnClose
    };
  },
};
</script>

<style>
</style>