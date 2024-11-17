<template>
  <div class="home container">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="8">
            <div class="fake-button" @click="$router.push({ path: '/home' })">
              <DArrowLeft class="siderbar-icon" />
              返回主页
            </div>
          </el-col>
          <el-col :span="8"><div class="title">班级列表</div></el-col>
          <el-col :span="8">
            <div
              class="fake-button align-right"
              @click="$router.push({ path: '/user' })"
            >
              用户信息
              <User class="siderbar-icon-right" />
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-row gutter="10">
        <el-col
          :span="12"
          v-for="(item, index) in classList"
          :key="index"
          style="margin-bottom: 15px"
        >
          <el-card class="class-card">
            <h2 style="text-align: left">{{ item.name }}</h2>
            <div style="color: gray; text-align: left">
              班级共有 {{ item.count }} 位学生
            </div>
            <div style="color: gray; text-align: left">班级教师：</div>
            <div
              style="
                color: gray;
                text-align: left;
                margin-top: 3px;
                font-weight: bold;
              "
            >
              <span
                style="color: gray; text-align: left; margin-right: 3px"
                v-for="(itemTeacher, index) in item.teacher"
                :key="index"
              >
                {{ itemTeacher }};
              </span>
            </div>
            <div style="text-align: right">
              <el-button
                v-if="$var.auth.role == 'student'"
                type="primary"
                @click="updateClassDDLList(item.id)"
              >
                查看班级任务
              </el-button>
              <el-button v-if="$var.auth.role == 'teacher'" type="primary">
                管理班级
              </el-button>
              <el-button v-if="$var.auth.role == 'teacher'" type="primary">
                布置班级任务
              </el-button>
              <el-button v-if="$var.auth.role == 'teacher'" type="primary">
                发布班级消息
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-container>
    <el-dialog v-model="showDDLList" title="班级任务列表" width="800">
      <el-table :data="currentDDLList" style="width: 100%" align="center">
        <el-table-column
          property="task-name"
          label="名称"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          property="task-time"
          label="DDL"
          width="300"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div>
              {{
                $utils.formatTimestamp(
                  scope.row["task-time"],
                  $var.timeFormatter
                )
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          property="task-time"
          label="完成情况"
          width="300"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-progress
              :percentage="scope.row['task-percent']"
              :stroke-width="15"
              striped
              striped-flow
              :duration="10"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style scope>
.container {
  width: 60%;
  position: absolute;
  left: 20%;
  top: 50px;
}

.siderbar-icon {
  width: 1em;
  height: 1em;
  margin-right: 8px;
}

.siderbar-icon-right {
  width: 1em;
  height: 1em;
  margin-left: 8px;
}

.title {
  font-size: large;
  font-weight: bold;
}

.fake-button {
  display: flex;
  align-items: center;
  padding: 8px;
}

.align-right {
  justify-content: flex-end;
}

.fake-button:hover {
  background-color: aliceblue;
}
</style>

<script setup>
import { DArrowLeft, User } from "@element-plus/icons-vue";
</script>

<script>
import { ElMessageBox } from "element-plus";

export default {
  name: "ClassView",
  data() {
    return {
      classList: [],
      currentDDLList: [],
      showDDLList: false,
    };
  },
  methods: {
    updateClassList() {
      this.$apis
        .getClassList()
        .then((response) => {
          this.classList = response.data.class;
          console.log(this.classList);
        })
        .catch(this.$utils.handleHttpException);
    },
    updateClassDDLList(id) {
      this.currentDDLList = [];
      this.$apis
        .getTaskList()
        .then((response) => {
          this.currentDDLList = response.data.tasks.filter(
            (item) => item["class-id"] == id
          );
        })
        .catch(this.$utils.handleHttpException);
      this.showDDLList = true;
    },
  },
  mounted() {
    if (!this.$var.auth.isValid()) {
      ElMessageBox.alert("登录失效！", { type: "warning" });
      this.$router.push({ path: "/" });
    }
    this.updateClassList();
  },
};
</script>
