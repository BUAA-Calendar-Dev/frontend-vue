<template>
  <div class="home container">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="8">
            <div
              class="fake-button"
              @click="this.$router.push({ path: '/home' })"
            >
              <DArrowLeft class="siderbar-icon" />
              返回主页
            </div>
          </el-col>
          <el-col :span="8"><div class="title">班级列表</div></el-col>
          <el-col :span="8">
            <div
              class="fake-button align-right"
              @click="this.$router.push({ path: '/user' })"
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
export default {
  name: "ClassView",
  data() {
    return {
      classList: [],
      currentClassDDLList: [],
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
    // eslint-disable-next-line no-unused-vars
    updateClassDDLList(id) {},
  },
  mounted() {
    this.updateClassList();
  },
};
</script>
