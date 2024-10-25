<template>
  <div
    style="
      width: 100px;
      height: 100px;
      border-radius: 100px;
      display: inline-block;
    "
  >
    <img
      style="width: 100%; height: 100%; border-radius: 100px"
      :src="avatar"
      class="image"
    />
  </div>

  <br />
  <br />
  <p class="info-username">{{ username }}</p>
  <br />

  <div v-for="(value, key) in listed" :key="key" class="detail-info">
    <div class="detail-info-title">
      {{ value.title }}
    </div>
    <div v-if="!value.inModify" class="detail-info-content">
      {{ value.content }}
    </div>
    <el-input
      v-if="value.inModify"
      v-model="value.content"
      class="detail-info-content"
      placeholder="Please Input"
    />
    <div
      v-if="!value.inModify"
      class="detail-info-modify"
      @click="startModify(key)"
    >
      <Edit class="detail-info-modify-icon" />
    </div>
    <div
      v-if="value.inModify"
      class="detail-info-modify"
      @click="endModify(key)"
    >
      <Check class="detail-info-modify-icon" />
    </div>
    <br />
  </div>
  <br />
  <el-button plain @click="inModifyPassword = true"> 修改密码 </el-button>
  <el-dialog v-model="inModifyPassword" title="修改密码" width="500">
    <span class="password-hint">密码</span>
    <el-input class="password-input" v-model="password.origin" show-password />
    <br />
    <span class="password-hint">确认密码</span>
    <el-input class="password-input" v-model="password.confirm" show-password />
    <br />
    <el-text
      type="danger"
      v-if="password.origin == '' && password.confirm == ''"
      >密码为空！</el-text
    >
    <el-text
      type="danger"
      v-if="
        password.confirm != password.origin &&
        !(password.origin == '' && password.confirm == '')
      "
      >密码不一致！</el-text
    >
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="inModifyPassword = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmModifyPassword()"
          :disabled="
            password.confirm != password.origin || password.origin == ''
          "
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scope>
.detail-info {
  text-align: left;
  margin-left: 15%;
  margin-right: 15%;
  height: 2em;
}

.detail-info-title {
  width: 20%;
  color: gray;
  float: left;
}

.detail-info-content {
  width: 60%;
  float: left;
  font-family: monospace, Arial, sans-serif;
}

.detail-info-modify {
  width: 1.5em;
  height: 1.5em;
  float: right;
  border-radius: 50%;
  text-align: center;
}

.detail-info-modify:hover {
  color: blueviolet;
  background-color: cyan;
}

.detail-info-modify-icon {
  width: 1.2em;
  height: 1.2em;
  margin-top: 0.15em;
}

.password-hint {
  text-align: right;
  display: -moz-inline-box;
  display: inline-block;
  width: 60px;
  margin-right: 10px;
}

.password-input {
  width: 300px;
}
</style>

<script setup>
import { Edit, Check } from "@element-plus/icons-vue";
</script>

<script>
export default {
  name: "ProfileView",
  data() {
    return {
      username: "<Unknown Username>",
      avatar: "/favicon.ico", // TODO: Use another default avatar
      listed: {
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
      },
      inModifyPassword: false,
      password: {
        origin: "",
        confirm: "",
      },
    };
  },
  mounted() {
    this.updateInfo();
  },
  methods: {
    startModify(key) {
      this.listed[key].inModify = true;
    },
    endModify(key) {
      this.listed[key].inModify = false;
      // eslint-disable-next-line no-unused-vars
      this.$apis.setUserInfo(key, this.listed[key].content).then((_) => {
        this.updateInfo();
      }); // TODO: Error handler
    },
    updateInfo() {
      this.$apis.getUserInfo(this.$var.auth.id).then((response) => {
        // TODO: Error Handler
        this.username = response.data.username;
        this.avatar = response.data.avatar;
        this.listed.email.content = response.data.email;
        this.listed.phone.content = response.data.phone;
      });
    },
    confirmModifyPassword() {
      this.inModifyPassword = false;
      // TODO: Modify the password
      this.password.origin = "";
      this.password.confirm = "";
    },
  },
};
</script>
