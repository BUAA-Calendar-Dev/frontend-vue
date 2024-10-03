<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="This is class manager for teachers view." :jumps="links" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "ClassManagerView",
  components: {
    HelloWorld,
  },
  data() {
    return {
      links: ["/home"],
    };
  },
};
</script>
