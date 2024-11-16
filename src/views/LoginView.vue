<template>
  <div class="login-container">
    <div class="login-sidebox">
      <div class="login-description">
        <h1 style="text-align: left; margin-left: 20px">BUAA Calendar</h1>
        <p style="text-align: left; margin-left: 20px">描述</p>
      </div>
    </div>
    <div class="login-sideform">
      <h2 style="text-align: left; margin-left: 20px">登录</h2>
      <el-row type="flex" justify="center">
        <el-form
          :model="loginForm"
          ref="loginForm"
          class="loginForm"
          :rules="rules"
        >
          <el-form-item
            label="用户名"
            prop="username"
            label-width="80px"
            style="width: 350px"
          >
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            label-width="80px"
            style="width: 350px"
          >
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-center register">
              没有账号？立即<router-link to="/register">注册</router-link>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="form-center">
              <el-button type="primary" @click="login('student')"
                >登录为学生</el-button
              >
              <el-button type="primary" @click="login('teacher')"
                >登录为教师</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <!-- <div class="login-footer">(C)</div> -->
  </div>
</template>

<style scope>
.login-container {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  padding: 0;
  z-index: 1;
  transform: translate(-50%, -50%);
}

.login-sidebox {
  margin: 0;
  width: 50%;
  min-width: 500px;
  padding-top: 10px;
  background-color: antiquewhite;
}

.login-sideform {
  margin: 0;
  width: 50%;
  min-width: 500px;
  padding-top: 10px;
  background-color: aliceblue;
}

.form-center {
  margin: 0 auto;
}

.register {
  color: gray;
}
</style>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      links: ["/", "/home", "/register"],
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    login(role) {
      this.$apis
        .login(this.loginForm.username, this.loginForm.password, role)
        .then((response) => {
          if (response.data.code == 101) {
            this.$utils.popupMessage(
              "error",
              "登录失败",
              "用户名不存在或密码错误",
              5000
            );
            return;
          }
          if (response.data.code == 102) {
            this.$utils.popupMessage(
              "error",
              "登录失败",
              "用户角色错误！",
              5000
            );
            return;
          }
          this.$var.auth.login(
            response.data.token,
            role,
            response.data.user_id
          );
          this.$router.push({ path: "/home" });
        });
    },
  },
};
</script>
