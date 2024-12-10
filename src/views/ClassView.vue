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
          <el-card class="class-card" shadow="hover">
            <div class="class-info">
              <div class="class-header">
                <h2 class="class-name">{{ item.name }}</h2>
                <div class="class-introduction" v-if="item.introduction">
                  {{ item.introduction }}
                </div>
              </div>
              <div class="class-detail">
                <div class="student-count">
                  <el-icon><User /></el-icon>
                  <span>{{ item.count }} 位学生</span>
                </div>
                <div class="teacher-list">
                  <span class="label">班级教师：</span>
                  <div class="teacher-names">
                    {{ item.teacher.join("、") }}
                  </div>
                </div>
              </div>
            </div>
            <div class="class-actions">
              <el-button
                v-if="$var.auth.role == 'student'"
                type="primary"
                @click="updateClassDDLList(item.id)"
              >
                查看班级任务
              </el-button>
              <template v-if="$var.auth.role == 'teacher'">
                <el-button type="primary">管理班级</el-button>
                <el-button type="primary" @click="openTaskDialog(item.id)"
                  >布置班级任务</el-button
                >
                <el-button type="primary" @click="openMessageDialog(item.id)"
                  >发布班级消息</el-button
                >
              </template>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-container>
    <el-dialog
      v-model="showDDLList"
      title="班级任务列表"
      width="90%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      align-center
    >
      <el-table
        :data="currentDDLList"
        style="width: 100%"
        align="center"
        :max-height="tableHeight"
        border
      >
        <el-table-column
          property="title"
          label="任务名称"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          property="content"
          label="任务内容"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column label="时间" min-width="180">
          <template #default="scope">
            <div class="task-time">
              <el-tag size="small" type="info">
                {{ new Date(scope.row.start).toLocaleString() }}
              </el-tag>
              <el-tag size="small" type="warning">
                {{ new Date(scope.row.end).toLocaleString() }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="150">
          <template #default="scope">
            <div class="task-tags">
              <el-tag
                v-for="tag in scope.row.tags"
                :key="tag"
                size="small"
                class="task-tag"
                type="success"
              >
                {{ tag }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="进度" min-width="180">
          <template #default="scope">
            <el-progress
              :percentage="calculateProgress(scope.row.start, scope.row.end)"
              :status="getProgressStatus(scope.row)"
              :stroke-width="12"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      v-model="showMessageDialog"
      title="发布班级消息"
      width="50%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <el-form :model="messageForm" label-width="80px">
        <el-form-item label="消息标题">
          <el-input v-model="messageForm.title" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input
            v-model="messageForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入消息内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showMessageDialog = false">取消</el-button>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="showTaskDialog"
      title="布置班级任务"
      width="60%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="taskForm"
        :rules="taskRules"
        ref="taskFormRef"
        label-width="100px"
      >
        <el-form-item label="任务标题" prop="title">
          <el-input v-model="taskForm.title" placeholder="请输入任务标题" />
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input
            v-model="taskForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入任务内容"
          />
        </el-form-item>
        <el-form-item label="时间范围" prop="timeRange">
          <el-date-picker
            v-model="taskForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="defaultTime"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showTaskDialog = false">取消</el-button>
          <el-button type="primary" @click="submitTask">发布任务</el-button>
        </span>
      </template>
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

.task-time {
  display: flex;
  gap: 8px;
  justify-content: center;
  white-space: nowrap;
}

.task-tags {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: nowrap;
  overflow: hidden;
}

.task-tag {
  white-space: nowrap;
}

:deep(.el-dialog) {
  margin-top: 5vh !important;
}

:deep(.el-dialog__body) {
  padding: 10px 20px;
}

:deep(.el-table) {
  --el-table-header-bg-color: #f5f7fa;
  --el-table-border-color: #ebeef5;
}

:deep(.el-table__header-wrapper) {
  background-color: var(--el-table-header-bg-color);
}

:deep(.el-table__header th) {
  background-color: var(--el-table-header-bg-color);
  color: #606266;
  font-weight: bold;
}

:deep(.el-progress) {
  margin: 0;
  width: 90%;
}

.class-card {
  transition: all 0.3s;
}

.class-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.class-info {
  padding: 0 10px;
}

.class-header {
  margin-bottom: 15px;
}

.class-name {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #303133;
  text-align: left;
}

.class-introduction {
  color: #909399;
  font-size: 14px;
  text-align: left;
  line-height: 1.4;
  margin-top: 5px;
  /* 超出两行显示省略号 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 当鼠标悬停时显示完整内容 */
.class-introduction:hover {
  -webkit-line-clamp: unset;
  cursor: default;
}

.class-detail {
  color: #606266;
  margin-bottom: 20px;
}

.student-count {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.teacher-list {
  display: flex;
  align-items: flex-start;
  gap: 5px;
}

.label {
  white-space: nowrap;
  color: #606266;
}

.teacher-names {
  color: #409eff;
  font-weight: 500;
}

.class-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-button) {
  padding: 8px 15px;
}

:deep(.el-card__body) {
  padding: 20px;
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
      tableHeight: 0,
      showMessageDialog: false,
      messageForm: {
        title: "",
        content: "",
        classId: null,
      },
      showTaskDialog: false,
      taskForm: {
        title: "",
        content: "",
        tags: [],
        timeRange: null,
        classId: null,
      },
      taskRules: {
        title: [
          { required: true, message: "请输入任务标题", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "请输入任务内容", trigger: "blur" },
        ],
        timeRange: [
          { required: true, message: "请选择时间范围", trigger: "change" },
        ],
      },
      defaultTags: ["作业", "实验", "项目", "测试", "其他"],
      defaultTime: [
        new Date(2000, 1, 1, 8, 0, 0),
        new Date(2000, 1, 1, 23, 59, 59),
      ],
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
    calculateProgress(startTime, endTime) {
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();

      if (now < start) return 0;
      if (now > end) return 100;

      return Math.round(((now - start) / (end - start)) * 100);
    },
    getProgressStatus(task) {
      const progress = this.calculateProgress(task.start, task.end);
      if (progress >= 100) return "danger";
      if (progress >= 80) return "warning";
      return "success";
    },
    calculateTableHeight() {
      this.tableHeight = window.innerHeight * 0.7;
    },
    async updateClassDDLList(id) {
      try {
        const response = await this.$apis.getClassTasks(id);
        this.currentDDLList = response.data.tasks;
        this.showDDLList = true;
        this.$nextTick(() => {
          this.calculateTableHeight();
        });
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },
    openMessageDialog(classId) {
      this.messageForm.classId = classId;
      this.showMessageDialog = true;
    },
    async sendMessage() {
      if (!this.messageForm.title || !this.messageForm.content) {
        this.$message.warning("请填写完整的消息信息");
        return;
      }

      try {
        await this.$apis.sendClassMessage(
          this.messageForm.classId,
          this.messageForm.title,
          this.messageForm.content
        );
        this.$message.success("消息发送成功");
        this.showMessageDialog = false;
        // 重置表单
        this.messageForm.title = "";
        this.messageForm.content = "";
        this.messageForm.classId = null;
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },
    openTaskDialog(classId) {
      this.taskForm.classId = classId;
      this.showTaskDialog = true;
    },
    async submitTask() {
      if (!this.$refs.taskFormRef) return;

      try {
        await this.$refs.taskFormRef.validate();

        // 处理时间范围
        const [startTime, endTime] = this.taskForm.timeRange;

        await this.$apis.assignTaskToClass(this.taskForm.classId, {
          title: this.taskForm.title,
          content: this.taskForm.content,
          tags: this.taskForm.tags,
          start: startTime
            .toLocaleString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .replace(/\//g, "-"),
          end: endTime
            .toLocaleString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .replace(/\//g, "-"),
        });

        this.$message.success("任务发布成功");
        this.showTaskDialog = false;
        // 重置表单
        this.$refs.taskFormRef.resetFields();
        this.taskForm.classId = null;
        this.taskForm.tags = [];

        // 刷新任务列表（如果需要的话）
        if (this.showDDLList) {
          this.updateClassDDLList(this.taskForm.classId);
        }
      } catch (error) {
        if (error.name === "ValidationError") {
          this.$message.warning("请完善表单信息");
        } else {
          this.$utils.handleHttpException(error);
        }
      }
    },
  },
  mounted() {
    if (!this.$var.auth.isValid()) {
      ElMessageBox.alert("登录失效！", { type: "warning" });
      this.$router.push({ path: "/" });
    }
    this.updateClassList();
    window.addEventListener("resize", this.calculateTableHeight);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.calculateTableHeight);
  },
};
</script>
