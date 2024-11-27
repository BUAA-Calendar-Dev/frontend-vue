<template>
  <div class="custom-style">
    <el-segmented v-model="navChoosed" :options="navOptions" />
  </div>
  <div class="main activity-main" v-if="navChoosed == '活动管理'">
    <el-divider> 已发布的活动 </el-divider>
    <el-card v-for="(item, index) in activityList" :key="index" :name="index">
      <template #header>{{ item.title }}</template>
    </el-card>
    <el-divider> 发布新的活动 </el-divider>
  </div>
  <div class="main class-main" v-if="navChoosed == '班级管理'">班级管理</div>
  <div class="main teacher-main" v-if="navChoosed == '教师管理'">教师管理</div>
</template>

<script>
import { ElMessageBox } from "element-plus";

export default {
  name: "AdminView",
  components: {},
  data() {
    return {
      navOptions: ["活动管理", "班级管理", "教师管理"],
      navChoosed: "活动管理",
      activityList: [],
    };
  },
  mounted() {
    if (!this.$var.auth.isValid()) {
      ElMessageBox.alert("登录失效！", { type: "warning" });
      this.$router.push({ path: "/" });
    }
    if (this.$var.auth.role !== "admin") {
      ElMessageBox.alert("非法访问！", { type: "warning" });
      this.$router.push({ path: "/" });
    }
    this.updateList();
  },
  updateList() {
    this.opened = null;
    this.$apis
      .getActivityList()
      .then((response) => {
        this.activityList = response.data.activities;
        for (let i = 0; i < this.activityList.length; i++) {
          // There is no enough real-world time to do the lazy-load
          this.$apis
            .getActivityContent(this.activityList[i].id)
            .then((response) => {
              this.activityList[i].content = response.data.content;
            })
            .catch(this.$utils.handleHttpException);
        }
      })
      .catch(this.$utils.handleHttpException);
  },
};
</script>
