<template>
  <div class="activity-view">
    <el-container>
      <el-menu :default-active="'1'">
        <el-menu-item index="0" @click="$router.push({ path: '/home' })">
          <DArrowLeft class="siderbar-icon" />
          返回主页
        </el-menu-item>
        <el-menu-item
          index="1"
          @click="$router.push({ path: '/activity/school' })"
        >
          <Grid class="siderbar-icon" />
          全校活动
        </el-menu-item>
        <el-menu-item
          index="2"
          @click="$router.push({ path: '/activity/picked' })"
        >
          <StarFilled class="siderbar-icon" />
          已选活动
        </el-menu-item>
      </el-menu>
      <el-main>
        <div class="subview">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scope>
.siderbar-icon {
  width: 1em;
  height: 1em;
  margin-right: 8px;
}

.activity-view {
  /* TODO: How to move the item vertically-center */
  margin: 0 20%;
  height: 80%;
}

.subview {
  width: 90%;
  margin: 0 auto;
  background-color: aliceblue;
  height: 100%;
}
</style>

<script setup>
import { Grid, StarFilled, DArrowLeft } from "@element-plus/icons-vue";
</script>

<script>
import { ElMessageBox } from "element-plus";

export default {
  name: "ActivityView",
  components: {},
  data() {
    return {
      links: ["/home"],
    };
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
