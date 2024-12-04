<template>
  <el-card class="activity-card" shadow="hover">
    <div class="activity-header">
      <h3 class="activity-title">{{ activity.name }}</h3>
      <el-tag :type="activityStatus.type" size="small">
        {{ activityStatus.text }}
      </el-tag>
    </div>

    <div class="activity-content">
      <el-tooltip
        v-if="isContentOverflow"
        :content="activity.content"
        placement="top"
        :hide-after="1000"
      >
        <p>{{ activity.content }}</p>
      </el-tooltip>
      <p v-else>{{ activity.content }}</p>
    </div>

    <div class="activity-info">
      <div class="info-section">
        <div class="location-info" v-if="activity.place">
          <el-icon><Location /></el-icon>
          <span>{{ activity.place }}</span>
        </div>
        <div class="time-info">
          <div class="time-item">
            <el-icon><Timer /></el-icon>
            <span>开始：{{ formatTime(activity.start) }}</span>
          </div>
          <div class="time-item">
            <el-icon><Timer /></el-icon>
            <span>结束：{{ formatTime(activity.end) }}</span>
          </div>
        </div>
      </div>

      <div class="activity-actions">
        <el-button
          v-if="activityStatus.type !== 'info'"
          :type="activity.signed_in ? 'danger' : 'success'"
          size="small"
          @click="handleParticipation"
          :loading="loading"
        >
          {{ activity.signed_in ? "退出活动" : "参加活动" }}
        </el-button>
        <el-tag v-else type="info" size="small">活动已结束</el-tag>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Timer, Location } from "@element-plus/icons-vue";

export default {
  name: "ActivityCard",
  components: {
    Timer,
    Location,
  },
  props: {
    activity: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      isContentOverflow: false,
    };
  },
  computed: {
    activityStatus() {
      const now = new Date();
      const start = new Date(this.activity.start);
      const end = new Date(this.activity.end);

      if (now < start) {
        return {
          type: "warning",
          text: "未开始",
        };
      } else if (now > end) {
        return {
          type: "info",
          text: "已结束",
        };
      } else {
        return {
          type: "success",
          text: "进行中",
        };
      }
    },
  },
  methods: {
    formatTime(time) {
      return new Date(time).toLocaleString();
    },
    async handleParticipation() {
      this.loading = true;
      try {
        await this.$apis.updateActivityJoining(
          this.activity.id,
          this.activity.signed_in ? "exit" : "join"
        );
        this.$emit("update");
        this.$message({
          type: this.activity.signed_in ? "warning" : "success",
          message: this.activity.signed_in ? "已退出活动" : "已成功参加活动",
          duration: 2000,
        });
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    // 检查内容是否超出
    this.$nextTick(() => {
      const content = this.$el.querySelector(".activity-content p");
      if (content) {
        this.isContentOverflow = content.scrollHeight > content.clientHeight;
      }
    });
  },
};
</script>

<style scoped>
.activity-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.activity-title {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.activity-content {
  color: #606266;
  line-height: 1.6;
  margin: 12px 0 16px;
  min-height: 40px;
}

.activity-content p {
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 显示3行 */
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 当鼠标悬停在内容上时显示指针 */
.activity-content p:hover {
  cursor: pointer;
}

.activity-info {
  border-top: 1px solid #ebeef5;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.info-section {
  flex: 1;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.location-info .el-icon {
  color: #409eff;
  font-size: 16px;
}

.time-info {
  color: #909399;
  font-size: 14px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.time-item .el-icon {
  font-size: 14px;
}

.activity-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.activity-actions .el-button {
  min-width: 90px;
}

.activity-actions .el-button.el-button--success:hover {
  background-color: #67c23a;
  border-color: #67c23a;
}

.activity-actions .el-button.el-button--danger:hover {
  background-color: #f56c6c;
  border-color: #f56c6c;
}
</style>
