<template>
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
      <div class="task-tags" v-if="task.tags && task.tags.length > 0">
        <el-tag
          v-for="tagId in task.tags"
          :key="tagId"
          size="small"
          :style="{
            backgroundColor: getTagColor(tagId) + '20',
            border: 'none',
            marginRight: '4px',
            marginBottom: '4px',
          }"
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
      <p class="task-content-text">{{ task.content }}</p>
      <el-progress
        :percentage="calculateProgress(task.start, task.end)"
        :status="
          calculateProgress(task.start, task.end) >= 100 ? 'success' : ''
        "
      />
      <div class="task-time">
        <div>开始: {{ new Date(task.start).toLocaleString() }}</div>
      </div>
      <div class="task-time">
        <div>结束: {{ new Date(task.end).toLocaleString() }}</div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "TaskCard",
  props: {
    task: {
      type: Object,
      required: true,
    },
    tagList: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    calculateProgress(startTime, endTime) {
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();

      if (now < start) return 0;
      if (now > end) return 100;

      return Math.round(((now - start) / (end - start)) * 100);
    },

    getTagColor(tagId) {
      const tag = this.tagList.find((t) => t.id === tagId);
      return tag ? tag.color : "#409EFF";
    },

    getTagName(tagId) {
      const tag = this.tagList.find((t) => t.id === tagId);
      return tag ? tag.title : "";
    },
  },
};
</script>

<style scoped>
.task-card {
  margin-bottom: 12px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-content {
  font-size: 14px;
  color: #606266;
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

.task-time {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 12px;
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
  gap: 4px;
}

.tag-item-content {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.tag-color-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

:deep(.el-tag) {
  margin: 0;
  padding: 0 6px;
  height: 20px;
  line-height: 20px;
}

:deep(.el-progress) {
  margin: 8px 0;
}
</style>
