<template>
  <div>
    <div class="option">
      <el-button type="primary" @click="FnAddBussiness">添加</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="30%"
      :before-close="FnAddBussiness"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
      >
        <el-form-item label="公司名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >Submit</el-button
          >
          <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  name: "dashboard",
  setup() {
    const dialogVisible = ref(false);
    const ruleForm = reactive({
      name: "",
    });
    const rules = reactive({
      name: [
        {
          required: true,
          message: "请输入公司名字",
          trigger: "blur",
        },
        {
          min: 3,
          max: 5,
          message: "请输入3~12个字",
          trigger: "blur",
        },
      ],
    });
    function FnAddBussiness() {
      dialogVisible.value = !dialogVisible.value;
    }
    export const submitForm = (formEl = undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          console.log("submit!");
        } else {
          console.log("error submit!");
          return false;
        }
      });
    };
    export const resetForm = (formEl = undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };
    return {
      dialogVisible,
      tableData: [],
      FnAddBussiness,
      ruleForm,
      rules,
      submitForm,
      resetForm
    };
  },
};
</script>

<style scoped lang="less">
</style>
