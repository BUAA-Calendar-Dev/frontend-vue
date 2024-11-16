<template>
  <div class="calendar-view">
    <el-container>
      <!-- 左侧栏 -->
      <el-aside width="400px" style="background-color: cyan">
        <!-- 班级 -->
        <span v-if="$var.auth.role == 'teacher'">
          <el-row justify="center" style="margin-top: 20px">
            <el-col :span="18">
              <el-link type="primary" @click="goToClass">班级</el-link>
            </el-col>
          </el-row>

          <!-- Tag + -->
          <el-row justify="center" style="margin-top: 20px">
            <el-col :span="18">
              <el-link type="primary" @click="goToTags">管理班级</el-link>
            </el-col>
          </el-row>

          <!-- 活动 -->
          <el-row justify="center" style="margin-top: 20px">
            <el-col :span="18">
              <el-link type="primary" @click="goToActivities">创建提醒</el-link>
            </el-col>
          </el-row>

          <!-- 浏览全校活动 / DDL -->
          <el-row justify="center" style="margin-top: 20px">
            <el-col :span="18">
              <el-link type="primary" @click="goToSchoolActivities"
                >DDL</el-link
              >
              <el-link
                type="primary"
                @click="goToDDL"
                style="display: block; margin-top: 10px"
                >已发布的DDL</el-link
              >
            </el-col>
          </el-row>
        </span>
        <span v-if="$var.auth.role == 'student'">
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

          <!-- TODO: Why seperate them from the items above? ---- sk -->
          <!-- 浏览全校活动 / DDL -->
          <el-row justify="center" style="margin-top: 20px">
            <el-col :span="18">
              <!-- Remove this item since we have a "活动" above -->
              <!-- <el-link type="primary" @click="goToSchoolActivities"
                >浏览全校活动</el-link
              > -->
              <el-link
                type="primary"
                @click="goToDDL"
                style="display: block; margin-top: 10px"
                >DDL</el-link
              >
            </el-col>
          </el-row>
        </span>
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
                <el-button @click="transferToStudent" type="warning" round>
                  切换为学生
                </el-button>
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
                <el-button @click="customEventCreation" type="warning" round>
                  创建新日程
                </el-button>
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
            :special-hours="specialHours"
            :events="events"
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
          <!-- 弹窗：创建新事件 -->
          <el-dialog
            title="创建新事件"
            v-model="eventDialogVisible"
            width="400px"
            @close="resetDialogFields"
          >
            <el-form>
              <el-form-item label="事件名称" required>
                <el-input v-model="eventName" placeholder="请输入事件名称" />
              </el-form-item>
              <el-form-item label="事件开始" required>
                <el-input
                  v-model="eventStart"
                  placeholder="请输入日期 (YYYY-MM-DD HH:mm)"
                />
              </el-form-item>
              <el-form-item label="事件结束" required>
                <el-input
                  v-model="eventEnd"
                  placeholder="请输入日期 (YYYY-MM-DD HH:mm)"
                />
              </el-form-item>
              <el-form-item label="事件内容" required>
                <el-input v-model="eventContent" placeholder="请输入事件内容" />
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="eventDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="createEvent">确定</el-button>
            </template>
          </el-dialog>
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
      userAvatar: require("@/assets/default-avatar.png"), // 设置默认头像
      username: "Unknown User", // 用户名
      selectedDate: "",
      dialogVisible: false, // 用于控制 dialog 的显示与隐藏
      specialHours: [],
      events: [],
      eventDialogVisible: false,
      eventName: "",
      eventStart: "",
      eventEnd: "",
      eventContent: "",
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
    this.updateUser();
    this.updateSpecialHours();
  },
  methods: {
    customEventCreation() {
      this.eventDialogVisible = true;
      console.log(this.eventDialogVisible);
    },
    resetDialogFields() {
      this.eventName = "";
      this.eventDate = "";
    },
    createEvent() {
      if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(this.eventStart) &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(this.eventEnd)
      ) {
        // this.$refs.calendar.createEvent(this.eventDate, 120, {
        //   title: this.eventName,
        //   content: "yay! 🎉",
        //   class: "blue-event",
        // });
        this.$apis.createEvent(
          this.eventStart,
          this.eventEnd,
          this.eventName,
          this.eventContent
        );
        this.eventDialogVisible = false;
        this.resetDialogFields();
        this.updateEvents();
      } else {
        this.$message.error("日期格式不正确，请按 YYYY-MM-DD HH:mm 格式输入。");
      }
    },
    transferToStudent() {
      this.$var.auth.role = "student";
      //后端更新身份
      this.$forceUpdate();
    },
    handleDateClick(date) {
      console.log("日期点击事件触发: ", date); // 调试信息
      this.selectedDate = date; // 获取点击的日期
      this.dialogVisible = true; // 显示 dialog
    },
    // 路由跳转方法,一些信息应该可以不跳转，直接就展示出来
    goToProfile() {
      this.$router.push({ path: "/user" });
    },
    goToClass() {
      this.$router.push({ path: "/class/view" });
    },
    goToTags() {
      this.$router.push({ path: "/tags" });
    },
    goToActivities() {
      this.$router.push({ path: "/activity" });
    },
    /**
     * @deprecated use `goToActivities` instead
     */
    goToSchoolActivities() {
      this.$router.push({ path: "/school-activities" });
    },
    goToDDL() {
      this.$router.push({ path: "/ddl" });
    },
    updateUser() {
      this.$apis.getUserInfo(this.$var.auth.id).then((response) => {
        this.username = response.data.username;
        this.userAvatar = response.data.avatar;
        console.log(response.data.username);
      });
    },
    updateSpecialHours() {
      this.$apis.getEvent().then((response) => {
        this.specialHours = response.data.specialHours;
      });
    },
    updateEvents() {
      this.$apis.getEvent().then((response) => {
        this.events = response.data.events;
      });
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
.vuecal__special-hours {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;

  em {
    font-size: 0.9em;
    color: #999;
  }
}

.doctor-1 {
  background-color: #f0fff1;
  color: #81d58b;
}
.doctor-2 {
  background-color: #f0f6ff;
  color: #689bee;
}
</style>
