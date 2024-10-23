<template>
  <div class="calendar-view">
    <el-container>
      <!-- 左侧栏 -->
      <el-aside width="400px" style="background-color: cyan">
        <!-- 班级 -->
        <el-row justify="center" style="margin-top: 20px">
          <el-col :span="18">
            <el-link type="primary" @click="goToClass">班级</el-link>
          </el-col>
        </el-row>

        <!-- Tag + -->
        <el-row justify="center" style="margin-top: 20px">
          <el-col :span="18">
            <el-link type="primary" @click="goToTags">Tag +</el-link>
          </el-col>
        </el-row>

        <!-- 活动 -->
        <el-row justify="center" style="margin-top: 20px">
          <el-col :span="18">
            <el-link type="primary" @click="goToActivities">活动</el-link>
          </el-col>
        </el-row>

        <!-- 浏览全校活动 / DDL -->
        <el-row justify="center" style="margin-top: 20px">
          <el-col :span="18">
            <el-link type="primary" @click="goToSchoolActivities"
              >浏览全校活动</el-link
            >
            <el-link
              type="primary"
              @click="goToDDL"
              style="display: block; margin-top: 10px"
              >DDL</el-link
            >
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-header
          style="background-color: antiquewhite"
          :style="{ height: '80px' }"
        >
          <el-main>
            <el-row align="middle" justify="space-between">
              <!-- Header: switch-role (teacher) [TODO] -->
              <span v-if="$var.auth.role == 'teacher'">
                You are a teacher
              </span>
              <!-- Header: messages (student) -->
              <span v-if="$var.auth.role == 'student'">
                <el-badge
                  :hidden="unread == 0"
                  :value="unread"
                  :max="99"
                  class="item"
                >
                  <el-tooltip content="消息">
                    <el-button
                      :icon="Message"
                      circle
                      @click="openMessageDrawer"
                    />
                  </el-tooltip>
                </el-badge>
              </span>
              <!-- 右侧头像 -->
              <!-- 右侧头像和用户名 -->
              <div style="display: flex; align-items: center">
                <!-- 用户头像 -->
                <el-avatar
                  size="medium"
                  :src="userAvatar"
                  style="margin-right: 10px; cursor: pointer"
                  @click="goToProfile"
                />
                <!-- 用户名 -->
                <span
                  style="font-size: 16px; font-weight: bold; cursor: pointer"
                  @click="goToProfile"
                >
                  {{ username }}
                </span>
              </div>
            </el-row>
          </el-main>
        </el-header>
        <el-main style="background-color: honeydew">
          <vue-cal
            ref="calendar"
            locale="zh-cn"
            @cell-click="handleDateClick"
            :style="{ height: '1150px' }"
          >
            <template #header="{ date }">
              <span>Custom header content</span>
              <span>{{ date }}</span>
              <el-button-group>
                <el-button size="small" @click="selectDate('prev-month')"
                  >Previous Month</el-button
                >
                <el-button size="small" @click="selectDate('today')"
                  >Today</el-button
                >
                <el-button size="small" @click="selectDate('next-month')"
                  >Next Month</el-button
                >
              </el-button-group>
            </template>
          </vue-cal>
          <!-- 弹出的小窗 -->
          <el-dialog v-model="dialogVisible" title="日期详情">
            <span>您点击的日期是: {{ selectedDate }}</span>
            <template #footer>
              <el-button @click="dialogVisible = false">关闭</el-button>
            </template>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <!-- Drawer: message list (student) -->
  <el-drawer v-model="message_drawer" :direction="'rtl'">
    <template #header>
      <h4>收到的消息</h4>
    </template>
    <MessageList :messages="messageList" :update="updateMessage" />
  </el-drawer>
</template>

<script setup>
import { Message } from "@element-plus/icons-vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css"; // 导入样式
</script>

<script>
import MessageList from "@/components/MessageList.vue";
import { ElMessageBox } from "element-plus";

export default {
  name: "HomeView",
  component: {
    MessageList,
  },
  data() {
    return {
      messageList: [],
      unread: 0,
      message_drawer: false,
      userAvatar:
        this.$var.auth.avatar || require("@/assets/default-avatar.png"), // 设置默认头像或从用户数据中获取
      username: this.$var.auth.username || "Unknown User", // 用户名
      selectedDate: "",
      dialogVisible: false, // 用于控制 dialog 的显示与隐藏
    };
  },
  mounted() {
    if (!this.$var.auth.isValid()) {
      ElMessageBox.alert("登录失效！", { type: "warning" });
      this.$router.push({ path: "/" });
    }
    if (this.$var.auth.role == "student") {
      this.updateMessage();
    }
  },
  methods: {
    handleDateClick(date) {
      console.log("日期点击事件触发: ", date); // 调试信息
      this.selectedDate = date; // 获取点击的日期
      this.dialogVisible = true; // 显示 dialog
    },
    // 路由跳转方法,一些信息应该可以不跳转，直接就展示出来
    goToProfile() {
      this.$router.push({ path: "/profile" });
    },
    goToClass() {
      this.$router.push({ path: "/class" });
    },
    goToTags() {
      this.$router.push({ path: "/tags" });
    },
    goToActivities() {
      this.$router.push({ path: "/activities" });
    },
    goToSchoolActivities() {
      this.$router.push({ path: "/school-activities" });
    },
    goToDDL() {
      this.$router.push({ path: "/ddl" });
    },
    updateMessage() {
      this.$apis.getMessageList().then((response) => {
        this.messageList = response.data.messages;
        this.unread = 0;
        for (let element of this.messageList) {
          if (element.unread) {
            this.unread++;
          }
        }
        console.log(response.data.messages);
      });
    },
    openMessageDrawer() {
      if (this.$var.auth.role != "student") {
        console.warn(
          `Open Message: expected a student, got a {this.$var.auth.role}`
        );
        return;
      }
      this.message_drawer = true;
    },
  },
};
</script>

<style scope>
.calendar-view,
.el-container,
#app,
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>
