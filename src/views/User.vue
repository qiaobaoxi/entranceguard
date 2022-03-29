<template>
  <div>
    <div class="option">
      <el-button type="primary" @click="FnAddUser">添加</el-button>
    </div>
    <el-table :data="tableList.data" style="width: 100%">
      <el-table-column type="index" width="180" />
      <el-table-column prop="userNum" label="员工号" />
      <el-table-column prop="userName" label="员工名" />
      <el-table-column  label="卡号" >
        <template #default="scoped">
          {{scoped.row.relationData?scoped.row.relationData.cardsId:""}}
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
          <el-button type="text" size="small" @click="FnAddCard(scoped.row)"
            >添加卡</el-button
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
        <el-form-item label="员工名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="员工号" prop="num">
          <el-input-number :min="1" v-model="ruleForm.num" />
        </el-form-item>
      </my-form>
    </my-dialog>
    <my-dialog
      :dialogVisible="dialogCardVisible"
      :dialogTitle="dialogTitle"
      @FnDialogClose="FnIsAddCardShow"
    >
      <my-form
        :rules="cardrules"
        :ruleForm="ruleCardForm"
        @FnSubmit="FnCardSubmit"
      >
        <el-form-item label="卡" prop="ids">
          <el-select v-model="ruleCardForm.ids"  multiple placeholder="Select">
            <el-option
              v-for="item in cards.data"
              :key="item.id"
              :label="item.cardName"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
  createUserApi,
  getUserListApi,
  editUserApi,
  deleteUserApi,
  getCardListAllApi,
  saveUserAndcardApi
} from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "dashboard",
  setup() {
    // 数据初始化
    const dialogVisible = ref(false);
    const dialogCardVisible = ref(false);
    const page = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const dialogTitle = ref("添加");
    const ruleForm = reactive({
      name: "",
      num: 1,
    });
    const tableList = reactive({
      data: [],
    });
    const cards = reactive({
      data: [],
    });
    const ruleCardForm = reactive({
      ids: [],
    });
    const rules = reactive({
      name: [
        {
          required: true,
          message: "请输入员工名字",
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
    const cardrules = reactive({
      ids: [
        {
          required: true,
          message: "请选择卡",
          trigger: "blur",
        },
      ],
    });
    function FnIsShow() {
      dialogVisible.value = !dialogVisible.value;
    }
    function FnAddUser() {
      FnIsShow();
      if (dialogVisible.value) {
        ruleForm.name = "";
        dialogTitle.value = "添加";
      }
    }
    function FnEditUser() {
      FnIsShow();
    }
    const FnSubmit = () => {
      if (ruleForm.id) {
        editUserApi({
          id: ruleForm.id,
          name: ruleForm.name,
          num: ruleForm.num,
        }).then((res) => {
          if (res.code) {
            ElMessage.success("编辑成功");
            ruleForm.name = "";
            ruleForm.num = "";
            FnEditUser();
            init();
          } else {
            ElMessage.warning(res.msg);
          }
        });
      } else {
        createUserApi({ name: ruleForm.name, num: ruleForm.num }).then(
          (res) => {
            if (res.code) {
              ElMessage.success("添加成功");
              ruleForm.name = "";
              ruleForm.num = "";
              FnAddUser();
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
      ruleForm.name = row.userName;
      ruleForm.num = row.userNum;
      dialogTitle.value = "编辑";
      FnEditUser();
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
          deleteUserApi({ id: row.id }).then((res) => {
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
      getUserListApi({ page: page.value, pageSize: pageSize.value }).then(
        (res) => {
          if (res.code) {
            tableList.data = res.data.list;
            total.value=res.data.count;
          } else {
            ElMessage.warning(res.msg);
          }
        }
      );
    }
    //添加卡
    function FnIsAddCardShow() {
      dialogCardVisible.value = !dialogCardVisible.value;
    }
    let userId = 0;
    let relationCardId=null;
    function FnAddCard(row) {
      userId = row.id;
      relationCardId=row.relationData?row.relationData.id:null;
      ruleCardForm.ids=row.relationData?row.relationData.cardsId.split(",").map((item)=>{
        return parseInt(item)
      }):"";
      FnIsAddCardShow();
      if (dialogCardVisible.value) {
        dialogTitle.value = "添加卡";
      }
    }
    getCardListAllApi().then((res) => {
        if (res.code) {
          cards.data = res.data.list;
        } else {
          ElMessage.warning(res.msg);
        }
      });
    //公司关联员工
    function FnCardSubmit() {
      saveUserAndcardApi({
        id:relationCardId,
        userId,
        cardsId: ruleCardForm.ids,
      }).then((res) => {
        if (res.code) {
          init();
          FnIsAddCardShow();
          ElMessage.success("修改成功");
        } else {
          ElMessage.warning(res.msg);
        }
      });
    }
    return {
      dialogVisible,
      tableList,
      FnAddUser,
      ruleForm,
      rules,
      dialogTitle,
      FnSubmit,
      formatTime,
      FnEdit,
      FnDelet,
      FnIsShow,
      total,
      FnIsAddCardShow,
      FnCardSubmit,
      cardrules,
      FnAddCard,
      dialogCardVisible,
      ruleCardForm,
      cards
    };
  },
  components: {
    MyDialog,
    MyForm,
    Pagination
  },
};
</script>

<style scoped lang="less">
</style>
