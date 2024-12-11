<template>
  <div class="admin-header">
    <div class="action-section">
      <el-button type="danger" @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </div>
    <div class="nav-section">
      <el-segmented
        v-model="navChoosed"
        :options="navOptions"
        @change="handleNavChange"
      />
    </div>
    <div class="action-section-placeholder"></div>
  </div>
  <div class="main charts-main" v-if="navChoosed == '数据报表'">
    <!-- 数据概览卡片 -->
    <div class="data-overview">
      <el-row :gutter="20" justify="center" style="margin-top: 20px">
        <el-col :span="6">
          <el-card class="data-card">
            <template #header>
              <div class="card-header">
                <span>用户统计</span>
              </div>
            </template>
            <div class="data-content">
              <div class="total-number">{{ userStats.total }}</div>
              <div class="sub-numbers">
                <div class="sub-item">
                  <span>教师：</span>
                  <span>{{ userStats.teachers }}</span>
                </div>
                <div class="sub-item">
                  <span>学生：</span>
                  <span>{{ userStats.students }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card">
            <template #header>
              <div class="card-header">
                <span>任务统计</span>
              </div>
            </template>
            <div class="data-content">
              <div class="total-number">{{ taskStats.total }}</div>
              <div class="sub-numbers">
                <div class="sub-item">
                  <span>已完成：</span>
                  <span>{{ taskStats.completed }}</span>
                </div>
                <div class="sub-item">
                  <span>进行中：</span>
                  <span>{{ taskStats.inProgress }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card">
            <template #header>
              <div class="card-header">
                <span>活动统计</span>
              </div>
            </template>
            <div class="data-content">
              <div class="total-number">{{ activityStats.total }}</div>
              <div class="sub-numbers">
                <div class="sub-item">
                  <span>总参与人次：</span>
                  <span>{{ activityStats.participants }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表展示区域 -->
    <div class="charts-container">
      <el-row :gutter="20" justify="center">
        <el-col :span="9">
          <el-card class="chart-card">
            <div ref="taskPieChart" class="chart"></div>
          </el-card>
        </el-col>
        <el-col :span="9">
          <el-card class="chart-card">
            <div ref="activityBarChart" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center">
        <el-col :span="18">
          <el-card class="chart-card">
            <div ref="taskLineChart" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
  <div class="main activity-main" v-if="navChoosed == '活动管理'">
    <el-divider> 发布新的活动 </el-divider>
    <div class="new-activity-form">
      <el-form :model="newActivityForm" label-width="100px">
        <el-form-item label="活动名称" required>
          <el-input
            v-model="newActivityForm.name"
            placeholder="请输入活动名称"
          />
        </el-form-item>

        <el-form-item label="开始时间" required>
          <el-date-picker
            v-model="newActivityForm.start"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled-date="disablePastDates"
            :shortcuts="dateShortcuts"
          />
        </el-form-item>

        <el-form-item label="结束时间" required>
          <el-date-picker
            v-model="newActivityForm.end"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled-date="disablePastDates"
            :shortcuts="dateShortcuts"
          />
        </el-form-item>

        <el-form-item label="活动内容" required>
          <el-input
            v-model="newActivityForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入活动内容"
          />
        </el-form-item>

        <el-form-item>
          <div class="form-buttons">
            <div class="left-buttons">
              <el-button type="text" @click="previewContent"
                >Markdown 预览</el-button
              >
            </div>
            <div class="right-buttons">
              <el-button type="primary" @click="handleCreateSubmit"
                >发布活动</el-button
              >
              <el-button @click="resetNewActivityForm">重置</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-divider> 已发布的活动 </el-divider>
    <div class="activity-container">
      <el-card
        v-for="(item, index) in activityList"
        :key="index"
        :name="index"
        class="activity-card"
      >
        <template #header>
          <div class="card-header">
            <h3 class="activity-title">
              {{ item.content?.title || item.name || "标题缺失" }}
            </h3>
            <div class="button-group">
              <el-button type="primary" @click="editActivity(item)"
                >修改</el-button
              >
              <el-button type="danger" @click="deleteActivity(item)"
                >删除</el-button
              >
              <el-button type="success" @click="toggleContent(index)">
                {{ item.contentVisible ? "隐藏内容" : "显示内容" }}
              </el-button>
            </div>
          </div>
        </template>
        <div class="activity-info">
          <div class="info-item">
            <!-- <span class="info-label">活动进度：</span> -->
            <div class="time-progress">
              <el-progress
                :percentage="
                  getTimeProgress(
                    item.content?.start ? new Date(item.start).getTime() : 0,
                    item.content?.end ? new Date(item.end).getTime() : 0
                  )
                "
                :status="
                  getTimeStatus(
                    item.content?.start ? new Date(item.start).getTime() : 0,
                    item.content?.end ? new Date(item.end).getTime() : 0
                  )
                "
                :stroke-width="15"
              >
                <template #default>
                  <span class="progress-label">{{
                    getTimeLabel(
                      item.content?.start ? new Date(item.start).getTime() : 0,
                      item.content?.end ? new Date(item.end).getTime() : 0
                    )
                  }}</span>
                </template>
              </el-progress>
              <div class="time-details">
                <span>{{ item.start || "未设置" }}</span>
                <span>{{ item.end || "未设置" }}</span>
              </div>
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">参与人数：</span>
            <span class="info-content"
              >{{ item.participantCount || 0 }} 人</span
            >
          </div>
          <div
            class="markdown-body"
            style="text-align: left"
            v-show="item.contentVisible"
            v-html="renderMarkdown(item.content?.content || '')"
          ></div>
        </div>
      </el-card>
    </div>
  </div>
  <div class="main class-main" v-if="navChoosed == '班级管理'">
    <el-divider>创建新班级</el-divider>
    <div class="create-class-section">
      <el-form
        ref="createClassForm"
        :model="createClassForm"
        :rules="createClassRules"
        label-width="100px"
        class="create-class-form"
      >
        <el-form-item label="班级名称" prop="title">
          <el-input
            v-model="createClassForm.name"
            placeholder="请输入班级名称（如：220611）"
          />
        </el-form-item>

        <el-form-item label="班级描述" prop="introduction">
          <el-input
            v-model="createClassForm.introduction"
            type="textarea"
            :rows="3"
            placeholder="请输入班级描述"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleCreateClass"
            :loading="creatingClass"
          >
            创建班级
          </el-button>
          <el-button @click="resetCreateForm"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-divider>班级列表</el-divider>
    <div class="class-container">
      <el-card
        v-for="(classItem, index) in classList"
        :key="index"
        class="class-card"
      >
        <template #header>
          <div class="card-header">
            <h3 class="class-title">{{ classItem.name }}</h3>
            <div class="button-group">
              <el-button type="primary" @click="manageStudents(classItem)"
                >管理学生</el-button
              >
              <el-button type="success" @click="manageTeachers(classItem)"
                >管理教师</el-button
              >
            </div>
          </div>
        </template>
        <div class="class-info">
          <div class="info-section">
            <div class="info-item">
              <span class="info-label">班级描述：</span>
              <span class="info-content">{{
                classItem.introduction || "暂无描述"
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">班级人数：</span>
              <span class="info-content">{{ classItem.count || 0 }} 人</span>
            </div>
            <div class="info-item">
              <span class="info-label">课教师：</span>
              <span class="info-content">
                <el-tag
                  v-for="(teacher, idx) in classItem.teacher"
                  :key="idx"
                  size="small"
                  style="margin-right: 5px; margin-bottom: 5px"
                >
                  {{ teacher }}
                </el-tag>
              </span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
  <div class="main user-main" v-if="navChoosed == '用户管理'">
    <el-divider>用户管理</el-divider>
    <div class="user-management">
      <div class="search-section">
        <el-input
          v-model="userSearch"
          placeholder="搜索用户（用户名/姓名/邮箱/电话/ID）"
          clearable
          style="width: 300px; margin-bottom: 20px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <el-table
        :data="filteredUserList"
        stripe
        v-loading="loadingUsers"
        style="width: 100%"
      >
        <el-table-column prop="id" label="用户ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓" width="100" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            {{ scope.row.gender === "male" ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column
          prop="motto"
          label="个性签名"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'teacher' ? 'success' : 'info'">
              {{ scope.row.role === "teacher" ? "教师" : "学生" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              :disabled="scope.row.role === 'teacher'"
              @click="handleImpower(scope.row)"
            >
              提升为教师
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="handleResetPassword(scope.row)"
            >
              重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 重置密码对话框 -->
    <el-dialog
      v-model="resetPasswordDialogVisible"
      title="重置密码"
      width="30%"
      @close="handleResetPasswordDialogClose"
    >
      <el-form
        ref="resetPasswordForm"
        :model="resetPasswordForm"
        :rules="resetPasswordRules"
        label-width="100px"
      >
        <div class="user-info" style="margin-bottom: 20px">
          <p><strong>用户名：</strong>{{ currentUser?.username }}</p>
          <p><strong>姓名：</strong>{{ currentUser?.name }}</p>
        </div>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="resetPasswordForm.password"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="resetPasswordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetPasswordDialogVisible = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="submitResetPassword"
            :loading="resettingPassword"
          >
            确认重置
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <el-dialog v-model="editDialogVisible" title="修改活动" width="500px">
    <template #header>
      <div class="dialog-header">
        <h4 class="dialog-title">修改活动</h4>
      </div>
    </template>
    <el-form :model="editForm" label-width="100px">
      <el-form-item label="活动标题" required>
        <el-input v-model="editForm.title" placeholder="请输入活动标题" />
      </el-form-item>

      <el-form-item label="开始时间" required>
        <el-date-picker
          v-model="editForm.start"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          :disabled-date="disablePastDates"
          :shortcuts="dateShortcuts"
        />
      </el-form-item>

      <el-form-item label="结束时间" required>
        <el-date-picker
          v-model="editForm.end"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          :disabled-date="disablePastDates"
          :shortcuts="dateShortcuts"
          :disabled-time="disableEndTimeBeforeStart"
        />
      </el-form-item>

      <el-form-item label="活动内容" required>
        <el-input
          v-model="editForm.content"
          type="textarea"
          :rows="4"
          placeholder="请输入活动内容"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="form-buttons">
        <div class="left-buttons">
          <el-button type="text" @click="previewEditContent"
            >Markdown 预览</el-button
          >
        </div>
        <div class="right-buttons">
          <el-button type="primary" @click="handleEditSubmit">确定</el-button>
          <el-button @click="editDialogVisible = false">取消</el-button>
        </div>
      </div>
    </template>
  </el-dialog>

  <!-- 管理学生对话框 -->
  <el-dialog
    v-model="studentDialogVisible"
    :title="`管理 ${currentClass?.title || ''} 班级学生`"
    width="60%"
  >
    <div class="manage-dialog-content">
      <div class="search-section">
        <el-input
          v-model="studentSearch"
          placeholder="搜索学生"
          clearable
          style="margin-bottom: 15px"
        />
      </div>
      <el-table
        :data="filteredStudentList"
        stripe
        @selection-change="handleStudentSelectionChange"
        v-loading="loadingStudents"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="inClass" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.inClass ? 'success' : 'info'">
              {{ scope.row.inClass ? "已在班级" : "未加入" }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-footer">
        <el-button @click="studentDialogVisible = false">取消</el-button>
        <el-button
          type="danger"
          @click="removeSelectedStudents"
          :disabled="!hasSelectedInClassStudents"
        >
          移出班级
        </el-button>
        <el-button
          type="primary"
          @click="addSelectedStudents"
          :disabled="!hasSelectedNotInClassStudents"
        >
          加入班级
        </el-button>
      </div>
    </div>
  </el-dialog>

  <!-- 管理教师对话框 -->
  <el-dialog
    v-model="teacherDialogVisible"
    :title="`管理 ${currentClass?.title || ''} 班级教师`"
    width="60%"
  >
    <div class="manage-dialog-content">
      <div class="search-section">
        <el-input
          v-model="teacherSearch"
          placeholder="搜索教师"
          clearable
          style="margin-bottom: 15px"
        />
      </div>
      <el-table
        :data="filteredTeacherList"
        stripe
        @selection-change="handleTeacherSelectionChange"
        v-loading="loadingTeachers"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="inClass" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.inClass ? 'success' : 'info'">
              {{ scope.row.inClass ? "已在班级" : "未加入" }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-footer">
        <el-button @click="teacherDialogVisible = false">取消</el-button>
        <el-button
          type="danger"
          @click="removeSelectedTeachers"
          :disabled="!hasSelectedInClassTeachers"
        >
          移出班级
        </el-button>
        <el-button
          type="primary"
          @click="addSelectedTeachers"
          :disabled="!hasSelectedNotInClassTeachers"
        >
          加入班级
        </el-button>
      </div>
    </div>
  </el-dialog>

  <!-- 预览弹窗 -->
  <el-dialog
    v-model="previewDialogVisible"
    title="内容预览"
    width="60%"
    :close-on-click-modal="false"
  >
    <div class="preview-content">
      <div
        class="markdown-body"
        v-html="renderMarkdown(String(newActivityForm.content || ''))"
      ></div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="previewDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 编辑预览弹窗 -->
  <el-dialog
    v-model="editPreviewDialogVisible"
    title="内容预览"
    width="60%"
    :close-on-click-modal="false"
    append-to-body
  >
    <div class="preview-content">
      <div
        class="markdown-body"
        v-html="renderMarkdown(String(editForm.content || ''))"
      ></div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editPreviewDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ElMessageBox } from "element-plus";
import { Search, SwitchButton } from "@element-plus/icons-vue";
import * as echarts from "echarts";

export default {
  name: "AdminView",
  components: {
    Search,
    SwitchButton,
  },
  emits: [
    "update:modelValue", // 用于 v-model
    "change", // 用于选择器和表单变化
    "selection-change", // 用于表格选择
    "close", // 用于对话框关闭
  ],
  data() {
    // 密码验证规则
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能小于6位"));
      } else {
        if (this.resetPasswordForm.confirmPassword !== "") {
          this.$refs.resetPasswordForm.validateField("confirmPassword");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.resetPasswordForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      navOptions: ["数据报表", "活动管理", "班级管理", "用户管理"],
      navChoosed: "数据报表",
      activityList: [],
      editDialogVisible: false,
      editForm: {
        id: null,
        title: "",
        content: "",
        start: "",
        end: "",
      },
      dateShortcuts: [
        {
          text: "今天",
          value: new Date(),
        },
        {
          text: "明天",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            return date;
          },
        },
        {
          text: "一周后",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            return date;
          },
        },
      ],
      newActivityForm: {
        name: "",
        content: "",
        start: "",
        end: "",
      },
      classList: [],
      currentClass: null,
      studentDialogVisible: false,
      teacherDialogVisible: false,
      studentSearch: "",
      teacherSearch: "",
      studentList: [],
      teacherList: [],
      selectedStudents: [],
      selectedTeachers: [],
      loadingStudents: false,
      loadingTeachers: false,
      createClassDialogVisible: false,
      createClassForm: {
        name: "",
        introduction: "",
      },
      createClassRules: {
        name: [
          { required: true, message: "请输入班级称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        introduction: [
          { required: true, message: "请输入班级描述", trigger: "blur" },
          { max: 200, message: "描述不能超过 200 个字符", trigger: "blur" },
        ],
      },
      teacherOptions: [],
      creatingClass: false,
      classStudents: [], // 当前班级的学生
      classTeachers: [], // 当前班级的教师
      allStudents: [], // 所有可选的学生
      allTeachers: [], // 所有可选的教师
      loadingClassMembers: false,
      userSearch: "",
      userList: [],
      loadingUsers: false,
      resetPasswordDialogVisible: false,
      resettingPassword: false,
      currentUser: null,
      resetPasswordForm: {
        password: "",
        confirmPassword: "",
      },
      resetPasswordRules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        confirmPassword: [{ validator: validatePass2, trigger: "blur" }],
      },
      previewDialogVisible: false, // 预览弹窗的显示状态
      editPreviewDialogVisible: false, // 编辑预览弹窗的显示状态
      userStats: {
        total: 1250,
        teachers: 50,
        students: 1200,
      },
      taskStats: {
        total: 380,
        completed: 280,
        inProgress: 100,
      },
      activityStats: {
        total: 45,
        participants: 3600,
      },
      taskPieChart: null,
      activityBarChart: null,
      taskLineChart: null,
      charts: [], // 用于统一管理所有图表实例
    };
  },
  computed: {
    filteredStudentList() {
      if (!this.studentSearch) {
        return this.allStudents.map((student) => ({
          ...student,
          inClass: this.classStudents.some((s) => s.id === student.id),
        }));
      }

      const search = this.studentSearch.toLowerCase();
      return this.allStudents
        .filter(
          (student) =>
            student.username.toLowerCase().includes(search) ||
            student.name.toLowerCase().includes(search) ||
            student.email.toLowerCase().includes(search)
        )
        .map((student) => ({
          ...student,
          inClass: this.classStudents.some((s) => s.id === student.id),
        }));
    },

    filteredTeacherList() {
      if (!this.teacherSearch) {
        return this.allTeachers.map((teacher) => ({
          ...teacher,
          inClass: this.classTeachers.some((t) => t.id === teacher.id),
        }));
      }

      const search = this.teacherSearch.toLowerCase();
      return this.allTeachers
        .filter(
          (teacher) =>
            teacher.username.toLowerCase().includes(search) ||
            teacher.name.toLowerCase().includes(search) ||
            teacher.email.toLowerCase().includes(search)
        )
        .map((teacher) => ({
          ...teacher,
          inClass: this.classTeachers.some((t) => t.id === teacher.id),
        }));
    },
    hasSelectedInClassStudents() {
      return this.selectedStudents.some((student) => student.inClass);
    },
    hasSelectedNotInClassStudents() {
      return this.selectedStudents.some((student) => !student.inClass);
    },
    hasSelectedInClassTeachers() {
      return this.selectedTeachers.some((teacher) => teacher.inClass);
    },
    hasSelectedNotInClassTeachers() {
      return this.selectedTeachers.some((teacher) => !teacher.inClass);
    },
    filteredUserList() {
      if (!this.userSearch) return this.userList;

      const search = this.userSearch.toLowerCase();
      return this.userList.filter(
        (user) =>
          user.username.toLowerCase().includes(search) ||
          user.name.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.phone?.toLowerCase().includes(search) ||
          user.id.toString().includes(search)
      );
    },
  },
  watch: {
    navChoosed: {
      immediate: true,
      handler(newVal) {
        if (newVal === "用户管理") {
          this.loadUserList();
        }
      },
    },
  },
  mounted() {
    if (!this.$var.auth.isValid()) {
      ElMessageBox.alert("登录失效！", { type: "warning" });
      this.$router.push({ path: "/" });
    } else {
      // 初始化数据
      this.fetchActivityList();
      this.updateClassList();
      this.loadUserList();
    }
    this.$nextTick(() => {
      this.initCharts();
    });
  },
  methods: {
    handleNavChange(newVal) {
      if (newVal === "数据报表") {
        this.$nextTick(() => {
          this.initCharts();
        });
      }
    },

    initCharts() {
      this.initTaskPieChart();
      this.initActivityBarChart();
      this.initTaskLineChart();
    },

    initTaskLineChart() {
      this.taskLineChart = echarts.init(this.$refs.taskLineChart);
      const option = {
        title: {
          text: "近期任务完成情况",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
          formatter: function (params) {
            const data = params[0];
            return `<div style="font-size:14px;">
                      <p style="margin:0">${data.axisValue}</p>
                      <p style="margin:0">
                        完成任务：<span style="color:#409EFF;font-weight:bold">
                          ${data.value}</span> 个
                      </p>
                    </div>`;
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.getLast7Days(),
          axisLabel: {
            formatter: (value) => {
              return value.substring(5); // 只显示月-日
            },
          },
        },
        yAxis: {
          type: "value",
          name: "任务完成率",
          nameTextStyle: {
            padding: [0, 0, 0, 40],
          },
        },
        series: [
          {
            name: "任务完成率",
            type: "line",
            smooth: true,
            data: [10, 15, 8, 12, 18, 14, 16],
            itemStyle: {
              color: "#409EFF",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(64,158,255,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(64,158,255,0.1)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
          },
        ],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "60px",
          containLabel: true,
        },
      };
      this.taskLineChart.setOption(option);
    },

    getLast7Days() {
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }
      return dates;
    },

    initTaskPieChart() {
      this.taskPieChart = echarts.init(this.$refs.taskPieChart);
      const option = {
        title: {
          text: "任务完成情况",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "任务状态",
            type: "pie",
            radius: ["40%", "70%"],
            data: [
              { value: 280, name: "已完成" },
              { value: 60, name: "进行中" },
              { value: 25, name: "已逾期" },
              { value: 15, name: "未开始" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.taskPieChart.setOption(option);
    },

    initActivityBarChart() {
      this.activityBarChart = echarts.init(this.$refs.activityBarChart);
      const option = {
        title: {
          text: "活动参与情况",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow", // 鼠标移动到柱子上时显示阴影
          },
          formatter: function (params) {
            return `<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">
                    <div style="margin-bottom:10px;">
                      <span style="display:inline-block;margin-right:4px;
                        border-radius:10px;width:10px;height:10px;
                        background-color:${params.color};"></span>
                      <span style="font-weight:bold">${params.name}</span>
                    </div>
                    <div style="margin-left:14px">
                      参与人数：<span style="font-weight:bold;color:#409EFF">
                        ${params.value}</span> 人
                    </div>
                  </div>`;
          },
        },
        xAxis: {
          type: "category",
          data: [
            "活动一",
            "活动二",
            "活动三",
            "活动四",
            "活动五",
            "活动六",
            "活动二一",
            "活动二二",
            "活动二三",
            "活动二四",
            "活动二五",
            "活动二六",
          ],
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              fontSize: 12,
            },
            margin: 15,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "参与人数",
            type: "bar",
            data: [
              820, 932, 901, 934, 820, 932, 901, 1290, 820, 932, 901, 1330,
            ],
            itemStyle: {
              color: "#409EFF",
              borderRadius: [4, 4, 0, 0],
            },
            emphasis: {
              itemStyle: {
                color: "#66b1ff", // 鼠标悬浮时的颜色
              },
            },
          },
        ],
        grid: {
          bottom: 80, // 增加底部空间，防止标签显示不完整
        },
      };
      this.activityBarChart.setOption(option);
    },
    updateList() {
      this.$apis
        .getActivityList()
        .then((response) => {
          this.activityList = response.data.activities;

          for (let i = 0; i < this.activityList.length; i++) {
            // There is no enough real-world time to do the lazy-load
            console.log(this.activityList[i]);
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

    editActivity(activity) {
      this.editForm = {
        id: activity.id,
        title: activity.name || activity.content?.title || "",
        content: activity.content.content || "",
        start: activity.start || activity.content?.start || "",
        end: activity.end || activity.content?.end || "",
      };
      this.editDialogVisible = true;
    },

    deleteActivity(activity) {
      ElMessageBox.confirm("确定要删除这个活动吗？此操作不可逆", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$apis
            .deleteActivity(activity.id)
            .then(() => {
              this.$message.success("删除成功");
              this.updateList(); // 刷新列表
            })
            .catch(this.$utils.handleHttpException);
        })
        .catch(() => {
          this.$message.info("取删除");
        });
    },

    getTimeProgress(startTime, endTime) {
      const now = Math.floor(Date.now());
      if (now < startTime) return 0;
      if (now > endTime) return 100;
      return Math.floor(((now - startTime) / (endTime - startTime)) * 100);
    },

    getTimeStatus(startTime, endTime) {
      const now = Math.floor(Date.now());
      if (now < startTime) return "warning"; // 未开始
      if (now > endTime) return "success"; // 已结束
      return ""; // 进行中
    },

    getTimeLabel(startTime, endTime) {
      const now = Math.floor(Date.now());
      console.log(now, startTime, endTime);
      if (now < startTime) {
        const days = Math.floor((startTime - now) / (24 * 60 * 60 * 1000));
        return days > 0 ? `${days}天后开始` : "即将开始";
      }
      if (now > endTime) return "已结束";
      const days = Math.floor((endTime - now) / (24 * 60 * 60 * 1000));
      return days > 0 ? `还剩${days}天` : "进行中";
    },

    disablePastDates(time) {
      return time.getTime() < Date.now() - 8.64e7; // 禁用今天之前的日期
    },

    disableEndTimeBeforeStart(date) {
      if (this.editForm.start) {
        const startTime = new Date(this.editForm.start).getTime();
        const currentTime = date.getTime();
        return currentTime <= startTime;
      }
      return false;
    },

    handleEditSubmit() {
      // 验证表单
      if (!this.editForm.title.trim()) {
        this.$message.error("请输入活动标题");
        return;
      }
      if (!this.editForm.start) {
        this.$message.error("请选择开始时间");
        return;
      }
      if (!this.editForm.end) {
        this.$message.error("请选择结束时间");
        return;
      }
      if (!this.editForm.content?.trim()) {
        this.$message.error("请输入活动内容");
        return;
      }

      // 验证开始时间小于结束时间
      if (new Date(this.editForm.start) >= new Date(this.editForm.end)) {
        this.$message.error("开始时间必须早于结束时间");
        return;
      }

      this.$apis
        .updateActivityContent(this.editForm.id, {
          title: this.editForm.title,
          content: this.editForm.content,
          start: this.editForm.start,
          end: this.editForm.end,
        })
        .then(() => {
          this.$message.success("修改成功");
          this.editDialogVisible = false;
          this.updateList(); // 刷新列表
        })
        .catch(this.$utils.handleHttpException);
    },

    handleCreateSubmit() {
      // 表单验证
      if (!this.newActivityForm.name.trim()) {
        this.$message.error("请输入活动名称");
        return;
      }
      if (!this.newActivityForm.start) {
        this.$message.error("请选择开始时间");
        return;
      }
      if (!this.newActivityForm.end) {
        this.$message.error("请选择结束时间");
        return;
      }
      if (!this.newActivityForm.content?.trim()) {
        this.$message.error("请输入活动内容");
        return;
      }

      // 验证开始时间小于结束时间
      if (
        new Date(this.newActivityForm.start) >=
        new Date(this.newActivityForm.end)
      ) {
        this.$message.error("开始时间必须早于结束时间");
        return;
      }

      // 调用创建活动的 API
      this.$apis
        .createActivity({
          name: this.newActivityForm.name,
          content: this.newActivityForm.content,
          start: this.newActivityForm.start,
          end: this.newActivityForm.end,
        })
        .then(() => {
          this.$message.success("活动创建成功");
          this.resetNewActivityForm();
          this.updateList();
        })
        .catch(this.$utils.handleHttpException);
    },

    resetNewActivityForm() {
      this.newActivityForm = {
        name: "",
        content: "",
        start: "",
        end: "",
      };
    },

    updateClassList() {
      this.$apis
        .getClassList()
        .then((response) => {
          if (response.data.code === 0) {
            this.classList = response.data.class;
          } else {
            this.$message.error("获取班级列表失败");
          }
        })
        .catch(this.$utils.handleHttpException);
    },

    async manageStudents(classItem) {
      this.currentClass = classItem;
      this.studentDialogVisible = true;
      await Promise.all([this.loadClassStudents(), this.loadAllStudents()]);
    },

    async manageTeachers(classItem) {
      this.currentClass = classItem;
      this.teacherDialogVisible = true;
      await Promise.all([this.loadClassTeachers(), this.loadAllTeachers()]);
    },

    // 加载班级学生
    async loadClassStudents() {
      this.loadingClassMembers = true;
      try {
        const response = await this.$apis.getClassStudents(
          this.currentClass.id
        );
        if (response.data.code === 0) {
          this.classStudents = response.data.students || [];
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.loadingClassMembers = false;
      }
    },

    // 加载班级教师
    async loadClassTeachers() {
      this.loadingClassMembers = true;
      try {
        const response = await this.$apis.getClassTeachers(
          this.currentClass.id
        );
        if (response.data.code === 0) {
          this.classTeachers = response.data.teachers || [];
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.loadingClassMembers = false;
      }
    },

    // 加载所有可选学生
    async loadAllStudents() {
      this.loadingStudents = true;
      try {
        const response = await this.$apis.getAvailableStudents();
        if (response.data.code === 0) {
          this.allStudents = response.data.students || [];
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.loadingStudents = false;
      }
    },

    // 加载所有可选教师
    async loadAllTeachers() {
      this.loadingTeachers = true;
      try {
        const response = await this.$apis.getAvailableTeachers();
        if (response.data.code === 0) {
          this.allTeachers = response.data.teachers || [];
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.loadingTeachers = false;
      }
    },

    handleStudentSelectionChange(selection) {
      this.selectedStudents = selection;
    },

    handleTeacherSelectionChange(selection) {
      this.selectedTeachers = selection;
    },

    async addSelectedStudents() {
      const studentIds = this.selectedStudents
        .filter((student) => !student.inClass)
        .map((student) => student.id);

      if (studentIds.length === 0) return;

      try {
        await this.$apis.addStudentsToClass(this.currentClass.id, studentIds);
        this.$message.success("添加成功");
        // 重新加载班级学生列表和班级信息
        await Promise.all([this.loadClassStudents(), this.updateClassList()]);
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },

    async removeSelectedStudents() {
      const studentIds = this.selectedStudents
        .filter((student) => student.inClass)
        .map((student) => student.id);

      if (studentIds.length === 0) return;

      try {
        await this.$apis.removeStudentsFromClass(
          this.currentClass.id,
          studentIds
        );
        this.$message.success("移除成功");
        // 重新加载班级学生列表和班级信息
        await Promise.all([this.loadClassStudents(), this.updateClassList()]);
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },

    async addSelectedTeachers() {
      const teacherIds = this.selectedTeachers
        .filter((teacher) => !teacher.inClass)
        .map((teacher) => teacher.id);

      if (teacherIds.length === 0) return;

      try {
        await this.$apis.addTeachersToClass(this.currentClass.id, teacherIds);
        this.$message.success("添加成功");
        // 重新加载班级教师列表和班级信息
        await Promise.all([this.loadClassTeachers(), this.updateClassList()]);
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },

    async removeSelectedTeachers() {
      const teacherIds = this.selectedTeachers
        .filter((teacher) => teacher.inClass)
        .map((teacher) => teacher.id);

      if (teacherIds.length === 0) return;

      try {
        await this.$apis.removeTeachersFromClass(
          this.currentClass.id,
          teacherIds
        );
        this.$message.success("移除成功");
        // 重新加载班级教师列表和班级信息
        await Promise.all([this.loadClassTeachers(), this.updateClassList()]);
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },

    // 处理对话框关闭
    handleStudentDialogClose() {
      this.studentSearch = "";
      this.selectedStudents = [];
      this.classStudents = [];
      this.allStudents = [];
    },

    handleTeacherDialogClose() {
      this.teacherSearch = "";
      this.selectedTeachers = [];
      this.classTeachers = [];
      this.allTeachers = [];
    },

    showCreateClassDialog() {
      this.createClassDialogVisible = true;
      this.loadTeacherOptions();
    },

    async loadTeacherOptions() {
      try {
        const response = await this.$apis.getTeacherList();
        if (response.data.code === 0) {
          this.teacherOptions = response.data.teachers;
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },

    handleCreateClassDialogClose() {
      this.$refs.createClassForm?.resetFields();
      this.createClassForm.teachers = [];
    },

    async handleCreateClass() {
      try {
        await this.$refs.createClassForm.validate();
      } catch (error) {
        return;
      }

      this.creatingClass = true;
      try {
        const response = await this.$apis.createClass({
          name: this.createClassForm.name,
          introduction: this.createClassForm.introduction,
        });

        if (response.data.code === 0) {
          this.$message.success("班级创建成功");
          this.resetCreateForm();
          this.updateClassList();
        } else {
          this.$message.error(response.data.message || "创建失败");
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.creatingClass = false;
      }
    },

    resetCreateForm() {
      this.$refs.createClassForm?.resetFields();
    },

    async loadUserList() {
      this.loadingUsers = true;
      try {
        // 并行获取学生和教师列表
        const [studentsRes, teachersRes] = await Promise.all([
          this.$apis.getAvailableStudents(),
          this.$apis.getAvailableTeachers(),
        ]);

        const users = [];

        // 处理学生列表
        if (studentsRes.data.code === 0 && studentsRes.data.students) {
          users.push(
            ...studentsRes.data.students.map((student) => ({
              ...student,
              role: "student",
            }))
          );
        }

        // 处理教师列表
        if (teachersRes.data.code === 0 && teachersRes.data.teachers) {
          users.push(
            ...teachersRes.data.teachers.map((teacher) => ({
              ...teacher,
              role: "teacher",
            }))
          );
        }

        this.userList = users;
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.loadingUsers = false;
      }
    },

    async handleImpower(user) {
      try {
        await this.$confirm(
          `确定要将用户 "${user.name}" (${user.username}) 提升为教师吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        const response = await this.$apis.impowerTeacher(user.id);

        if (response.data.code === 0) {
          this.$message.success("提升成功");
          // 更新用户列表
          await this.loadUserList();
        } else {
          this.$message.error(response.data.message || "提升失败");
        }
      } catch (error) {
        if (error !== "cancel") {
          this.$utils.handleHttpException(error);
        }
      }
    },

    handleResetPassword(user) {
      this.currentUser = user;
      this.resetPasswordDialogVisible = true;
    },

    handleResetPasswordDialogClose() {
      this.resetPasswordForm.password = "";
      this.resetPasswordForm.confirmPassword = "";
      this.currentUser = null;
      this.$refs.resetPasswordForm?.resetFields();
    },

    async submitResetPassword() {
      try {
        await this.$refs.resetPasswordForm.validate();
      } catch (error) {
        return;
      }

      this.resettingPassword = true;
      try {
        const response = await this.$apis.resetUserPassword(
          this.currentUser.id,
          this.resetPasswordForm.password
        );

        if (response.data.code === 0) {
          this.$message.success("码重置成功");
          this.resetPasswordDialogVisible = false;
        } else {
          this.$message.error(response.data.message || "密码重置失败");
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.resettingPassword = false;
      }
    },

    async handleLogout() {
      try {
        await this.$confirm("确定要退出登录吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        // 清除登录状态
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");

        // 跳转到登录页
        this.$router.push("/");

        this.$message.success("已退出登录");
      } catch (error) {
        if (error !== "cancel") {
          this.$utils.handleHttpException(error);
        }
      }
    },

    formatDateTime(time) {
      if (!time) return "未设置";
      return new Date(time).toLocaleString();
    },

    // 切换内容显示状态
    toggleContent(index) {
      if (!this.activityList[index].contentVisible) {
        this.activityList[index].contentVisible = true;
      } else {
        this.activityList[index].contentVisible = false;
      }
    },

    // 修改获取活动列表的方法，为每个活动添加 contentVisible 属性
    async fetchActivityList() {
      try {
        const response = await this.$apis.getActivityList();
        if (response.data.code === 0) {
          this.activityList = response.data.activities.map((activity) => ({
            ...activity,
            contentVisible: false,
          }));

          // 获取每个活动的详细内容
          for (let activity of this.activityList) {
            const contentResponse = await this.$apis.getActivityContent(
              activity.id
            );
            activity.content = contentResponse.data.content;
          }
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },

    // 预览内容
    previewContent() {
      if (!this.newActivityForm.content) {
        this.$message.warning("请先输入活动内容");
        return;
      }
      this.previewDialogVisible = true;
    },

    // 预览辑内容
    previewEditContent() {
      if (!this.editForm.content) {
        this.$message.warning("请先输入活动内容");
        return;
      }
      this.editPreviewDialogVisible = true;
    },

    // 添加安全的markdown渲染方法
    renderMarkdown(content) {
      try {
        return this.$md.render(String(content || ""));
      } catch (error) {
        console.error("Markdown rendering error:", error);
        return "";
      }
    },
  },
  beforeUnmount() {
    if (this.taskPieChart) {
      this.taskPieChart.dispose();
    }
    if (this.activityBarChart) {
      this.activityBarChart.dispose();
    }
    if (this.taskLineChart) {
      this.taskLineChart.dispose();
    }
  },
};
</script>

<style scoped>
.activity-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  justify-content: center;
}

.activity-card {
  width: 60%;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.activity-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.activity-title {
  margin: 0;
  font-size: 20px;
  color: #333;
  text-align: center;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.button-group .el-button {
  padding: 12px 30px;
  font-size: 16px;
}

.activity-info {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.info-item {
  margin-bottom: 15px;
}

.info-label {
  font-weight: bold;
  color: #606266;
  width: 85px;
  flex-shrink: 0;
}

.info-content {
  color: #333;
  flex: 1;
  word-break: break-all;
}

.time-progress {
  flex: 1;
  padding-right: 20px;
}

.time-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.progress-label {
  font-size: 12px;
  color: #606266;
}

:deep(.el-progress-bar__inner) {
  transition: width 0.6s ease;
}

:deep(.el-progress--line) {
  margin-bottom: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-date-picker) {
  width: 100%;
}

.new-activity-form {
  width: 60%;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-date-picker) {
  width: 100%;
}

:deep(.el-form-item__content) {
  justify-content: flex-start;
}

.class-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  align-items: center;
}

.class-card {
  width: 80%;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.class-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.class-title {
  margin: 0;
  font-size: 20px;
  color: #333;
  text-align: center;
}

.class-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section {
  margin-bottom: 20px;
}

.info-section h4 {
  margin-bottom: 10px;
  color: #606266;
}

.manage-dialog-content {
  padding: 20px;
}

.dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.search-section {
  margin-bottom: 20px;
}

:deep(.el-dialog__body) {
  padding: 0;
}

.class-header {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
}

.create-class-section {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.create-class-form {
  max-width: 600px;
  margin: 0 auto;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
}

.info-label {
  font-weight: bold;
  color: #606266;
  width: 85px;
  flex-shrink: 0;
}

.info-content {
  color: #333;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 10px;
}

.teacher-management {
  padding: 20px;
}

.search-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.user-info {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.user-info p {
  margin: 5px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.admin-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* 三列布局：左侧、导航、右侧占位 */
  align-items: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.nav-section {
  /* 导航居中 */
  display: flex;
  justify-content: center;
}

.action-section {
  /* 退出按钮靠左 */
  display: flex;
  justify-content: flex-start;
  padding-left: 20px;
}

.action-section-placeholder {
  /* 右侧占位，保持对称 */
  width: 100px; /* 与退出按钮宽度大致相同 */
}

.action-section .el-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

:deep(.el-segmented-control) {
  /* 可选：调整导航组件样式 */
  font-size: 16px;
}

:deep(.el-icon) {
  vertical-align: middle;
}

.button-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.preview-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 20px;
  text-align: left;
}

/* 确保预览内容中的图片不会超出容器 */
:deep(.markdown-body img) {
  max-width: 100%;
  height: auto;
}

/* 调整预览弹窗中的代码块样式 */
:deep(.markdown-body pre) {
  max-width: 100%;
  overflow-x: auto;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.left-buttons {
  display: flex;
  gap: 8px;
}

.right-buttons {
  margin-left: auto;
}

/* 确保嵌套弹窗正确显示 */
:deep(.el-dialog__wrapper) {
  z-index: 2000 !important;
}

.data-overview {
  margin-bottom: 20px;
}

.data-card {
  height: 180px;
}

.data-content {
  text-align: center;
  padding: 20px;
}

.total-number {
  font-size: 36px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 15px;
}

.sub-numbers {
  display: flex;
  justify-content: space-around;
}

.sub-item {
  font-size: 14px;
  color: #606266;
}

.charts-container {
  margin-top: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart {
  height: 400px;
  width: 100%;
}
</style>
