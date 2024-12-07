<template>
  <div class="preference-container">
    <el-card class="preference-card" shadow="hover" v-loading="loading">
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
              :show-alpha="false"
              format="hex"
              @change="savePreference('activityColor')"
            />
          </div>
        </div>

        <div class="preference-item">
          <span class="item-label">任务显示颜色</span>
          <div class="item-content">
            <el-color-picker
              v-model="preferences.taskColor"
              :show-alpha="false"
              format="hex"
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
          <span class="item-label">主题颜色</span>
          <div class="item-content">
            <el-color-picker
              v-model="preferences.theme"
              :show-alpha="false"
              format="hex"
              @change="savePreference('theme')"
            />
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
        activityColor: "#409EFF",
        taskColor: "#F56C6C",
        defaultView: "calendar",
        theme: "#ffffff",
      },
      loading: false,
    };
  },
  async mounted() {
    await this.loadPreferences();
  },
  methods: {
    async loadPreferences() {
      try {
        this.loading = true;
        const response = await this.$apis.getUserPreferences();
        // 合并默认值和后端返回的设置
        this.preferences = {
          ...this.preferences,
          ...response.data.preference,
        };
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.loading = false;
      }
    },

    async savePreference(key) {
      try {
        this.loading = true;
        // 发送整个preferences对象
        await this.$apis.updateUserPreference(this.preferences);

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
      } catch (error) {
        this.$utils.handleHttpException(error);
        // 如果保存失败，重新加载设置
        await this.loadPreferences();
      } finally {
        this.loading = false;
      }
    },

    async resetPreferences() {
      try {
        this.loading = true;
        // 重置所有设置为默认值
        const defaultPreferences = {
          activityReminder: "30",
          taskReminder: "360",
          activityColor: "#409EFF",
          taskColor: "#F56C6C",
          defaultView: "calendar",
          theme: "#ffffff",
        };

        // 发送整个默认preferences对象
        await this.$apis.updateUserPreference(defaultPreferences);

        // 更新本地数据
        this.preferences = { ...defaultPreferences };

        this.$message({
          message: "已重置所有设置",
          type: "success",
          duration: 2000,
        });
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
