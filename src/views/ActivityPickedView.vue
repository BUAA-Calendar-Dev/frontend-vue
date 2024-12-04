<template>
  <div class="activity-picked">
    <div class="activity-header">
      <h2>已选活动</h2>
    </div>

    <div class="activity-grid">
      <activity-card
        v-for="activity in sortedActivities"
        :key="activity.id"
        :activity="activity"
        @update="updateActivities"
      />
    </div>

    <div v-if="activities.length === 0" class="empty-state">
      <el-empty description="暂无已选活动" />
    </div>
  </div>
</template>

<script>
import ActivityCard from "@/components/ActivityCard.vue";

export default {
  name: "ActivityPickedView",
  components: {
    ActivityCard,
  },
  data() {
    return {
      activities: [],
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
  },
  methods: {
    async updateActivities() {
      this.loading = true;
      try {
        const response = await this.$apis.getActivityList();
        this.activities = response.data.activities.filter(
          (activity) => activity.signed_in
        );
      } catch (error) {
        this.$utils.handleHttpException(error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.updateActivities();
  },
};
</script>

<style scoped>
.activity-picked {
  padding: 20px;
}

.activity-header {
  margin-bottom: 24px;
}

.activity-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
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
}
</style>
