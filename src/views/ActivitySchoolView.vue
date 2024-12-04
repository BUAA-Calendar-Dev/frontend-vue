<template>
  <div class="activity-school">
    <div class="activity-header">
      <h2>全校活动</h2>
      <el-input
        v-model="searchText"
        placeholder="搜索活动"
        prefix-icon="Search"
        clearable
        class="search-input"
      />
    </div>

    <div class="activity-grid" v-loading="loading">
      <activity-card
        v-for="activity in filteredActivities"
        :key="activity.id"
        :activity="activity"
        @update="handleActivityUpdate"
      />
    </div>

    <div v-if="filteredActivities.length === 0" class="empty-state">
      <el-empty description="暂无活动" />
    </div>
  </div>
</template>

<script>
import ActivityCard from "@/components/ActivityCard.vue";

export default {
  name: "ActivitySchoolView",
  components: {
    ActivityCard,
  },
  data() {
    return {
      activities: [],
      searchText: "",
      loading: false,
    };
  },
  computed: {
    sortedActivities() {
      const now = new Date();
      return [...this.activities].sort((a, b) => {
        const aStart = new Date(a.start);
        const aEnd = new Date(a.end);
        const bStart = new Date(b.start);
        const bEnd = new Date(b.end);

        // 判断活动状态
        const aExpired = now > aEnd;
        const bExpired = now > bEnd;
        const aStarted = now >= aStart;
        const bStarted = now >= bStart;

        // 1. 已过期的活动放在最后
        if (aExpired && !bExpired) return 1;
        if (!aExpired && bExpired) return -1;

        // 2. 已开始但未过期的活动放在最前
        if (aStarted && !aExpired && (!bStarted || bExpired)) return -1;
        if (bStarted && !bExpired && (!aStarted || aExpired)) return 1;

        // 3. 同状态的活动按开始时间倒序排列（新的在前）
        return bStart - aStart;
      });
    },

    filteredActivities() {
      if (!this.searchText) return this.sortedActivities;
      const searchLower = this.searchText.toLowerCase();
      return this.sortedActivities.filter(
        (activity) =>
          activity.name.toLowerCase().includes(searchLower) ||
          activity.content.toLowerCase().includes(searchLower)
      );
    },
  },
  methods: {
    async updateActivities() {
      this.loading = true;
      try {
        const response = await this.$apis.getActivityList();
        this.activities = response.data.activities;
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.loading = false;
      }
    },

    async handleActivityUpdate() {
      await this.updateActivities();
      this.$message({
        type: "success",
        message: "活动列表已更新",
        duration: 1000,
      });
    },
  },
  mounted() {
    this.updateActivities();
  },
};
</script>

<style scoped>
.activity-school {
  padding: 20px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.activity-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.search-input {
  width: 300px;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.empty-state {
  margin-top: 40px;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .activity-grid {
    grid-template-columns: 1fr;
  }

  .search-input {
    width: 200px;
  }
}
</style>
