<template>
  <div>
    <el-row
      v-for="(message, index) in messages"
      :key="index"
      style="margin-bottom: 15px"
    >
      <el-card shadow="hover" style="width: 100%">
        <template #header>
          <div class="card-header">
            <div class="msg-title">
              <el-icon v-if="message.unread"><BellFilled /></el-icon>
              {{ message.title }}
            </div>
          </div>
        </template>

        <div class="msg-content">{{ message.content }}</div>

        <template #footer>
          <div class="card-footer">
            <!-- TODO: Make the footer more beautiful -->
            <div class="msg-info">发信人：{{ message.from }}</div>
            <div class="msg-info">时间：{{ message.time }}</div>
          </div>
        </template>
      </el-card>
    </el-row>
  </div>
</template>

<script setup>
import { BellFilled } from "@element-plus/icons-vue";
</script>

<script>
export default {
  name: "MessageList",
  props: {
    messages: Array,
  },
};
</script>

<style scope>
.msg-title {
  font-weight: 600;
  color: gray;
}

.msg-content {
  text-align: left;
}

.msg-info {
  text-align: left;
  color: cadetblue;
  font-size: small;
}
</style>
