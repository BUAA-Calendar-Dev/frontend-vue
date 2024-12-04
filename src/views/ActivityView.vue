<template>
  <div class="activity-view">
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside width="240px">
        <el-menu
          :default-active="activeMenu"
          class="activity-menu"
          :router="true"
        >
          <div class="menu-header">
            <h2>活动中心</h2>
          </div>

          <el-menu-item
            index="/home"
            @click="$router.push({ path: '/home' })"
            class="menu-item"
          >
            <template #title>
              <el-icon><DArrowLeft /></el-icon>
              <span>返回主页</span>
            </template>
          </el-menu-item>

          <el-menu-item
            index="/activity/school"
            @click="$router.push({ path: '/activity/school' })"
            class="menu-item"
          >
            <template #title>
              <el-icon><Grid /></el-icon>
              <span>全校活动</span>
            </template>
          </el-menu-item>

          <el-menu-item
            index="/activity/picked"
            @click="$router.push({ path: '/activity/picked' })"
            class="menu-item"
          >
            <template #title>
              <el-icon><StarFilled /></el-icon>
              <span>已选活动</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="activity-main">
        <div class="content-wrapper">
          <router-view v-if="$route.name !== 'activity'"></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.activity-view {
  height: 100vh;
  background-color: #f5f7fa;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.activity-menu {
  height: 100%;
  border-right: none;
}

.menu-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.menu-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
  font-weight: 500;
}

.menu-item {
  height: 56px;
  line-height: 56px;
  padding: 0 20px !important;
  margin: 4px 0;
}

.menu-item:hover {
  background-color: #f5f7fa !important;
}

.el-menu-item.is-active {
  background-color: #ecf5ff !important;
  color: #409eff !important;
  border-right: 2px solid #409eff;
}

.el-icon {
  font-size: 18px;
  margin-right: 8px;
  vertical-align: middle;
}

.activity-main {
  padding: 20px;
  background-color: #f5f7fa;
}

.content-wrapper {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  min-height: calc(100vh - 40px);
  padding: 20px;
}

/* 动画效果 */
.el-menu-item {
  transition: all 0.3s ease;
}

.el-menu-item:active {
  transform: scale(0.98);
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .activity-view {
    margin: 0;
  }

  .el-aside {
    width: 200px !important;
  }

  .content-wrapper {
    padding: 15px;
  }
}
</style>

<script setup>
import { Grid, StarFilled, DArrowLeft } from "@element-plus/icons-vue";
</script>

<script>
import { ElMessageBox } from "element-plus";

export default {
  name: "ActivityView",
  computed: {
    activeMenu() {
      return this.$route.path;
    },
  },
  mounted() {
    if (!this.$var.auth.isValid()) {
      ElMessageBox.alert("登录失效！", { type: "warning" });
      this.$router.push({ path: "/" });
    } else {
      this.$router.push({ path: "/activity/school" });
    }
  },
};
</script>
