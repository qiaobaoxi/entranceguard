<template>
  <div>
    <div class="option">
      <el-button type="primary" @click="FnAddCard">添加</el-button>
    </div>
    <el-table :data="tableList.data" style="width: 100%">
      <el-table-column type="index" width="180" />
      <el-table-column prop="cardNum" label="卡号" />
      <el-table-column prop="cardName" label="卡号" />
      <el-table-column label="类型">
        <template #default="scoped">
          <span v-for="item in scoped.row.type.split(',')" :key="item">
            {{ types[item - 1].label }},
          </span>
        </template>
      </el-table-column>
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
    <pagination :total="total"></pagination>
    <my-dialog
      :dialogVisible="dialogVisible"
      :dialogTitle="dialogTitle"
      @FnDialogClose="FnIsShow"
    >
      <my-form :rules="rules" :ruleForm="ruleForm" @FnSubmit="FnSubmit">
        <el-form-item label="卡的名字">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入卡的名字"
          ></el-input>
        </el-form-item>
        <el-form-item label="卡号" prop="num">
          <el-input-number :min="1" v-model="ruleForm.num" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="ruleForm.type" multiple placeholder="Select">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡的长度" prop="length">
          <el-input
            v-model="ruleForm.length"
            placeholder="请输入卡的长度"
          ></el-input>
        </el-form-item>
      </my-form>
    </my-dialog>
  </div>
</template>

<script>
import MyDialog from "@/components/MyDialog.vue";
import MyForm from "@/components/MyForm.vue";
import Pagination from "@/components/Pagination.vue";
import { formatTime } from "../utils/index.js";
import { reactive, ref } from "vue";
import {
  createCardApi,
  getCardListApi,
  editCardApi,
  deleteCardApi,
} from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "dashboard",
  setup() {
    // 数据初始化
    const dialogVisible = ref(false);
    const page = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const dialogTitle = ref("添加");
    const ruleForm = reactive({
      name: "",
      num: 1,
      type: "",
      length: "",
    });
    const tableList = reactive({
      data: [],
    });
    const rules = reactive({
      name: [
        {
          required: true,
          message: "请输入卡的名字",
          trigger: "blur",
        },
      ],
      num: [
        {
          required: true,
          message: "请输入卡号",
          trigger: "blur",
        },
      ],
      type: [
        {
          required: true,
          message: "请选择卡的类型",
          trigger: "blur",
        },
      ],
      length: [
        {
          required: true,
          message: "请输入卡的长度",
          trigger: "blur",
        },
      ],
    });
    const types = reactive([
      {
        value: 1,
        label: "消费",
      },
      {
        value: 2,
        label: "门卡",
      },
    ]);
    function FnIsShow() {
      dialogVisible.value = !dialogVisible.value;
    }
    function FnAddCard() {
      FnIsShow();
      if (dialogVisible.value) {
        ruleForm.id = "";
        ruleForm.name = "";
        ruleForm.num = 1;
        ruleForm.type = "";
        ruleForm.length = "";
        dialogTitle.value = "添加";
      }
    }
    function FnEditCard() {
      FnIsShow();
    }
    const FnSubmit = () => {
      if (ruleForm.id) {
        editCardApi({
          id: ruleForm.id,
          name: ruleForm.name,
          num: ruleForm.num,
          type: ruleForm.type.join(","),
          length: ruleForm.length,
        }).then((res) => {
          if (res.code) {
            ElMessage.success("编辑成功");
            ruleForm.name = "";
            ruleForm.num = "";
            FnEditCard();
            init();
          } else {
            ElMessage.warning(res.msg);
          }
        });
      } else {
        createCardApi({
          name: ruleForm.name,
          num: ruleForm.num,
          type: ruleForm.type.join(","),
          length: ruleForm.length,
        }).then((res) => {
          if (res.code) {
            ElMessage.success("添加成功");
            ruleForm.name = "";
            ruleForm.num = "";
            FnAddCard();
            init();
          } else {
            ElMessage.warning(res.msg);
          }
        });
      }
    };
    const FnEdit = function (row) {
      ruleForm.id = row.id;
      ruleForm.name = row.cardName;
      ruleForm.num = row.cardNum;
      ruleForm.type = row.type.split(",").map((item)=>{
            return parseInt(item)
          });
      ruleForm.length = row.length;
      dialogTitle.value = "编辑";
      FnEditCard();
    };
    const FnDelet = function (row) {
      ElMessageBox.confirm("是否删除?", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCardApi({ id: row.id }).then((res) => {
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
      getCardListApi({ page: page.value, pageSize: pageSize.value }).then(
        (res) => {
          if (res.code) {
            tableList.data = res.data.list;
            total.value = res.data.count;
          } else {
            ElMessage.warning(res.msg);
          }
        }
      );
    }
    return {
      dialogVisible,
      tableList,
      FnAddCard,
      ruleForm,
      rules,
      dialogTitle,
      FnSubmit,
      formatTime,
      FnEdit,
      FnDelet,
      FnIsShow,
      total,
      types
    };
  },
  components: {
    MyDialog,
    MyForm,
    Pagination,
  },
};
</script>

<style scoped lang="less">
</style>
