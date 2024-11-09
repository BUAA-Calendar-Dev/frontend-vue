<template>
  <el-collapse v-model="opened">
    <el-collapse-item
      v-for="(item, index) in preference"
      :key="index"
      :title="item['name']"
      :name="index"
    >
      <div
        class="config-subitem"
        v-for="(subitem, subindex) in item['items']"
        :key="subindex"
      >
        <div class="config-detail-title">
          {{ subitem["name"] }}
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style scope>
.config-subitem {
  background-color: antiquewhite;
}

.config-detail-title {
  width: 20%;
  color: gray;
  float: left;
  text-align: left;
  margin-left: 10%;
}
</style>

<script setup>
import { ref } from "vue";

// FIXME: Open all of them when setting up
const opened = ref(["0", "1"]);
</script>

<script>
export default {
  name: "PreferenceView",
  data() {
    return {
      preference: [
        {
          key: "appearence",
          name: "外观设置",
          items: [
            {
              key: "theme",
              name: "主题",
              content: this.getPreference(["appearence", "theme"], "0"),
              type: "choice",
              items: ["浅色", "深色", "跟随系统"],
            },
          ],
        },
        {
          key: "alarm",
          name: "提醒设置",
          items: [],
        },
      ],
    };
  },
  methods: {
    setPreference(keys, value) {
      localStorage.setItem(["preference", ...keys].join("."), value);
    },
    getPreference(keys, defaultValue) {
      return (
        localStorage.getItem(["preference", ...keys].join(".")) || defaultValue
      );
    },
  },
};
</script>
