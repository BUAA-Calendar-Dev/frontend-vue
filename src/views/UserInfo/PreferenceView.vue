<template>
  <div class="preference-container">
    <el-card class="preference-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h3>个性化设置</h3>
        </div>
      </template>

      <!-- 提醒设置 -->
      <div class="section">
        <h4 class="section-title">提醒设置</h4>

        <div class="preference-item">
          <span class="item-label">活动开始提醒</span>
          <div class="item-content">
            <el-select
              v-model="preferences.activityReminder"
              placeholder="选择提醒时间"
              @change="savePreference('activityReminder')"
            >
              <el-option label="不提醒" value="0" />
              <el-option label="提前15分钟" value="15" />
              <el-option label="提前30分钟" value="30" />
              <el-option label="提前1小时" value="60" />
              <el-option label="提前2小时" value="120" />
              <el-option label="提前1天" value="1440" />
            </el-select>
          </div>
        </div>

        <div class="preference-item">
          <span class="item-label">任务截止提醒</span>
          <div class="item-content">
            <el-select
              v-model="preferences.taskReminder"
              placeholder="选择提醒时间"
              @change="savePreference('taskReminder')"
            >
              <el-option label="不提醒" value="0" />
              <el-option label="提前1小时" value="60" />
              <el-option label="提前3小时" value="180" />
              <el-option label="提前6小时" value="360" />
              <el-option label="提前12小时" value="720" />
              <el-option label="提前1天" value="1440" />
              <el-option label="提前2天" value="2880" />
            </el-select>
          </div>
        </div>
      </div>

      <!-- 显示设置 -->
      <div class="section">
        <h4 class="section-title">显示设置</h4>

        <div class="preference-item">
          <span class="item-label">活动显示颜色</span>
          <div class="item-content">
            <el-color-picker
              v-model="preferences.activityColor"
              show-alpha
              @change="savePreference('activityColor')"
            />
          </div>
        </div>

        <div class="preference-item">
          <span class="item-label">任务显示颜色</span>
          <div class="item-content">
            <el-color-picker
              v-model="preferences.taskColor"
              show-alpha
              @change="savePreference('taskColor')"
            />
          </div>
        </div>

        <div class="preference-item">
          <span class="item-label">默认视图</span>
          <div class="item-content">
            <el-radio-group
              v-model="preferences.defaultView"
              @change="savePreference('defaultView')"
            >
              <el-radio label="calendar">日历视图</el-radio>
              <el-radio label="list">列表视图</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>

      <!-- 其他设置 -->
      <div class="section">
        <h4 class="section-title">其他设置</h4>

        <div class="preference-item">
          <span class="item-label">主题模式</span>
          <div class="item-content">
            <el-radio-group
              v-model="preferences.theme"
              @change="savePreference('theme')"
            >
              <el-radio label="light">浅色</el-radio>
              <el-radio label="dark">深色</el-radio>
              <el-radio label="auto">跟随系统</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.preference-container {
  width: 100%;
  padding: 20px;
}

.preference-card {
  width: 100%;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  color: #303133;
  font-size: 16px;
}

.preference-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
}

.item-label {
  width: 120px;
  color: #606266;
  font-size: 14px;
}

.item-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.el-select {
  width: 200px;
}

.el-radio-group {
  display: flex;
  gap: 20px;
}

:deep(.el-color-picker__trigger) {
  width: 100px;
  height: 36px;
}
</style>

<script>
export default {
  name: "PreferenceView",
  data() {
    return {
      preferences: {
        activityReminder: "30",
        taskReminder: "360",
        activityColor: "rgba(64, 158, 255, 0.8)",
        taskColor: "rgba(245, 108, 108, 0.8)",
        defaultView: "calendar",
        theme: "light",
      },
    };
  },
  mounted() {
    this.loadPreferences();
  },
  methods: {
    loadPreferences() {
      // 从 localStorage 加载保存的偏好设置
      const savedPreferences = localStorage.getItem("userPreferences");
      if (savedPreferences) {
        this.preferences = {
          ...this.preferences,
          ...JSON.parse(savedPreferences),
        };
      }
    },
    savePreference(key) {
      // 保存单个偏好设置
      const savedPreferences = localStorage.getItem("userPreferences");
      const preferences = savedPreferences ? JSON.parse(savedPreferences) : {};
      preferences[key] = this.preferences[key];
      localStorage.setItem("userPreferences", JSON.stringify(preferences));

      // 显示保存成功提示
      this.$message({
        message: "设置已保存",
        type: "success",
        duration: 2000,
      });

      // 触发全局事件，通知其他组件更新
      this.$emit("preference-updated", {
        key,
        value: this.preferences[key],
      });
    },
    resetPreferences() {
      // 重置所有设置为默认值
      this.preferences = {
        activityReminder: "30",
        taskReminder: "360",
        activityColor: "rgba(64, 158, 255, 0.8)",
        taskColor: "rgba(245, 108, 108, 0.8)",
        defaultView: "calendar",
        theme: "light",
      };
      localStorage.setItem("userPreferences", JSON.stringify(this.preferences));

      this.$message({
        message: "已重置所有设置",
        type: "success",
        duration: 2000,
      });
    },
  },
};
</script>
