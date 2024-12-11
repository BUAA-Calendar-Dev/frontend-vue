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
              @click="showTaskDetail(task)"
            >
              <el-col :span="20">
                <task-card :task="task" :tagList="tagList" />
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
              <span>任务标签</span>
            </div>

            <!-- 活动 -->
            <div class="menu-item" @click="createClassTask">
              <i class="el-icon-bell"></i>
              <span>创建班级提醒</span>
            </div>

            <!-- 浏览全校活动 / DDL -->
            <div class="menu-item" @click="goToActivities">
              <i class="el-icon-bell"></i>
              <span>活动</span>
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
                <div class="action-buttons">
                  <el-button
                    @click="customEventCreation"
                    class="create-schedule-btn"
                    type="primary"
                    round
                  >
                    <el-icon><Calendar /></el-icon>
                    创建新日程
                  </el-button>
                  <el-button
                    @click="customTaskCreation"
                    class="create-task-btn"
                    type="warning"
                    round
                  >
                    <el-icon><List /></el-icon>
                    创建新任务
                  </el-button>
                </div>
              </span>
              <!-- 右侧头像 -->
              <!-- 右侧头像和用户名 -->
              <div style="display: flex; align-items: center">
                <!-- 用像 -->
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
              <el-radio-button label="calendar" style="color: #000"
                >日历视图</el-radio-button
              >
              <el-radio-button label="list" style="color: #000"
                >列表视图</el-radio-button
              >
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
            :events="calendarEvents"
            @event-click="onEventClick"
            :on-event-click="onEventClick"
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
                  <div class="content-cell">{{ scope.row.content }}</div>
                </template>
              </el-table-column>

              <el-table-column label="开始时间" prop="start" min-width="160">
                <template #default="scope">
                  {{ new Date(scope.row.start).toLocaleString() }}
                </template>
              </el-table-column>

              <el-table-column
                label="结时间"
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
                    v-if="scope.row.is_task"
                    v-model="scope.row.completed"
                    @change="handleTaskComplete(scope.row)"
                    :disabled="
                      calculateProgress(scope.row.start, scope.row.end) >= 100
                    "
                    class="task-checkbox"
                    :class="{ 'is-completed': scope.row.completed }"
                  >
                    完成
                  </el-checkbox>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 弹窗：创建新日程 -->
          <el-dialog
            title="创建新日程"
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
      <h4>收到消息</h4>
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
      <el-form-item label="开始时" required>
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
  <!-- 修改活动详情弹窗 -->
  <el-dialog
    v-model="eventDetailVisible"
    :title="selectedEvent?.title"
    width="600px"
  >
    <div v-if="selectedEvent" class="event-detail">
      <!-- 现有的标题和标签部分 -->
      <div class="detail-header">
        <h3 class="detail-title">{{ selectedEvent.title }}</h3>
        <!-- 修改颜色选择器 -->
        <div class="color-picker-section">
          <span class="label">事件颜色：</span>
          <div class="color-options">
            <el-radio-group
              v-model="selectedEvent.color"
              @change="handleColorChange"
            >
              <el-radio-button
                v-for="color in presetColors"
                :key="color.value"
                :label="color.value"
                :class="['color-option', color.class]"
              >
                {{ color.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div
          class="event-tags"
          v-if="selectedEvent.tags && selectedEvent.tags.length > 0"
        >
          <el-tag
            v-for="tagId in selectedEvent.tags"
            :key="tagId"
            size="small"
            :style="{
              backgroundColor: 'transparent',
              color: getTagColor(tagId),
              borderColor: getTagColor(tagId),
            }"
          >
            {{ getTagName(tagId) }}
          </el-tag>
        </div>
      </div>

      <!-- 其他详情内容 -->
      <div class="detail-item">
        <span class="label">开始时间：</span>
        <span>{{ formatDateTime(selectedEvent.start) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">结束时间：</span>
        <span>{{ formatDateTime(selectedEvent.end) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">活动内容：</span>
        <div
          class="markdown-body"
          v-html="renderMarkdown(String(selectedEvent.content || ''))"
        ></div>
      </div>
    </div>
  </el-dialog>
  <!-- 添加创建任务的弹窗 -->
  <el-dialog
    title="创建新任务"
    v-model="personalTaskDialogVisible"
    width="500px"
    @close="resetTaskDialogFields"
  >
    <el-form :model="personalTaskForm" label-width="100px">
      <el-form-item label="任务名称" required>
        <el-input
          v-model="personalTaskForm.name"
          placeholder="请输入任务名称"
        />
      </el-form-item>
      <el-form-item label="开始时间" required>
        <el-date-picker
          v-model="personalTaskForm.start"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>
      <el-form-item label="结束时间" required>
        <el-date-picker
          v-model="personalTaskForm.end"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>
      <el-form-item label="任务内容" required>
        <el-input
          v-model="personalTaskForm.content"
          type="textarea"
          rows="3"
          placeholder="请输入任务内容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="personalTaskDialogVisible = false">取</el-button>
      <el-button type="primary" @click="createTask">确定</el-button>
    </template>
  </el-dialog>
  <!-- 修改任务详情弹窗 -->
  <el-dialog
    v-model="taskDetailVisible"
    title="任务详情"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form v-if="selectedTask" :model="selectedTask" label-width="100px">
      <el-form-item label="任名称" required>
        <el-input v-model="selectedTask.name" placeholder="请输入任务名称" />
      </el-form-item>

      <el-form-item label="开始时间" required>
        <el-date-picker
          v-model="selectedTask.start"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>

      <el-form-item label="结束时间" required>
        <el-date-picker
          v-model="selectedTask.end"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>

      <el-form-item label="任务内容" required>
        <el-input
          v-model="selectedTask.content"
          type="textarea"
          rows="4"
          placeholder="输入任务内容"
        />
      </el-form-item>

      <el-form-item label="完成状态">
        <el-checkbox
          v-model="selectedTask.completed"
          :disabled="
            calculateProgress(selectedTask.start, selectedTask.end) >= 100
          "
        >
          已完成
        </el-checkbox>
      </el-form-item>

      <!-- 添加标签选择 -->
      <el-form-item label="任务标签">
        <el-select
          v-model="selectedTask.tags"
          multiple
          filterable
          placeholder="请选择标签"
          @visible-change="loadTags"
          :loading="loadingTags"
          class="tag-select"
        >
          <el-option
            v-for="tag in tagList"
            :key="tag.id"
            :label="tag.title"
            :value="tag.id"
          >
            <div class="tag-option">
              <div
                class="tag-color"
                :style="{ backgroundColor: tag.color || '#409EFF' }"
              ></div>
              <span>{{ tag.title }}</span>
            </div>
          </el-option>
        </el-select>
        <!-- 修改已选标签的显示部分 -->
        <div class="selected-tags">
          <el-tag
            v-for="tagId in selectedTask.tags"
            :key="tagId"
            :style="{ backgroundColor: getTagColor(tagId) + '20' }"
            class="tag-item"
            closable
            @close="removeTag(tagId)"
          >
            <div class="tag-item-content">
              <div
                class="tag-color-dot"
                :style="{ backgroundColor: getTagColor(tagId) }"
              ></div>
              <span>{{ getTagName(tagId) }}</span>
            </div>
          </el-tag>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="taskDetailVisible = false">取消</el-button>
        <el-button type="primary" @click="updateTask" :loading="updating">
          保存修改
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { Message, Calendar, List } from "@element-plus/icons-vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css"; // 导入样式
</script>

<script>
import MessageList from "@/components/MessageList.vue";
import TagDialogInner from "@/components/TagDialogInner.vue";
import { ElMessageBox } from "element-plus";
import TaskCard from "@/components/TaskCard.vue";

export default {
  name: "HomeView",
  component: {
    MessageList,
    TaskCard,
  },
  data() {
    return {
      messageList: [],
      unread: 0,
      message_drawer: false,
      userAvatar: "/favicon.ico",
      username: "",
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
      personalTaskDialogVisible: false,
      taskForm: {
        title: "",
        content: "",
        start: "",
        end: "",
        classId: "", // 选中的班级ID
      },
      personalTaskForm: {
        name: "",
        start: "",
        end: "",
        content: "",
      },
      classList: [], // 班级列表
      taskList: [], // 存储任务列表
      showTaskList: false, // 控任务列表的显示
      greetingMessage: "", // 加问候信息的状态
      viewMode: "", // 将默认值改为空字符串
      activities: [], // 添加活动列表数据
      loading: false, // 添加加载状态
      eventDetailVisible: false,
      selectedEvent: null,
      taskDetailVisible: false,
      selectedTask: null,
      updating: false,
      tagList: [], // 存储标签列表
      loadingTags: false,
      preferences: {
        activityColor: "#409EFF",
        taskColor: "#F56C6C",
        defaultView: "calendar", // 添加默认视图设置
      },
      presetColors: [
        { value: "blue", label: "蓝色", class: "event-blue" },
        { value: "green", label: "绿色", class: "event-green" },
        { value: "orange", label: "橙色", class: "event-orange" },
        { value: "purple", label: "紫色", class: "event-purple" },
        { value: "red", label: "红色", class: "event-red" },
      ],
    };
  },
  computed: {
    calendarEvents() {
      let calendarEvents = this.events.map((event) => {
        const start = new Date(event.start || event.startTime || event.from);
        const end = new Date(event.end || event.endTime || event.to);

        // 根据事件类型和颜色设置不同的 CSS 类
        let cssClass = event.is_task ? "task-event" : "activity-event";

        // 如果有预设颜色，添加对应的颜色类
        if (event.color) {
          const colorClass = this.presetColors.find(
            (c) => c.value === event.color
          )?.class;
          if (colorClass) {
            cssClass = colorClass;
          }
        }

        // 检查事件是否跨越多天
        if (
          start < end &&
          (start.getDate() !== end.getDate() ||
            start.getMonth() !== end.getMonth() ||
            start.getFullYear() !== end.getFullYear())
        ) {
          // 如果事件跨越多天，将开始时间设置为结束时间的前一个小时
          const displayStart = new Date(end);
          displayStart.setHours(displayStart.getHours() - 3, 0, 0, 0); // 设置为结束时间的前一个小时

          // 格式化时间为 YYYY-MM-DD HH:MM
          const formatTime = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            return `${year}-${month}-${day} ${hours}:${minutes}`;
          };

          return {
            ...event,
            start: formatTime(displayStart),
            end: formatTime(end),
            cssClass,
            class: cssClass,
          };
        }

        // 如果事件不跨越多天，直接返回原始事件
        return {
          ...event,
          cssClass,
          class: cssClass,
        };
      });

      console.log("calendarEvents: ", calendarEvents);
      return calendarEvents;
    },

    sortedEvents() {
      const now = new Date();
      return [...this.events].sort((a, b) => {
        const aStart = new Date(a.start);
        const aEnd = new Date(a.end);
        const bStart = new Date(b.start);
        const bEnd = new Date(b.end);

        // 判断是否已结束
        const aExpired = now > aEnd;
        const bExpired = now > bEnd;

        // 1. 已结束的放在最后
        if (aExpired && !bExpired) return 1;
        if (!aExpired && bExpired) return -1;

        // 2. 如状相同（都结束或未结），按开始时间倒序排列
        if (aExpired === bExpired) {
          // 开始时间晚的排在前面
          return bStart - aStart;
        }

        return 0;
      });
    },
  },
  async mounted() {
    if (!this.$var.auth.isValid()) {
      ElMessageBox.alert("登录失效！", { type: "warning" });
      this.$router.push({ path: "/" });
    } else {
      await this.loadPreferences(); // 先加载偏好设置
      this.viewMode = this.preferences.defaultView; // 根据偏好设置初始化视图模式
      await this.updateUser();
      await this.loadTags();
      await this.updateEvents();
      await this.updateMessage();
    }
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
      this.eventStart = "";
      this.eventEnd = "";
      this.eventContent = "";
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
            this.resetDialogFields(); // 清空表单
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
      let greeting = "祝你美好的一天！";

      if (hour < 12) {
        greeting = "早上好！新的一天，新的开始！";
      } else if (hour < 18) {
        greeting = "下午好！继续加油！";
      } else {
        greeting = "晚上好！辛苦了一天，意休息！";
      }

      const day = new Date(date).getDay();
      if (day === 0 || day === 6) {
        greeting += " 末愉快！";
      }

      return greeting;
    },
    // 路由跳转方法,一些息应该可以不跳转，直接就展示出来
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
      this.$router.push({ path: "/activity" });
    },
    createClassTask() {
      this.taskDialogVisible = true;
      this.getClassList();
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
    async updateUser() {
      try {
        const response = await this.$apis.getUserInfo(this.$var.auth.id);
        if (response.data) {
          this.username = response.data.name || response.data.username; // 优先使用 name，如果没有则使用 username
          this.userAvatar = response.data.avatar || "/favicon.ico";
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },
    async updateEvents() {
      try {
        this.loading = true;
        const response = await this.$apis.getEvent();
        this.events = (response.data.events || []).map((event) => ({
          ...event,
          tags: event.tags || [], // 确保有 tags 属性
          title: event.name || event.title, // 统一标题字段
          content: event.content || "", // 确保有 content 属性
        }));
        this.specialHours = response.data.specialHours || [];

        // 打印检查数据
        console.log("Updated events with tags:", this.events);
      } catch (error) {
        this.$utils.handleHttpException(error);
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
    // 获取班级列
    getClassList() {
      this.$apis.getClassList().then((response) => {
        this.classList = response.data.class;
      });
    },
    // 创建务
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
    formatDateTime(time) {
      if (!time) return "未设置";
      return new Date(time).toLocaleString();
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
      if (task.is_task && task.completed) {
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
    async onEventClick(event) {
      console.log("Clicked event:", event);
      await this.loadTags();
      this.selectedEvent = {
        ...event,
        tags: event.tags || [],
        title: event.name || event.title,
        content: event.content || "",
        color:
          event.color ||
          (event.is_task
            ? this.preferences.taskColor
            : this.preferences.activityColor),
      };
      this.eventDetailVisible = true;
    },
    // 添加 markdown 渲染方法
    renderMarkdown(content) {
      try {
        return this.$md.render(String(content || ""));
      } catch (error) {
        console.error("Markdown rendering error:", error);
        return "";
      }
    },
    customTaskCreation() {
      this.personalTaskDialogVisible = true;
    },
    resetTaskDialogFields() {
      this.personalTaskForm = {
        name: "",
        start: "",
        end: "",
        content: "",
      };
    },
    createTask() {
      if (
        !this.personalTaskForm.name.trim() ||
        !this.personalTaskForm.start ||
        !this.personalTaskForm.end ||
        !this.personalTaskForm.content.trim()
      ) {
        this.$message.error("请填写完整信息");
        return;
      }

      if (
        new Date(this.personalTaskForm.start) >=
        new Date(this.personalTaskForm.end)
      ) {
        this.$message.error("开始时间须早于结束时间");
        return;
      }

      this.$apis
        .createTask({
          title: this.personalTaskForm.name,
          start: this.personalTaskForm.start,
          end: this.personalTaskForm.end,
          content: this.personalTaskForm.content,
        })
        .then(() => {
          this.personalTaskDialogVisible = false;
          this.resetTaskDialogFields();
          this.updateEvents();
          this.$message.success("任务创建成功");
        })
        .catch((error) => {
          this.$message.error(`创建失败：${error.message}`);
        });
    },
    showTaskDetail(task) {
      this.selectedTask = {
        ...task,
        tags: task.tags || [],
      };
      this.taskDetailVisible = true;
      this.loadTags(); // 加载标签列表
    },
    async updateTask() {
      // 表单验证
      if (!this.selectedTask.name.trim()) {
        this.$message.error("请输入任务名称");
        return;
      }
      if (!this.selectedTask.start) {
        this.$message.error("选择开始时间");
        return;
      }
      if (!this.selectedTask.end) {
        this.$message.error("请选择结束时间");
        return;
      }
      if (!this.selectedTask.content.trim()) {
        this.$message.error("请输入任务内容");
        return;
      }

      // 验证时间
      if (
        new Date(this.selectedTask.start) >= new Date(this.selectedTask.end)
      ) {
        this.$message.error("开始时间必须早于结束时间");
        return;
      }

      // 格式化时间为 YYYY-MM-DD HH:mm
      const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      };

      this.updating = true;
      try {
        await this.$apis.updateTask(this.selectedTask.id, {
          title: this.selectedTask.name,
          content: this.selectedTask.content,
          start: formatDateTime(this.selectedTask.start),
          end: formatDateTime(this.selectedTask.end),
          percentage: this.selectedTask.completed ? 100 : 0,
          tags: this.selectedTask.tags, // 添加标签数据
        });

        this.$message.success("任务更新成功");
        this.taskDetailVisible = false;
        await this.updateEvents(); // 刷新任务列表
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.updating = false;
      }
    },
    // 加载标签列表
    async loadTags() {
      if (this.tagList.length === 0) {
        // 只在标签列表为空时加载
        this.loadingTags = true;
        try {
          const response = await this.$apis.getTagList();
          this.tagList = response.data.tags.map((tag) => ({
            ...tag,
            color: tag.color || "#409EFF",
          }));
        } catch (error) {
          this.$utils.handleHttpException(error);
        } finally {
          this.loadingTags = false;
        }
      }
    },
    // 获取标签颜色
    getTagColor(tagId) {
      const tag = this.tagList.find((t) => t.id === tagId);
      return tag ? tag.color : "#409EFF";
    },
    // 获取标签名称
    getTagName(tagId) {
      const tag = this.tagList.find((t) => t.id === tagId);
      return tag ? tag.title : "";
    },
    // 移除标签
    removeTag(tagId) {
      this.selectedTask.tags = this.selectedTask.tags.filter(
        (id) => id !== tagId
      );
    },
    // 添加加载偏好设置的方法
    async loadPreferences() {
      try {
        const response = await this.$apis.getUserPreferences();
        if (response.data && response.data.preference) {
          this.preferences = {
            ...this.preferences,
            ...response.data.preference,
          };
          console.log(this.preferences);
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },
    async handleColorChange(color) {
      try {
        await this.$apis.modifyEventColor(
          this.selectedEvent.id,
          color,
          this.selectedEvent.is_task
        );

        // 更新本地事件列表中的颜色
        const eventIndex = this.events.findIndex(
          (e) =>
            e.id === this.selectedEvent.id &&
            e.is_task === this.selectedEvent.is_task
        );
        if (eventIndex !== -1) {
          this.events[eventIndex].color = color;
        }

        // 强制更新视图
        this.$forceUpdate();

        this.$message.success("颜色修改成功");
      } catch (error) {
        this.$message.error("修改颜色失败：" + error.message);
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
  line-height: 1.4;
  padding: 4px 0;
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

.task-checkbox {
  transition: all 0.3s ease;
}

.task-checkbox.is-completed
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #67c23a;
  border-color: #67c23a;
}

.task-checkbox.is-completed
  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #67c23a;
}

.event-detail {
  padding: 20px;
}

.detail-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.detail-item .label {
  font-weight: 600;
  color: #606266;
  margin-right: 10px;
  display: inline-block;
  width: 80px;
}

.detail-item .content {
  margin-top: 10px;
  white-space: pre-wrap;
  line-height: 1.6;
  color: #303133;
  font-size: 14px;
}

/* 修改 markdown 内容样式 */
.markdown-body {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  margin-top: 10px;
}

:deep(.markdown-body) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

:deep(.markdown-body img) {
  max-width: 100%;
  height: auto;
}

:deep(.markdown-body pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
}

:deep(.markdown-body code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 6px;
}

.action-buttons {
  display: inline-flex;
  gap: 16px;
  margin-left: 16px;
}

.create-schedule-btn {
  background: linear-gradient(45deg, #4caf50, #45a049);
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.2);
}

.create-task-btn {
  background: linear-gradient(45deg, #ff9800, #f57c00);
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(255, 152, 0, 0.2);
}

.create-schedule-btn:hover,
.create-task-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.create-schedule-btn:active,
.create-task-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.el-icon) {
  font-size: 16px;
}

.task-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.task-item:hover {
  transform: translateY(-2px);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.task-content-text {
  margin: 8px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

.task-content {
  font-size: 14px;
  padding: 16px 0;
  color: #606266;
}

/* 添加标签选择器的样式 */
:deep(.el-select) {
  width: 100%;
}

:deep(.el-select__tags) {
  flex-wrap: wrap;
}

.tag-select {
  margin-bottom: 8px;
}

.tag-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag-item {
  border: none;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
}

.tag-item-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tag-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

:deep(.el-tag .el-tag__close) {
  color: #606266;
}

:deep(.el-tag .el-tag__close:hover) {
  color: #303133;
  background-color: transparent;
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
  gap: 4px;
}

.task-card .tag-item-content {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.task-card .tag-color-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/* 确保标签在卡片中正确显示 */
.task-card :deep(.el-tag) {
  margin: 0;
  padding: 0 6px;
  height: 20px;
  line-height: 20px;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
}

.event-detail .tag-item-content {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.event-detail .tag-color-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.event-detail :deep(.el-tag) {
  height: 22px;
  line-height: 22px;
  padding: 0 8px;
}

.detail-header {
  margin-bottom: 20px;
  text-align: center;
}

.detail-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #303133;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.event-detail :deep(.el-tag) {
  height: 24px;
  padding: 0 10px;
  font-size: 12px;
}

/* 移除不需要的样式 */
.event-detail .tag-item-content,
.event-detail .tag-color-dot {
  display: none;
}

.vuecal__event.activity-event {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}

.vuecal__event.task-event {
  background-color: v-bind("preferences.taskColor");
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}

/* 移除之前的活动颜色相关样式，现在直接使用 bgcolor 属性设置颜色 */
:deep(.activity-event) {
  background-color: v-bind("preferences.activityColor");
  color: #ffffff;
}

/* 移除之前的活动颜色相关样式，现在直接使用 bgcolor 属性设置颜色 */
:deep(.task-event) {
  background-color: v-bind("preferences.taskColor");
  color: #ffffff;
}

:deep(.vuecal__event:hover) {
  transform: scale(1.02);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  opacity: 0.9;
}

:deep(.vuecal__event:hover) {
  transform: scale(1.02);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  opacity: 0.9;
}

:deep(.vuecal__cell) {
  background-color: v-bind("preferences.theme"); /* 单元��景色 */
}

:deep(.vuecal__title-bar) {
  background-color: v-bind("preferences.theme"); /* 标题栏背景色 */
}

:deep(.vuecal__weekdays-headings) {
  background-color: v-bind("preferences.theme"); /* 星期标题背景色 */
}

:deep(.vuecal__menu) {
  background-color: v-bind("preferences.theme");
}
:deep(.vuecal__time-column) {
  background-color: v-bind("preferences.theme");
}

.color-picker-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0;
  gap: 8px;
}

.color-picker-section .label {
  font-size: 14px;
  color: #606266;
}

/* 预设颜色选项的样式 */
.color-options {
  display: flex;
  gap: 8px;
}

.color-option {
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 日历事件的预设颜色样式 */
:deep(.event-blue) {
  background-color: #409eff !important;
  border-color: #409eff !important;
  color: white !important;
}

:deep(.event-green) {
  background-color: #67c23a !important;
  border-color: #67c23a !important;
  color: white !important;
}

:deep(.event-orange) {
  background-color: #e6a23c !important;
  border-color: #e6a23c !important;
  color: white !important;
}

:deep(.event-purple) {
  background-color: #d88aee !important;
  border-color: #d88aee !important;
  color: white !important;
}

:deep(.event-red) {
  background-color: #f56c6c !important;
  border-color: #f56c6c !important;
  color: white !important;
}

/* 颜色选项按钮样式 */
:deep(.el-radio-button__inner) {
  border: none;
  padding: 8px 16px;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  box-shadow: none;
  background-color: inherit;
}

:deep(.el-radio-button.event-blue .el-radio-button__inner) {
  background-color: #409eff;
  color: white;
  border-color: transparent;
}

:deep(.el-radio-button.event-green .el-radio-button__inner) {
  background-color: #67c23a;
  color: white;
  border-color: transparent;
}

:deep(.el-radio-button.event-orange .el-radio-button__inner) {
  background-color: #e6a23c;
  color: white;
  border-color: transparent;
}

:deep(.el-radio-button.event-purple .el-radio-button__inner) {
  background-color: #d88aee;
  color: white;
  border-color: transparent;
}

:deep(.el-radio-button.event-red .el-radio-button__inner) {
  background-color: #f56c6c;
  color: white;
  border-color: transparent;
}

:deep(.el-radio-button.is-active .el-radio-button__inner) {
  color: white !important;
  background-color: transparent !important;
  border-color: #dcdfe6 !important;
  box-shadow: -1px 0 0 0 #dcdfe6 !important;
  transform: scale(1.05);
}

:deep(.el-radio-button:hover .el-radio-button__inner) {
  opacity: 0.9;
  transform: scale(1.05);
}

:deep(.el-radio-button .el-radio-button__inner) {
  transition: all 0.3s ease;
}

/* 修改视图切换按钮的样式 */
:deep(.el-radio-button__inner) {
  color: #000 !important;
}

:deep(.el-radio-button.is-active .el-radio-button__inner) {
  color: #000 !important;
  background-color: transparent !important;
  border-color: #dcdfe6 !important;
  box-shadow: -1px 0 0 0 #dcdfe6 !important;
}

:deep(.el-radio-button:not(.is-active):hover .el-radio-button__inner) {
  color: #000 !important;
}
</style>
