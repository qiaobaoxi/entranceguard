<template>
  <div>
    <div class="option">
      <el-button type="primary" @click="FnAddBussiness">添加</el-button>
    </div>
    <el-table :data="tableList.data" style="width: 100%">
      <el-table-column type="index" width="180" />
      <el-table-column prop="bussinessNum" label="公司号" />
      <el-table-column prop="bussinessName" label="公司名" />
      <el-table-column
        prop="createDate"
        :formatter="formatTime"
        label="创建时间"
      />
      <el-table-column
        prop="updateDate"
        :formatter="formatTime"
        label="更新时间"
      />
      <el-table-column fixed="right" label="操作">
        <template #default="scoped">
          <el-button type="text" size="small" @click="FnEdit(scoped.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="FnDelet(scoped.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <my-dialog
      :dialogVisible="dialogVisible"
      :dialogTitle="dialogTitle"
      @FnDialogClose="FnIsShow"
    >
      <my-form :rules="rules" :ruleForm="ruleForm" @FnSubmit="FnSubmit">
        <el-form-item label="公司名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="公司号" prop="num">
          <el-input-number :min="1" v-model="ruleForm.num" />
        </el-form-item>
      </my-form>
    </my-dialog>
  </div>
</template>

<script>
import MyDialog from "@/components/MyDialog.vue";
import MyForm from "@/components/MyForm.vue";
import { formatTime } from "../utils/index.js";
import { reactive, ref } from "vue";
import {
  createBussinessApi,
  getBussinessListApi,
  editBussinessApi,
  deleteBussinessApi,
} from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "dashboard",
  setup() {
    // 数据初始化
    const dialogVisible = ref(false);
    const page = ref(1);
    const pageSize = ref(10);
    const dialogTitle = ref("添加");
    const ruleForm = reactive({
      name: "",
      num: 1,
    });
    const tableList = reactive({
      data: [],
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
    function FnIsShow() {
      dialogVisible.value = !dialogVisible.value;
    }
    function FnAddBussiness() {
      FnIsShow();
      if (dialogVisible.value) {
        ruleForm.name = "";
        dialogTitle.value = "添加";
      }
    }
    function FnEditBussiness() {
      FnIsShow();
    }
    const FnSubmit = () => {
      if (ruleForm.id) {
        editBussinessApi({
          id: ruleForm.id,
          name: ruleForm.name,
          num: ruleForm.num,
        }).then((res) => {
          if (res.code) {
            ElMessage.success("编辑成功");
            ruleForm.name = "";
            ruleForm.num = "";
            FnEditBussiness();
            init();
          } else {
            ElMessage.warning(res.msg);
          }
        });
      } else {
        createBussinessApi({ name: ruleForm.name, num: ruleForm.num }).then(
          (res) => {
            if (res.code) {
              ElMessage.success("添加成功");
              ruleForm.name = "";
              ruleForm.num = "";
              FnAddBussiness();
              init();
            } else {
              ElMessage.warning(res.msg);
            }
          }
        );
      }
    };
    const FnEdit = function (row) {
      ruleForm.id = row.id;
      ruleForm.name = row.bussinessName;
      ruleForm.num = row.bussinessNum;
      dialogTitle.value = "编辑";
      FnEditBussiness();
    };
    const FnDelet = function (row) {
      ElMessageBox.confirm(
        "是否删除?",
        "Warning",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          deleteBussinessApi({ id: row.id }).then((res) => {
            if (res.code) {
              init();
            } else {
              ElMessage.warning(res.msg);
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消删除",
          });
        });
    };
    init();
    function init() {
      getBussinessListApi({ page: page.value, pageSize: pageSize.value }).then(
        (res) => {
          if (res.code) {
            tableList.data = res.data.list;
          } else {
            ElMessage.warning(res.msg);
          }
        }
      );
    }
    return {
      dialogVisible,
      tableList,
      FnAddBussiness,
      ruleForm,
      rules,
      dialogTitle,
      FnSubmit,
      formatTime,
      FnEdit,
      FnDelet,
      FnIsShow,
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
