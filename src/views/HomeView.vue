<template>
  <div class="calendar-view">
    <el-container>
      <!-- 左侧栏 -->
      <el-aside width="300px" class="app-aside">
        <!-- 当显示任务列表时 -->
        <div v-if="showTaskList">
          <div class="aside-header">
            <h2>任务列表</h2>
            <el-button
              @click="showTaskList = false"
              type="primary"
              size="small"
              class="back-button"
            >
              返回
            </el-button>
          </div>

          <!-- 任务列表 -->
          <el-scrollbar height="calc(100vh - 100px)" class="task-scrollbar">
            <el-row
              v-for="task in taskList"
              :key="task.id"
              justify="center"
              class="task-item"
            >
              <el-col :span="20">
                <el-card shadow="hover" class="task-card">
                  <template #header>
                    <div class="task-header">
                      <span>{{ task.name }}</span>
                      <el-tag size="small" class="deadline-tag">
                        {{ new Date(task.end).toLocaleDateString() }}
                      </el-tag>
                    </div>
                  </template>
                  <div class="task-content">
                    <p>{{ task.content }}</p>
                    <el-progress
                      :percentage="calculateProgress(task.start, task.end)"
                      :status="
                        calculateProgress(task.start, task.end) >= 100
                          ? 'success'
                          : ''
                      "
                    />
                    <div class="task-time">
                      <span
                        >开始: {{ new Date(task.start).toLocaleString() }}</span
                      >
                      <span
                        >结束: {{ new Date(task.end).toLocaleString() }}</span
                      >
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>

        <!-- 原有的导航菜单，当不显示任务列表时显示 -->
        <span v-else-if="$var.auth.role == 'teacher'">
          <div class="aside-header">
            <h2>教师菜单</h2>
          </div>
          <div class="menu-list">
            <div class="menu-item" @click="goToClass">
              <i class="el-icon-user-group"></i>
              <span>班级</span>
            </div>

            <!-- Tag + -->
            <div class="menu-item" @click="goToTags">
              <i class="el-icon-collection-tag"></i>
              <span>管理班级</span>
            </div>

            <!-- 活动 -->
            <div class="menu-item" @click="goToActivities">
              <i class="el-icon-bell"></i>
              <span>创建班级提醒</span>
            </div>

            <!-- 浏览全校活动 / DDL -->
            <div class="menu-item" @click="goToSchoolActivities">
              <i class="el-icon-time"></i>
              <span>DDL</span>
            </div>
            <div class="menu-item" @click="goToDDL">
              <i class="el-icon-document"></i>
              <span>已发布的DDL</span>
            </div>
          </div>
        </span>
        <span v-else-if="$var.auth.role == 'student'">
          <div class="aside-header">
            <h2>学生菜单</h2>
          </div>
          <div class="menu-list">
            <div class="menu-item" @click="goToClass">
              <i class="el-icon-user-group"></i>
              <span>班级</span>
            </div>

            <!-- Tag + -->
            <div class="menu-item" @click="goToTags">
              <i class="el-icon-collection-tag"></i>
              <span>任务标签</span>
            </div>

            <!-- 活动 -->
            <div class="menu-item" @click="goToActivities">
              <i class="el-icon-bell"></i>
              <span>活动</span>
            </div>

            <!-- DDL -->
            <div class="menu-item" @click="goToDDL">
              <i class="el-icon-time"></i>
              <span>DDL</span>
            </div>
          </div>
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
                <el-button
                  @click="customEventCreation"
                  class="create-schedule-btn"
                  type="primary"
                  round
                >
                  <i class="el-icon-plus" style="margin-right: 4px" />
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
          <!-- 添加视图切换按钮 -->
          <div class="view-switch">
            <el-radio-group v-model="viewMode" size="large">
              <el-radio-button label="calendar">日历视图</el-radio-button>
              <el-radio-button label="list">列表视图</el-radio-button>
            </el-radio-group>
          </div>

          <!-- 日历视图 -->
          <vue-cal
            v-if="viewMode === 'calendar'"
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

          <!-- 列表视图 -->
          <div v-else class="task-list-view">
            <el-table
              :data="sortedEvents"
              style="width: 100%"
              :default-sort="{ prop: 'end', order: 'ascending' }"
            >
              <el-table-column label="任务名称" prop="title" min-width="150">
                <template #default="scope">
                  <div class="task-title">
                    {{ scope.row.title }}
                    <el-tag
                      size="small"
                      :type="getStatusType(scope.row)"
                      class="status-tag"
                    >
                      {{ getStatusText(scope.row) }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="类型" width="100">
                <template #default="scope">
                  <el-tag
                    :type="
                      scope.row.type === 'activity' ? 'success' : 'primary'
                    "
                    size="small"
                  >
                    {{ scope.row.type === "activity" ? "活动" : "任务" }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column label="内容" prop="content" min-width="200">
                <template #default="scope">
                  <el-tooltip
                    :content="scope.row.content"
                    placement="top"
                    :hide-after="500"
                  >
                    <div class="content-cell">{{ scope.row.content }}</div>
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column label="开始时间" prop="start" min-width="160">
                <template #default="scope">
                  {{ new Date(scope.row.start).toLocaleString() }}
                </template>
              </el-table-column>

              <el-table-column
                label="结束时间"
                prop="end"
                min-width="160"
                sortable
              >
                <template #default="scope">
                  {{ new Date(scope.row.end).toLocaleString() }}
                </template>
              </el-table-column>

              <el-table-column label="DDL进度" width="200">
                <template #default="scope">
                  <el-progress
                    :percentage="
                      calculateProgress(scope.row.start, scope.row.end)
                    "
                    :status="getProgressStatus(scope.row)"
                  />
                </template>
              </el-table-column>

              <!-- 在进度列之后添加完成状态列 -->
              <el-table-column
                label="状态"
                width="100"
                v-if="$var.auth.role === 'student'"
              >
                <template #default="scope">
                  <el-checkbox
                    v-if="scope.row.type === 'task'"
                    v-model="scope.row.completed"
                    @change="handleTaskComplete(scope.row)"
                    :disabled="
                      calculateProgress(scope.row.start, scope.row.end) >= 100
                    "
                  >
                    完成
                  </el-checkbox>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 弹窗：创建新事件 -->
          <el-dialog
            title="创建新事件"
            v-model="eventDialogVisible"
            width="500px"
            @close="resetDialogFields"
          >
            <el-form :model="eventForm" label-width="100px">
              <el-form-item label="事件名称" required>
                <el-input v-model="eventName" placeholder="请输入事件名称" />
              </el-form-item>
              <el-form-item label="开始时间" required>
                <el-date-picker
                  v-model="eventStart"
                  type="datetime"
                  placeholder="选择开始时间"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DD HH:mm"
                />
              </el-form-item>
              <el-form-item label="结束时间" required>
                <el-date-picker
                  v-model="eventEnd"
                  type="datetime"
                  placeholder="选择结束时间"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DD HH:mm"
                />
              </el-form-item>
              <el-form-item label="事件内容" required>
                <el-input
                  v-model="eventContent"
                  type="textarea"
                  rows="3"
                  placeholder="请输入事件内容"
                />
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
            <p>{{ greetingMessage }}</p>
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
  <!-- Tags Dialog -->
  <el-dialog v-model="tagDialogOpen" title="任务标签" width="400px">
    <TagDialogInner />
  </el-dialog>
  <el-dialog
    title="创建班级提醒"
    v-model="taskDialogVisible"
    width="500px"
    @close="resetTaskForm"
  >
    <el-form :model="taskForm" label-width="100px">
      <el-form-item label="选择班级" required>
        <el-select v-model="taskForm.classId" placeholder="请选择班级">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提醒名称" required>
        <el-input v-model="taskForm.title" placeholder="请输入提醒名称" />
      </el-form-item>
      <el-form-item label="提醒内容" required>
        <el-input
          v-model="taskForm.content"
          type="textarea"
          rows="3"
          placeholder="请输入提醒内容"
        />
      </el-form-item>
      <el-form-item label="开始时间" required>
        <el-date-picker
          v-model="taskForm.start"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>
      <el-form-item label="结束时间" required>
        <el-date-picker
          v-model="taskForm.end"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="taskDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="assignTaskToClass">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { Message } from "@element-plus/icons-vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css"; // 导入样式
</script>

<script>
import MessageList from "@/components/MessageList.vue";
import TagDialogInner from "@/components/TagDialogInner.vue";
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
      tagDialogOpen: false,
      taskDialogVisible: false,
      taskForm: {
        title: "",
        content: "",
        start: "",
        end: "",
        classId: "", // 选中的班级ID
      },
      classList: [], // 班级列表
      taskList: [], // 存储任务列表
      showTaskList: false, // 控制任务列表的显示
      greetingMessage: "", // 添加问候信息的状态
      viewMode: "calendar", // 添加视图模式控制
      activities: [], // 添加活动列表数据
      loading: false, // 添加加载状态
    };
  },
  computed: {
    sortedEvents() {
      const allEvents = [
        ...this.events.map((event) => ({
          ...event,
          type: "activity",
          start: event.start || event.startTime || event.from,
          end: event.end || event.endTime || event.to,
        })),
        ...this.specialHours.map((task) => ({
          ...task,
          type: "task",
          title: task.title || task.name || task.class,
          content: task.content || task.label,
          start: task.start || task.startTime || task.from,
          end: task.end || task.endTime || task.to,
        })),
      ];

      // 按结束时间排序
      const sortedEvents = allEvents.sort((a, b) => {
        const aEnd = new Date(a.end);
        const bEnd = new Date(b.end);
        return aEnd - bEnd;
      });

      console.log("specialHours raw:", this.specialHours);
      console.log("sortedEvents:", sortedEvents);

      return sortedEvents;
    },
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
    this.updateEvents(); // 只需要调用一次，会同时获取活动和任务数据
  },
  watch: {
    // 监听视图模式变化
    viewMode: {
      handler() {
        // 切换视图时刷新数据
        this.updateEvents();
      },
      immediate: false, // 不需要在初始化时执行
    },
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
        this.$apis
          .createEvent(
            this.eventStart,
            this.eventEnd,
            this.eventName,
            this.eventContent
          )
          .then(() => {
            // 等待创建成功后再更新事件列表
            return this.updateEvents();
          })
          .then(() => {
            this.eventDialogVisible = false;
            this.resetDialogFields();
            this.$message.success("事件创建成功");
          })
          .catch((error) => {
            this.$message.error(`创建失败：${error.message}`);
          });
      }
    },
    transferToStudent() {
      this.$var.auth.role = "student";
      //后端更新身份
      this.$forceUpdate();
    },
    handleDateClick(date) {
      console.log("日期点击事件触发: ", date);
      this.selectedDate = date;
      this.greetingMessage = this.generateGreeting(date); // 生成问候信息
      this.dialogVisible = true;
    },
    generateGreeting(date) {
      const hour = new Date(date).getHours();
      let greeting = "祝你有美好的一天！";

      if (hour < 12) {
        greeting = "早上好！新的一天，新的开始！";
      } else if (hour < 18) {
        greeting = "下午好！继续加油！";
      } else {
        greeting = "晚上好！辛苦了一天，注意休息！";
      }

      const day = new Date(date).getDay();
      if (day === 0 || day === 6) {
        greeting += " 周末愉快！";
      }

      return greeting;
    },
    // 路由跳转方法,一些信息应该可以不跳转，直接就展示出来
    goToProfile() {
      this.$router.push({ path: "/user" });
    },
    goToClass() {
      this.$router.push({ path: "/class/view" });
    },
    goToTags() {
      this.tagDialogOpen = true;
    },
    goToActivities() {
      // 教师创建活动
      if (this.$var.auth.role === "teacher") {
        this.taskDialogVisible = true;
        this.getClassList();
      } else {
        this.$router.push({ path: "/activity" });
      }
    },
    /**
     * @deprecated use `goToActivities` instead
     */
    goToSchoolActivities() {
      this.$router.push({ path: "/school-activities" });
    },
    goToDDL() {
      this.showTaskList = true;
      this.getTaskList();
    },
    getTaskList() {
      this.$apis.getTaskList().then((response) => {
        this.taskList = response.data.tasks;
      });
    },
    updateUser() {
      this.$apis.getUserInfo(this.$var.auth.id).then((response) => {
        this.username = response.data.name || response.data.username;
        this.userAvatar = response.data.avatar;
        console.log(response.data.username);
      });
    },
    async updateEvents() {
      try {
        this.loading = true;
        const response = await this.$apis.getEvent();
        // 确保数据存在且是数组
        this.events = response.data.events || [];
        this.specialHours = response.data.specialHours || [];
        console.log("Updated events:", this.events);
        console.log("Updated specialHours:", this.specialHours);
      } catch (error) {
        this.$utils.handleHttpException(error);
        // 出错时清空数据
        this.events = [];
        this.specialHours = [];
      } finally {
        this.loading = false;
      }
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
    // 获取班级列表
    getClassList() {
      this.$apis.getClassList().then((response) => {
        this.classList = response.data.class;
      });
    },
    // 创建任务
    assignTaskToClass() {
      if (!this.taskForm.classId) {
        this.$message.error("请选择班级");
        return;
      }

      if (
        !this.taskForm.title ||
        !this.taskForm.content ||
        !this.taskForm.start ||
        !this.taskForm.end
      ) {
        this.$message.error("请填写完整信息");
        return;
      }

      this.$apis
        .assignTaskToClass(this.taskForm.classId, {
          title: this.taskForm.title,
          content: this.taskForm.content,
          start: this.taskForm.start,
          end: this.taskForm.end,
        })
        .then(() => {
          this.$message.success("创建成功");
          this.taskDialogVisible = false;
          this.resetTaskForm();
        })
        .catch((error) => {
          this.$message.error("创建失败：" + error.message);
        });
    },
    // 重置表单
    resetTaskForm() {
      this.taskForm = {
        title: "",
        content: "",
        start: "",
        end: "",
        classId: "",
      };
    },
    // 计算进度条百分比
    calculateProgress(startTime, endTime) {
      const startDate = new Date(startTime).getTime();
      const endDate = new Date(endTime).getTime();
      const now = new Date().getTime();

      if (now < startDate) return 0;
      if (now > endDate) return 100;

      return Math.round(((now - startDate) / (endDate - startDate)) * 100);
    },
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString();
    },

    getStatusType(item) {
      const now = new Date();
      const start = new Date(item.start || item.start);
      const end = new Date(item.end || item.end);

      if (now < start) return "info";
      if (now > end) return "danger";
      return "success";
    },

    getStatusText(item) {
      const now = new Date();
      const start = new Date(item.start || item.start);
      const end = new Date(item.end || item.end);

      if (now < start) return "未开始";
      if (now > end) return "已结束";
      return "进行中";
    },

    getProgressStatus(task) {
      if (task.type === "task" && task.completed) {
        return "success";
      }
      const progress = this.calculateProgress(task.start, task.end);
      if (progress >= 100) return "success";
      return "";
    },

    async handleTaskComplete(task) {
      try {
        await this.$apis.updateTaskStatus(task.id, {
          percentage: task.completed ? 100 : 0,
        });

        this.$message.success(task.completed ? "任务已完成" : "已取消完成状态");
        // 刷新数据
        await this.updateEvents();
      } catch (error) {
        // 恢复状态
        task.completed = !task.completed;
        this.$utils.handleHttpException(error);
      }
    },
  },
};
</script>

