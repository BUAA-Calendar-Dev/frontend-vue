<template>
  <div class="home container">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="8">
            <div
              class="fake-button"
              @click="this.$router.push({ path: '/home' })"
            >
              <DArrowLeft class="siderbar-icon" />
              返回主页
            </div>
          </el-col>
          <el-col :span="8"><div class="title">班级列表</div></el-col>
          <el-col :span="8">
            <div
              class="fake-button align-right"
              @click="this.$router.push({ path: '/user' })"
            >
              用户信息
              <User class="siderbar-icon-right" />
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-row>
        <el-col :span="12" v-for="(item, index) in classList" :key="index">
          <el-card class="class-card">AAA</el-card>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<style scope>
.container {
  width: 60%;
  position: absolute;
  left: 20%;
  top: 50px;
}

.siderbar-icon {
  width: 1em;
  height: 1em;
  margin-right: 8px;
}

.siderbar-icon-right {
  width: 1em;
  height: 1em;
  margin-left: 8px;
}

.title {
  font-size: large;
  font-weight: bold;
}

.fake-button {
  display: flex;
  align-items: center;
  padding: 8px;
}

.align-right {
  justify-content: flex-end;
}

.fake-button:hover {
  background-color: aliceblue;
}
</style>

<script setup>
import { DArrowLeft, User } from "@element-plus/icons-vue";
</script>

<script>
export default {
  name: "ClassView",
  data() {
    return {
      classList: [1, 2, 3],
    };
  },
};
</script>
