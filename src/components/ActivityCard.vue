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
    width="800px"
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
        <div
          class="detail-content markdown-body"
          style="font-size: small"
          v-html="$md.render(activity.content)"
        ></div>
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

      <!-- 评论区域 -->
      <div class="comment-section">
        <h4>活动评论</h4>

        <!-- 新增评论输入框 -->
        <div class="comment-input-section">
          <el-input
            v-model="newCommentContent"
            type="textarea"
            :rows="3"
            placeholder="写下你的评论..."
          />
          <el-button
            type="primary"
            @click="submitComment"
            :loading="commentSubmitting"
          >
            发表评论
          </el-button>
        </div>

        <div class="comments-container">
          <!-- 一级评论 -->
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-header">
              <div class="comment-info">
                <el-avatar
                  :size="32"
                  :src="comment.avatar"
                  class="comment-avatar"
                />
                <div class="comment-user-info">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-time">{{
                    formatTime(comment.time)
                  }}</span>
                </div>
              </div>
              <div class="comment-actions">
                <el-button
                  type="text"
                  size="small"
                  @click="showReplyInput(comment.id)"
                >
                  回复
                </el-button>
                <el-button
                  v-if="comment.authorId === currentUserId"
                  type="text"
                  size="small"
                  @click="deleteComment(comment.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
            <div class="comment-content">{{ comment.content }}</div>

            <!-- 回复输入框 -->
            <div v-if="replyingToId === comment.id" class="reply-input-section">
              <el-input
                v-model="replyContent"
                type="textarea"
                :rows="2"
                placeholder="写下你的回复..."
              />
              <div class="reply-actions">
                <el-button
                  type="primary"
                  size="small"
                  @click="submitReply(comment.id)"
                  :loading="replySubmitting"
                >
                  提交回复
                </el-button>
                <el-button size="small" @click="cancelReply"> 取消 </el-button>
              </div>
            </div>

            <!-- 二级评论 -->
            <div
              class="sub-comments"
              v-if="comment.subComments && comment.subComments.length > 0"
            >
              <div
                v-for="subComment in comment.subComments"
                :key="subComment.id"
                class="sub-comment-item"
              >
                <div class="comment-header">
                  <div class="comment-info">
                    <el-avatar
                      :size="28"
                      :src="subComment.avatar || '/favicon.ico'"
                      class="comment-avatar"
                    />
                    <div class="comment-user-info">
                      <span class="comment-author">{{
                        subComment.author
                      }}</span>
                      <span class="comment-time">{{
                        formatTime(subComment.time)
                      }}</span>
                    </div>
                  </div>
                  <div class="comment-actions">
                    <el-button
                      v-if="subComment.authorId === currentUserId"
                      type="text"
                      size="small"
                      @click="deleteSubComment(subComment.id)"
                    >
                      删除
                    </el-button>
                  </div>
                </div>
                <div class="comment-content">{{ subComment.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>

  <!-- 删除确认对话框 -->
  <el-dialog
    v-model="deleteDialogVisible"
    title="确认删除"
    width="300px"
    :close-on-click-modal="false"
  >
    <span>确定要删除这条评论吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确定</el-button>
      </span>
    </template>
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
      comments: [], // 存储评论数据
      currentUserId: this.$var.auth.id,
      deleteDialogVisible: false,
      deletingCommentId: null,
      deletingCommentType: null, // 'main' 或 'sub'
      deleteLoading: false,
      newCommentContent: "", // 新评论内容
      replyContent: "", // 回复内容
      replyingToId: null, // 正在回复的评论ID
      commentSubmitting: false, // 评论提交状态
      replySubmitting: false, // 回复提交状态
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
    async fetchComments() {
      try {
        const response = await this.$apis.getComment(this.activity.id);
        // 获取每个一级评论的二级评论
        const commentsWithReplies = await Promise.all(
          response.data.comments.map(async (comment) => {
            try {
              const subResponse = await this.$apis.getSubComment(comment.id);
              return {
                ...comment,
                subComments: subResponse.data.comments || [],
              };
            } catch (error) {
              console.error("获取二级评论失败:", error);
              return {
                ...comment,
                subComments: [],
              };
            }
          })
        );
        this.comments = commentsWithReplies;
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },
    async showDetails(event) {
      // 如果点击的是按钮，不显示详情
      if (
        event.target.tagName === "BUTTON" ||
        event.target.closest(".el-button")
      ) {
        return;
      }
      this.dialogVisible = true;
      // 获取评论数据
      await this.fetchComments();
    },
    // 删除评论的方法
    deleteComment(commentId) {
      this.deletingCommentId = commentId;
      this.deletingCommentType = "main";
      this.deleteDialogVisible = true;
    },
    // 删除二级评论的方法
    deleteSubComment(subCommentId) {
      this.deletingCommentId = subCommentId;
      this.deletingCommentType = "sub";
      this.deleteDialogVisible = true;
    },
    // 确认删除
    async confirmDelete() {
      this.deleteLoading = true;
      try {
        if (this.deletingCommentType === "main") {
          await this.$apis.deleteComment(this.deletingCommentId);
          // 从评论列表中移除被删除的评论
          this.comments = this.comments.filter(
            (comment) => comment.id !== this.deletingCommentId
          );
        } else {
          await this.$apis.deleteSubComment(this.deletingCommentId);
          // 从二级评论列表中移除被删除的评论
          this.comments = this.comments.map((comment) => ({
            ...comment,
            subComments: comment.subComments.filter(
              (subComment) => subComment.id !== this.deletingCommentId
            ),
          }));
        }

        this.$message({
          type: "success",
          message: "删除成功",
          duration: 2000,
        });
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.deleteLoading = false;
        this.deleteDialogVisible = false;
        this.deletingCommentId = null;
        this.deletingCommentType = null;
      }
    },
    // 提交新评论
    async submitComment() {
      if (!this.newCommentContent.trim()) {
        this.$message.warning("请输入评论内容");
        return;
      }

      this.commentSubmitting = true;
      try {
        const response = await this.$apis.addComment(
          this.activity.id,
          this.newCommentContent
        );
        if (response.data.code === 0) {
          // 将新评论添加到列表
          this.comments.unshift({
            ...response.data.comment,
            subComments: [],
          });
          this.newCommentContent = ""; // 清空输入框
          this.$message.success("评论发表成功");
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.commentSubmitting = false;
      }
    },

    // 显示回复输入框
    showReplyInput(commentId) {
      this.replyingToId = commentId;
      this.replyContent = "";
    },

    // 取消回复
    cancelReply() {
      this.replyingToId = null;
      this.replyContent = "";
    },

    // 提交回复
    async submitReply(commentId) {
      if (!this.replyContent.trim()) {
        this.$message.warning("请输入回复内容");
        return;
      }

      this.replySubmitting = true;
      try {
        const response = await this.$apis.addSubComment(
          commentId,
          this.replyContent
        );
        if (response.data.code === 0) {
          // 找到对应的评论并添加回复
          const comment = this.comments.find((c) => c.id === commentId);
          if (comment) {
            if (!comment.subComments) {
              comment.subComments = [];
            }
            comment.subComments.push(response.data.comment);
          }
          this.replyContent = ""; // 清空输入框
          this.replyingToId = null; // 关闭回复框
          this.$message.success("回复发表成功");
        }
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.replySubmitting = false;
      }
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
  line-height: 1.5;
  text-align: left;
}

.detail-content :deep(p) {
  text-align: left;
  margin: 0.2em 0;
}

.detail-content :deep(h1, h2, h3, h4, h5, h6) {
  margin: 0.4em 0 0.2em;
  line-height: 1.4;
}

.detail-content :deep(ul, ol) {
  margin: 0.2em 0;
  padding-left: 1.5em;
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

/* 评论区样式 */
.comment-section {
  margin-top: 24px;
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
}

.comment-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.comments-container {
  max-height: 400px;
  overflow-y: auto;
}

.comment-item {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.comment-author {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
  line-height: 1.2;
}

.comment-time {
  color: #909399;
  font-size: 12px;
  line-height: 1;
}

.comment-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* 确保按钮不会影响布局 */
:deep(.el-button--text) {
  padding: 0 8px;
}

/* 调整二级评论的样式 */
.sub-comment-item .comment-header {
  margin-bottom: 6px;
}

/* 确保长用户名不会影响布局 */
.comment-author {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.comment-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.sub-comments {
  margin-top: 12px;
  padding-left: 24px;
}

.sub-comment-item {
  margin-top: 12px;
  padding: 12px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}

/* 自定义滚动条样式 */
.comments-container::-webkit-scrollbar {
  width: 6px;
}

.comments-container::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.comments-container::-webkit-scrollbar-track {
  background-color: #f8f9fa;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.comment-input-section {
  margin-bottom: 20px;
}

.comment-input-section .el-button {
  margin-top: 12px;
  margin-left: 12px; /* 添加左侧间距 */
  float: right;
}

/* 如果有多个按钮，可以使用这个类来控制按钮组的间距 */
.comment-input-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 12px; /* 按钮之间的间距 */
}

/* 清除浮动 */
.comment-input-section::after {
  content: "";
  display: table;
  clear: both;
}

.comment-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.comment-author {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
  line-height: 1.2;
}

.comment-time {
  color: #909399;
  font-size: 12px;
  line-height: 1;
}

/* 调整二级评论的样式 */
.sub-comment-item .comment-info {
  gap: 8px;
}

.sub-comment-item .comment-author {
  font-size: 13px;
}
</style>
