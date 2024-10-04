<template>
  <div class="calendar-view">
    <el-container>
      <el-aside width="200px" style="background-color: cyan">
        <!-- Sidebar: Logo -->
        <el-row justify="center" style="margin-top: 20px">
          <el-col :span="18">
            <el-text size="large" style="font-weight: 800"
              >BUAA Calendar</el-text
            >
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-header style="background-color: antiquewhite">
          <el-main>
            <el-row align="middle">
              <!-- Header: switch-role (teacher) [TODO] -->
              <span v-if="$var.auth.role == 'teacher'">
                You are a teacher
              </span>
              <!-- Header: messages (student) -->
              <span v-if="$var.auth.role == 'student'">
                <el-badge
                  :hidden="unread == 0"
                  :value="unread"
                  :max="99"
                  class="item"
                >
                  <el-button :icon="Message" circle />
                </el-badge>
              </span>
            </el-row>
          </el-main>
        </el-header>
        <el-main style="background-color: honeydew">Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { Message } from "@element-plus/icons-vue";
</script>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      messageList: [],
      unread: 0,
    };
  },
  mounted() {
    if (this.$var.auth.role == "student") {
      this.$apis.getMessageList().then((response) => {
        this.messageList = response.data.messages;
        this.unread = 0;
        for (let element of this.messageList) {
          if (element.unread) {
            this.unread++;
          }
        }
      });
    }
  },
};
</script>

<style scope>
.calendar-view,
.el-container,
#app,
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>
