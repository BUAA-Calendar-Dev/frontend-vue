<template>
  <div class="login-container">
    <div class="login-sidebox">
      <div class="login-description">
        <h1 style="text-align: left; margin-left: 20px">BUAA Calendar</h1>
        <p style="text-align: left; margin-left: 20px">
          适合于<b>北航er</b>体质的日程管理软件
        </p>
        <el-carousel
          trigger="click"
          height="200px"
          indicator-position="outside"
          style="margin-top: auto; margin-bottom: auto"
        >
          <el-carousel-item v-for="(item, index) in splash" :key="index">
            <h4>{{ item.title }}</h4>
            <p v-for="(content, index) in item.content" :key="index">
              {{ content }}
            </p>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div v-if="mode == 'login'" class="login-sideform">
      <h2 style="text-align: left; margin-left: 20px">登录</h2>
      <el-row type="flex" justify="center">
        <el-form
          :model="formData"
          ref="loginForm"
          class="loginForm"
          :rules="loginRules"
        >
          <el-form-item
            label="用户名"
            prop="username"
            label-width="80px"
            style="width: 350px"
          >
            <el-input v-model="formData.username"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            label-width="80px"
            style="width: 350px"
          >
            <el-input type="password" v-model="formData.password"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-center register">
              没有账号？立即<span class="fake-link" @click="gotoRegister(true)"
                >注册</span
              >
            </div>
          </el-form-item>
          <el-form-item>
            <div class="form-center">
              <el-button type="primary" @click="login('student')"
                >登录为学生</el-button
              >
              <el-button
                v-if="formData.username !== 'admin'"
                type="primary"
                @click="login('teacher')"
                >登录为教师</el-button
              >
              <el-button
                v-if="formData.username === 'admin'"
                type="primary"
                @click="login('admin')"
                >登录为管理员</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div v-if="mode == 'register'" class="login-sideform">
      <h2 style="text-align: left; margin-left: 20px">注册</h2>
      <el-row type="flex" justify="center">
        <el-form
          :model="formData"
          ref="registerForm"
          class="loginForm"
          :rules="registerRules"
        >
          <el-form-item
            label="用户名"
            prop="username"
            label-width="80px"
            style="width: 350px"
          >
            <el-input v-model="formData.username"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            label-width="80px"
            style="width: 350px"
          >
            <el-input type="password" v-model="formData.password"></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="confirmPassword"
            label-width="80px"
            style="width: 350px"
          >
            <el-input
              type="password"
              v-model="formData.confirmPassword"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="email"
            label-width="80px"
            style="width: 350px"
          >
            <el-input v-model="formData.email"></el-input>
          </el-form-item>
          <el-form-item
            label="电话号码"
            prop="phone"
            label-width="80px"
            style="width: 350px"
          >
            <el-input v-model="formData.phone"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-center register">
              已有账号？立即<span class="fake-link" @click="gotoRegister(false)"
                >登录</span
              >
            </div>
          </el-form-item>
          <el-form-item>
            <div class="form-center">
              <el-button type="primary" @click="register('student')"
                >注册为学生</el-button
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

.fake-link {
  text-decoration: underline blue;
  color: blueviolet;
}

.fake-link:hover {
  cursor: pointer;
}
</style>

<script>
export default {
  name: "LoginView",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (value === "" || /^\d+$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的电话号码"));
      }
    };
    const baseRules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: ["blur", "change"],
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: ["blur", "change"],
        },
      ],
    };
    return {
      links: ["/", "/home", "/register"],
      mode: "login",
      formData: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
      },
      loginRules: {
        ...baseRules,
      },
      registerRules: {
        ...baseRules,
        confirmPassword: [
          {
            required: true,
            validator: validatePassword,
            trigger: ["blur", "change"],
          },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            validator: validatePhone,
            trigger: ["blur", "change"],
          },
        ],
      },
      splash: [
        {
          title: "清晰的日程展示",
          content: [
            "展示每日日程安排，按时间抽清晰呈现",
            "可接收集体任务，亦可自定义日程",
            "将活动纳入日程的范畴，提升日程管理效率",
          ],
        },
        {
          title: "作业、博雅同步跟踪",
          content: [
            "支持班级集体任务，支持全校公共活动",
            "一键加入日程，不再错过任何一场精彩",
          ],
        },
        {
          title: "高度可定制，满足个性需求",
          content: [
            "自定义任务标签，提供多样的任务分类",
            "自定义提醒时间，适合不同的个性习惯",
          ],
        },
      ],
    };
  },
  methods: {
    gotoRegister(mode) {
      this.mode = mode ? "register" : "login";
      this.formData.password = "";
      this.formData.confirmPassword = "";
    },
    register(role) {
      this.$refs.registerForm.validate((valid) => {
        if (!valid) {
          this.$utils.popupMessage("error", "注册失败", "请填写正确的信息！");
          return;
        }
        if (role !== "student") {
          this.$utils.popupMessage("error", "注册失败", "非法的用户角色！");
        }
        this.$apis
          .register(this.formData.username, this.formData.password, "student", {
            email: this.formData.email,
            phone: this.formData.phone,
          })
          .then((response) => {
            if (response.data.code == 103) {
              this.$utils.popupMessage(
                "error",
                "注册失败",
                "用户名被占用",
                5000
              );
              return;
            } else {
              this.$utils.popupMessage(
                "success",
                "注册成功",
                "欢迎使用 BUAA Calendar！"
              );
              this.gotoRegister(false);
            }
          })
          .catch(this.$utils.handleHttpException);
      });
    },
    login(role) {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          this.$utils.popupMessage("error", "登录失败", "请填写正确的信息！");
          return;
        }
        this.$apis
          .login(this.formData.username, this.formData.password, role)
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
            if (role === "admin") {
              this.$router.push({ path: "/admin" });
            } else {
              this.$router.push({ path: "/home" });
            }
          })
          .catch(this.$utils.handleHttpException);
      });
    },
  },
};
</script>
