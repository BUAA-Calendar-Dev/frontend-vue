<template>
  <div class="profile-container">
    <div class="avatar-section">
      <div class="avatar-wrapper" @click="triggerUpload">
        <el-image :src="avatar" class="avatar-image" :fit="'cover'" />
        <div class="avatar-overlay">
          <el-icon class="upload-icon"><Upload /></el-icon>
          <span>更换头像</span>
        </div>
      </div>
      <input
        type="file"
        ref="fileInput"
        style="display: none"
        accept="image/*"
        @change="handleAvatarUpload"
      />
      <h2 class="username">{{ username }}</h2>
    </div>

    <el-card class="info-card" shadow="hover">
      <div v-for="(value, key) in listed" :key="key" class="info-item">
        <div class="info-label">
          {{ value.title }}
        </div>
        <div class="info-content" :data-key="key">
          <template v-if="value.inModify">
            <el-radio-group v-if="key === 'gender'" v-model="value.content">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
              <el-radio label="secret">保密</el-radio>
            </el-radio-group>
            <el-input
              v-else-if="key === 'motto'"
              v-model="value.content"
              :placeholder="`请输入${value.title}`"
              type="textarea"
              :rows="2"
              maxlength="100"
              show-word-limit
            />
            <el-input
              v-else
              v-model="value.content"
              :placeholder="`请输入${value.title}`"
              clearable
            />
          </template>
          <span v-else>
            {{ key === "gender" ? genderMap[value.content] : value.content }}
          </span>
        </div>
        <div class="info-action">
          <el-button
            :icon="value.inModify ? Check : Edit"
            circle
            :type="value.inModify ? 'success' : 'primary'"
            @click="value.inModify ? endModify(key) : startModify(key)"
          />
        </div>
      </div>
    </el-card>

    <el-button
      class="password-btn"
      type="primary"
      @click="inModifyPassword = true"
    >
      修改密码
    </el-button>

    <el-dialog
      v-model="inModifyPassword"
      title="修改密码"
      width="500px"
      destroy-on-close
    >
      <el-form
        :model="password"
        label-width="100px"
        :rules="passwordRules"
        ref="passwordFormRef"
      >
        <el-form-item label="新密码" prop="origin">
          <el-input
            v-model="password.origin"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
          <el-input
            v-model="password.confirm"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelModifyPassword">取消</el-button>
          <el-button
            type="primary"
            @click="confirmModifyPassword"
            :loading="isSubmitting"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.username {
  margin-top: 15px;
  font-size: 24px;
  color: #303133;
}

.info-card {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  width: 100px;
  color: #606266;
}

.info-content {
  flex: 1;
  margin: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-content span {
  display: block;
  text-align: center;
  width: 100%;
  max-width: 400px;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
}

.info-content[data-key="motto"] span {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

.info-content :deep(.el-textarea__inner) {
  text-align: center;
  resize: none;
  line-height: 1.5;
  padding: 8px 15px;
}

.info-action {
  width: 50px;
  text-align: right;
}

.password-btn {
  width: 100%;
}

.dialog-footer {
  text-align: right;
  margin-top: 20px;
}

.info-content .el-radio-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;
  max-width: 400px;
}

.info-content .el-input {
  max-width: 400px;
  width: 100%;
}

.info-content :deep(.el-input__inner) {
  text-align: center;
}

.info-content :deep(.el-textarea__inner) {
  text-align: center;
  resize: none;
}

.info-content > * {
  flex: 1;
  max-width: 400px;
}
</style>

<script setup>
import { Edit, Check, Upload } from "@element-plus/icons-vue";
import { ref } from "vue";

const fileInput = ref(null);
const passwordFormRef = ref(null);
const isSubmitting = ref(false);

const triggerUpload = () => {
  fileInput.value.click();
};

const password = ref({
  origin: "",
  confirm: "",
});

const passwordRules = {
  origin: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
  ],
  confirm: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== password.value.origin) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};
</script>

<script>
export default {
  name: "ProfileView",
  data() {
    return {
      username: "<Unknown Username>",
      avatar: "/favicon.ico",
      genderMap: {
        male: "男",
        female: "女",
        secret: "保密",
      },
      listed: {
        gender: {
          title: "性别",
          content: "secret",
          inModify: false,
        },
        email: {
          title: "邮箱",
          content: "<Unknown Email>",
          inModify: false,
        },
        phone: {
          title: "手机号",
          content: "<Unknown Phone Number>",
          inModify: false,
        },
        motto: {
          title: "个性签名",
          content: "",
          inModify: false,
        },
      },
      inModifyPassword: false,
    };
  },
  mounted() {
    this.updateInfo();
  },
  methods: {
    async handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const response = await this.$apis.updateAvatar(file);
        this.avatar = response.data.avatar;
        this.$message.success("头像上传成功");
      } catch (error) {
        this.$utils.handleHttpException(error);
      }

      event.target.value = "";
    },
    startModify(key) {
      this.listed[key].inModify = true;
    },
    async endModify(key) {
      try {
        await this.$apis.setUserInfo(key, this.listed[key].content);
        this.listed[key].inModify = false;
        await this.updateInfo();
        this.$message.success("修改成功");
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },
    async updateInfo() {
      try {
        const response = await this.$apis.getUserInfo(this.$var.auth.id);
        this.username = response.data.username;
        this.avatar = response.data.avatar;
        this.listed.email.content = response.data.email;
        this.listed.phone.content = response.data.phone;
        this.listed.gender.content = response.data.gender || "secret";
        this.listed.motto.content = response.data.motto || "";
      } catch (error) {
        this.$utils.handleHttpException(error);
      }
    },
    cancelModifyPassword() {
      this.inModifyPassword = false;
      this.password.origin = "";
      this.password.confirm = "";
      if (this.passwordFormRef) {
        this.passwordFormRef.resetFields();
      }
    },
    async confirmModifyPassword() {
      if (!this.passwordFormRef) return;

      try {
        await this.passwordFormRef.validate();
        this.isSubmitting = true;

        // TODO: 实现修改密码的API调用
        // await this.$apis.modifyPassword(this.password.origin);

        this.$message.success("密码修改成功");
        this.cancelModifyPassword();
      } catch (error) {
        if (error.message) {
          this.$message.error(error.message);
        }
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
