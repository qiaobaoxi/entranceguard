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
    <my-dialog
      :dialogVisible="dialogVisible"
      :dialogTitle="dialogTitle"
      @FnDialogClose="FnAddBussiness"
    >
      <my-form :rules="rules" :ruleForm="ruleForm">
        <el-form-item label="公司名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </my-form>
    </my-dialog>
  </div>
</template>

<script>
import MyDialog from "@/components/MyDialog.vue";
import MyForm from "@/components/MyForm.vue";
import { reactive, ref } from "vue";
export default {
  name: "dashboard",
  setup() {
    // 数据初始化
    const dialogVisible = ref(false);
    const dialogTitle = ref("添加");
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
          max: 12,
          message: "请输入3~12个字",
          trigger: "blur",
        },
      ],
    });
    function FnAddBussiness() {
      dialogVisible.value = !dialogVisible.value;
      if (dialogVisible.value) {
        ruleForm.name="";
        dialogTitle.value = "添加";
      }
    }
    const submitForm = (formEl = undefined) => {
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
    const resetForm = (formEl = undefined) => {
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
      resetForm,
      dialogTitle,
    };
  },
  components: {
    MyDialog,
    MyForm,
  },
};
</script>

<style scoped lang="less">
</style>
