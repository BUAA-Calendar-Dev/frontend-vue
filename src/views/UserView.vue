<template>
  <div class="user-info">
    <el-container>
      <el-menu :default-active="'1'" class="user-menu">
        <el-menu-item index="0" @click="$router.push({ path: '/home' })">
          <DArrowLeft class="siderbar-icon" />
          返回主页
        </el-menu-item>
        <el-menu-item
          index="1"
          @click="$router.push({ path: '/user/profile' })"
        >
          <Postcard class="siderbar-icon" />
          基本信息
        </el-menu-item>
        <el-menu-item
          index="2"
          @click="$router.push({ path: '/user/preference' })"
        >
          <Setting class="siderbar-icon" />
          偏好设置
        </el-menu-item>
        <el-menu-item index="3" @click="jumpLogout" class="logout-item">
          <Close class="siderbar-icon" />
          退出登录
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

<style scoped>
.user-info {
  margin: 0 20%;
  height: 80vh;
  position: relative;
}

.user-menu {
  border-right: 1px solid #e6e6e6;
  height: 100%;
  position: relative;
}

.siderbar-icon {
  width: 1em;
  height: 1em;
  margin-right: 8px;
}

.logout-item {
  position: absolute !important;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e6e6e6;
}

.subview {
  width: 90%;
  margin: 0 auto;
  background-color: aliceblue;
  height: 100%;
}

.el-container {
  height: 100%;
}
</style>

<script setup>
import { Postcard, Setting, Close, DArrowLeft } from "@element-plus/icons-vue";
</script>

<script>
import { ElMessageBox } from "element-plus";

export default {
  name: "LoginView",
  components: {},
  mounted() {
    if (!this.$var.auth.isValid()) {
      ElMessageBox.alert("登录失效！", { type: "warning" });
      this.$router.push({ path: "/" });
    } else {
      this.$router.push({ path: "/user/profile" });
    }
  },
  methods: {
    jumpLogout() {
      this.$var.auth.invalidate();
      this.$router.push("/");
    },
  },
};
</script>
