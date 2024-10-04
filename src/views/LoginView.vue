<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <br />
    <el-button-group>
      <el-button type="primary" round @click="loginAsTeacher"
        >Login As Teacher</el-button
      >
      <el-button type="primary" round @click="loginAsStudent"
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
    loginAsTeacher() {
      this.$var.auth.login("fake-token", "teacher");
      this.$router.push({ path: "/home" });
    },
    loginAsStudent() {
      this.$var.auth.login("fake-token", "student");
      this.$router.push({ path: "/home" });
    },
  },
};
</script>
