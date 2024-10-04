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
                  <el-tooltip content="消息">
                    <el-button
                      :icon="Message"
                      circle
                      @click="openMessageDrawer"
                    />
                  </el-tooltip>
                </el-badge>
              </span>
            </el-row>
          </el-main>
        </el-header>
        <el-main style="background-color: honeydew">Main</el-main>
      </el-container>
    </el-container>
  </div>
  <!-- Drawer: message list (student) -->
  <el-drawer v-model="message_drawer" :direction="'rtl'">
    <template #header>
      <h4>收到的消息</h4>
    </template>
    <MessageList :messages="messageList" :update="updateMessage" />
  </el-drawer>
</template>

<script setup>
import { Message } from "@element-plus/icons-vue";
</script>

<script>
import MessageList from "@/components/MessageList.vue";

export default {
  name: "HomeView",
  component: {
    MessageList,
  },
  data() {
    return {
      messageList: [],
      unread: 0,
      message_drawer: false,
    };
  },
  mounted() {
    if (this.$var.auth.role == "student") {
      this.updateMessage();
    }
  },
  methods: {
    updateMessage() {
      this.$apis.getMessageList().then((response) => {
        this.messageList = response.data.messages;
        this.unread = 0;
        for (let element of this.messageList) {
          if (element.unread) {
            this.unread++;
          }
        }
        console.log(response.data.messages);
      });
    },
    openMessageDrawer() {
      if (this.$var.auth.role != "student") {
        console.warn(
          `Open Message: expected a student, got a {this.$var.auth.role}`
        );
        return;
      }
      this.message_drawer = true;
    },
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
