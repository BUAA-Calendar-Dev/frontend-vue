<template>
  <div class="custom-style">
    <el-segmented v-model="navChoosed" :options="navOptions" />
  </div>
  <div class="main activity-main" v-if="navChoosed == '活动管理'">
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
            <h3 class="activity-title">{{ item.content.title }}</h3>
            <div class="button-group">
              <el-button type="primary" @click="editActivity(item)"
                >修改</el-button
              >
              <el-button type="danger" @click="deleteActivity(item)"
                >删除</el-button
              >
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
                    new Date(item.content.start).getTime(),
                    new Date(item.content.end).getTime()
                  )
                "
                :status="
                  getTimeStatus(
                    new Date(item.content.start).getTime(),
                    new Date(item.content.end).getTime()
                  )
                "
                :stroke-width="15"
              >
                <template #default>
                  <span class="progress-label">{{
                    getTimeLabel(
                      new Date(item.content.start).getTime(),
                      new Date(item.content.end).getTime()
                    )
                  }}</span>
                </template>
              </el-progress>
              <div class="time-details">
                <span>{{ item.content.start }}</span>
                <span>{{ item.content.end }}</span>
              </div>
            </div>
          </div>
          <div class="info-item">
            <span class="info-content">{{ item.content.content }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">参与人数：</span>
            <span class="info-content"
              >{{ item.participantCount || 0 }} 人</span
            >
          </div>
        </div>
      </el-card>
    </div>
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
          <el-button type="primary" @click="handleCreateSubmit"
            >发布活动</el-button
          >
          <el-button @click="resetNewActivityForm">重置</el-button>
        </el-form-item>
      </el-form>
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
            v-model="createClassForm.title"
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
            <h3 class="class-title">{{ classItem.title }}</h3>
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
              <span class="info-label">任课教师：</span>
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
  <div class="main teacher-main" v-if="navChoosed == '教师管理'">教师管理</div>
  <el-dialog v-model="editDialogVisible" title="修改活动" width="500px">
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
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确定</el-button>
      </span>
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
        title: "",
        introduction: "",
      },
      createClassRules: {
        title: [
          { required: true, message: "请输入班级名称", trigger: "blur" },
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
  },
  mounted() {
    if (!this.$var.auth.isValid()) {
      ElMessageBox.alert("登录失效！", { type: "warning" });
      this.$router.push({ path: "/" });
      return;
    }
    if (this.$var.auth.role !== "admin") {
      ElMessageBox.alert("非法访问！", { type: "warning" });
      this.$router.push({ path: "/" });
      return;
    }
    this.updateList();
    this.updateClassList();
  },
  methods: {
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
        title: activity.content.title,
        content: activity.content.content,
        start: activity.content.start,
        end: activity.content.end,
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
        this.$message.error("请输入活��标题");
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
      if (!this.editForm.content.trim()) {
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
      if (!this.newActivityForm.content.trim()) {
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
          title: this.createClassForm.title,
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
</style>
