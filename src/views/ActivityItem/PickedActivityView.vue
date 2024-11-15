<template>
  <ActivityList :onlyShowSelf="true" />
</template>

<script>
import ActivityList from "@/components/ActivityList.vue";

export default {
  name: "PickedActivityView",
  components: {
    ActivityList,
  },
};
</script>
