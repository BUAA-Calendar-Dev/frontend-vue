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
      // 使用 Element Plus 的对话框来编辑活动
      ElMessageBox.prompt("请输入新的活动内容", "修改活动", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputValue: activity.content.content,
      })
        .then(({ value }) => {
          this.$apis
            .updateActivityContent(activity.id, value)
            .then(() => {
              this.$message.success("修改成功");
              this.updateList(); // 刷新列表
            })
            .catch(this.$utils.handleHttpException);
        })
        .catch(() => {
          this.$message.info("取消修改");
        });
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
          this.$message.info("取消删除");
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
</style>
