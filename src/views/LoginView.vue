<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <br />
    <el-button-group>
      <el-button type="primary" round @click="login('teacher')"
        >Login As Teacher</el-button
      >
      <el-button type="primary" round @click="login('student')"
        >Login As Student</el-button
      >
    </el-button-group>
    <HelloWorld msg="This is login view." :jumps="links" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "LoginView",
  components: {
    HelloWorld,
  },
  data() {
    return {
      links: ["/", "/home", "/register", "/admin"],
    };
  },
  methods: {
    login(role) {
      this.$apis.login("Bob", "HelloWorld", role).then((response) => {
        if (response.data.code != 0) {
          return; // TODO: Login Failed
        }
        this.$var.auth.login(response.data.token, role, response.data.user_id);
        this.$router.push({ path: "/home" });
      });
    },
  },
};
</script>
