<template>
  <el-card class="activity-card" shadow="hover" @click="showDetails">
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
        <p ref="contentRef">{{ activity.content }}</p>
      </el-tooltip>
      <p v-else ref="contentRef">{{ activity.content }}</p>
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

  <!-- 详情弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="activity.name"
    width="600px"
    :close-on-click-modal="false"
    class="activity-dialog"
  >
    <div class="dialog-content">
      <!-- 活动状态 -->
      <div class="dialog-header">
        <el-tag :type="activityStatus.type" size="large">
          {{ activityStatus.text }}
        </el-tag>
        <div class="dialog-actions">
          <el-button
            v-if="activityStatus.type !== 'info'"
            :type="activity.signed_in ? 'danger' : 'success'"
            size="large"
            @click="handleParticipation"
            :loading="loading"
          >
            {{ activity.signed_in ? "退出活动" : "参加活动" }}
          </el-button>
        </div>
      </div>

      <!-- 活动详情 -->
      <div class="detail-section">
        <h4>活动详情</h4>
        <div class="detail-content">{{ activity.content }}</div>
      </div>

      <!-- 活动信息 -->
      <div class="info-section">
        <h4>活动信息</h4>
        <div class="info-grid">
          <div class="info-item" v-if="activity.place">
            <div class="info-label">
              <el-icon><Location /></el-icon>
              活动地点
            </div>
            <div class="info-value">{{ activity.place }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">
              <el-icon><Timer /></el-icon>
              开始时间
            </div>
            <div class="info-value">{{ formatTime(activity.start) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">
              <el-icon><Timer /></el-icon>
              结束时间
            </div>
            <div class="info-value">{{ formatTime(activity.end) }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { Timer, Location } from "@element-plus/icons-vue";
import { ref, onMounted, nextTick } from "vue";

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
  setup() {
    const contentRef = ref(null);
    const isContentOverflow = ref(false);

    onMounted(async () => {
      await nextTick();
      if (contentRef.value) {
        isContentOverflow.value =
          contentRef.value.scrollHeight > contentRef.value.clientHeight;
      }
    });

    return {
      contentRef,
      isContentOverflow,
    };
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
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
    showDetails(event) {
      // 如果点击的是按钮，不显示详情
      if (
        event.target.tagName === "BUTTON" ||
        event.target.closest(".el-button")
      ) {
        return;
      }
      this.dialogVisible = true;
    },
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

.activity-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.dialog-content {
  padding: 20px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.detail-section,
.info-section {
  margin-bottom: 24px;
}

.detail-section h4,
.info-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.detail-content {
  color: #606266;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 14px;
  margin-bottom: 4px;
}

.info-value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

.info-label .el-icon {
  font-size: 16px;
}

/* 让卡片可点击 */
.activity-card {
  cursor: pointer;
}

.activity-card :deep(.el-card__body) {
  pointer-events: auto;
}

/* 按钮不触发卡片点击 */
.activity-actions {
  pointer-events: auto;
}
</style>
