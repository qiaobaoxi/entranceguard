<template>
  <div>
    <div class="option">
      <el-button type="primary" @click="FnAddBussiness">添加</el-button>
    </div>
    <el-table :data="tableList.data" style="width: 100%">
      <el-table-column type="index" width="180" />
      <el-table-column prop="bussinessNum" label="公司号" />
      <el-table-column prop="bussinessName" label="公司名" />
      <el-table-column prop="usersName" label="员工" />
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
          <el-button type="text" size="small" @click="FnAddUser(scoped.row)"
            >添加员工</el-button
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
        <el-form-item label="公司名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="公司号" prop="num">
          <el-input-number :min="1" v-model="ruleForm.num" />
        </el-form-item>
      </my-form>
    </my-dialog>
    <my-dialog
      :dialogVisible="dialogUserVisible"
      :dialogTitle="dialogTitle"
      @FnDialogClose="FnIsAddUserShow"
    >
      <my-form
        :rules="userrules"
        :ruleForm="ruleUserForm"
        @FnSubmit="FnUserSubmit"
      >
        <el-form-item label="员工" prop="ids">
          <el-select v-model="ruleUserForm.ids" multiple placeholder="Select">
            <el-option
              v-for="item in users.data"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
          <el-select v-model="ruleCardForm.ids" multiple placeholder="Select">
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
  createBussinessApi,
  getBussinessListApi,
  editBussinessApi,
  deleteBussinessApi,
  getUserListAllApi,
  saveBussinessAnduserApi,
  getCardListAllApi 
} from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "dashboard",
  setup() {
    // 数据初始化
    const dialogVisible = ref(false);
    const dialogUserVisible = ref(false);
    const dialogCardVisible = ref(false);
    const page = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const dialogTitle = ref("添加");
    const ruleForm = reactive({
      name: "",
      num: 1,
    });
    const cards = reactive({
      data: [],
    });
    const ruleCardForm = reactive({
      ids: [],
    });
    const ruleUserForm = reactive({
      ids: [],
    });
    const tableList = reactive({
      data: [],
    });
    const users = reactive({
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
    const userrules = reactive({
      ids: [
        {
          required: true,
          message: "请选择员工",
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
      ElMessageBox.confirm("是否删除?", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
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
    function FnIsAddUserShow() {
      dialogUserVisible.value = !dialogUserVisible.value;
    }
    let bussinessId = 0;
    let relationUserId = null;
    function FnAddUser(row) {
      bussinessId = row.id;
      relationUserId = row.relationData ? row.relationData.id : null;
      ruleUserForm.ids = row.relationData
        ? row.relationData.usersId.split(",").map((item) => {
            return parseInt(item);
          })
        : "";
      FnIsAddUserShow();
      if (dialogUserVisible.value) {
        dialogTitle.value = "添加员工";
      }
    }
    //公司关联员工
    function FnUserSubmit() {
      saveBussinessAnduserApi({
        id: relationUserId,
        bussinessId,
        usersId: ruleUserForm.ids,
      }).then((res) => {
        if (res.code) {
          init();
          FnIsAddUserShow();
          ElMessage.success("修改成功");
        } else {
          ElMessage.warning(res.msg);
        }
      });
    }
    init();
    function init() {
      Promise.all([
        getBussinessListApi({ page: page.value, pageSize: pageSize.value }),
        getUserListAllApi(),
      ]).then((res) => {
        if (!res[0].code) {
          return ElMessage.warning(res[0].msg);
        }
        if (!res[1].code) {
          return ElMessage.warning(res[1].msg);
        }
        tableList.data = res[0].data.list;
        total.value = res[0].data.total;
        users.data = res[1].data.list;
        tableList.data.forEach((item) => {
          let usersName = [];
          let usersId = item.relationData
            ? item.relationData.usersId.split(",")
            : null;
          if (Array.isArray(usersId)) {
            for (let item of usersId) {
              usersName.push(getUser(item, res[1].data.list));
            }
          }
          item.usersName = usersName.join(",");
        });
      });
      function getUser(item, users) {
        for (let it of users) {
          if (it.id == item) {
            return it.userName;
          }
        }
      }
    }

    //添加卡
    function FnIsAddCardShow() {
      dialogCardVisible.value = !dialogCardVisible.value;
    }
    let userId = 0;
    let relationCardId = null;
    function FnAddCard(row) {
      userId = row.id;
      relationCardId = row.relationData ? row.relationData.id : null;
      ruleCardForm.ids = row.relationData
        ? row.relationData.cardsId.split(",").map((item) => {
            return parseInt(item);
          })
        : "";
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
        id: relationCardId,
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
      FnAddBussiness,
      ruleForm,
      rules,
      dialogTitle,
      FnSubmit,
      formatTime,
      FnEdit,
      FnDelet,
      FnIsShow,
      FnAddUser,
      userrules,
      ruleUserForm,
      total,
      users,
      dialogUserVisible,
      FnIsAddUserShow,
      FnUserSubmit,
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
    Pagination,
  },
};
</script>

<style scoped lang="less">
</style>
