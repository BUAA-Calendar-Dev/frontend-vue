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
              {{ message.title }}
              <el-tooltip content="标记已读">
                <el-button
                  v-if="message.unread"
                  :icon="Check"
                  circle
                  @click="() => onRead(message.id)"
                />
              </el-tooltip>
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
import { Check } from "@element-plus/icons-vue";
</script>

<script>
export default {
  name: "MessageList",
  props: {
    messages: Array,
    update: Function,
  },
  methods: {
    onRead(id) {
      console.log("mark read the message with id " + id);
      this.$apis
        .setReadMessage(id)
        .then(() => {
          this.$message({
            message: "已标记为已读",
            type: "success",
            duration: 2000,
          });
          this.update();
        })
        .catch((error) => {
          this.$utils.handleHttpException(error);
        });
    },
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
