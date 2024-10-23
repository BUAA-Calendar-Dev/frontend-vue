<template>
  <div class="user-info"></div>
  <el-button @click="jumpBack" type="primary">返回</el-button>
  <el-button @click="jumpLogout">退出登录</el-button>
</template>

<script>
import { ElMessageBox } from "element-plus";

export default {
  name: "LoginView",
  components: {},
  mounted() {
    if (!this.$var.auth.isValid()) {
      ElMessageBox.alert("登录失效！", { type: "warning" });
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    jumpBack() {
      this.$router.push("/home");
    },
    jumpLogout() {
      this.$var.auth.invalidate();
      this.$router.push("/");
    },
  },
};
</script>
