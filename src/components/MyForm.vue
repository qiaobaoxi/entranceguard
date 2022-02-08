<template>
  <section>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
    >
      <slot></slot>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >提交</el-button
        >
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { toRefs, ref } from "vue";
export default {
  props: {
    ruleForm: {
      type: Object,
      default: {},
    },
    rules: {
      type: Object,
      default: {},
    },
    formSize: {
      type: String,
      default: "default",
    },
  },
  setup(props,context) {
    const { ruleForm, rules, formSize } = toRefs(props);
    const ruleFormRef = ref();
    const submitForm = (formEl = undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          context.emit("FnSubmit")
        } else {
          return false;
        }
      });
    };
    const resetForm = (formEl = undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };
    return {
      submitForm,
      resetForm,
      ruleForm,
      rules,
      formSize,
      ruleFormRef,
    };
  },
};
</script>

<style>
</style>