<style scoped>
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

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-content {
  font-size: 14px;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
}

.task-time {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 12px;
}

.app-aside {
  background-color: #fafafa;
  border-right: 1px solid #eaeaea;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.back-button {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
}

.task-scrollbar {
  padding: 0 10px;
}

.task-item {
  margin: 16px 0;
}

.task-card {
  border-radius: 8px;
  border: none;
  transition: all 0.2s ease;
  background-color: #fff;
  margin-bottom: 8px;
}

.task-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.deadline-tag {
  background-color: #f6f8ff;
  color: #409eff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  padding: 2px 4px;
}

.task-content {
  font-size: 14px;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  padding: 16px 0;
  color: #606266;
  line-height: 1.6;
}

.el-progress {
  margin: 16px 0;
}

.task-time {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 12px;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
}

.el-link {
  font-size: 15px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;
}

.el-link:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

:deep(.el-progress-bar__outer) {
  border-radius: 4px;
  background-color: #f0f0f0;
  height: 6px !important;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
  transition: all 0.3s ease;
}

.task-scrollbar :deep(.el-scrollbar__bar) {
  width: 6px;
}

.task-scrollbar :deep(.el-scrollbar__thumb) {
  background-color: #ccc;
  opacity: 0.3;
}

.task-scrollbar :deep(.el-scrollbar__thumb:hover) {
  opacity: 0.5;
}

.aside-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
}

.aside-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.menu-list {
  padding: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: #f0f6ff;
}

.menu-item i {
  font-size: 18px;
  margin-right: 12px;
  color: #666;
}

.menu-item span {
  font-size: 14px;
  color: #333;
}

.create-schedule-btn {
  background: linear-gradient(45deg, #4caf50, #45a049);
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.2);
}

.create-schedule-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  background: linear-gradient(45deg, #45a049, #4caf50);
}

.create-schedule-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
}

:deep(.el-dialog__body) {
  padding: 20px 30px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-date-picker) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  min-height: 80px;
}

:deep(.el-dialog__footer) {
  padding: 10px 30px 20px;
  border-top: 1px solid #eee;
}

.view-switch {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.task-list-view {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.task-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-tag {
  font-size: 12px;
}

.content-cell {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table__header) {
  font-weight: 600;
}

:deep(.el-table__row) {
  cursor: pointer;
  transition: all 0.1s;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

:deep(.el-progress) {
  margin: 0;
}
</style>
