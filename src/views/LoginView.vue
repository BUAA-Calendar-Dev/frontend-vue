<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
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
};
</script>
