<template>
  <ActivityList :onlyShowSelf="false" />
</template>

<script>
import ActivityList from "@/components/ActivityList.vue";

export default {
  name: "SchoolActivityView",
  components: {
    ActivityList,
  },
};
</script>
