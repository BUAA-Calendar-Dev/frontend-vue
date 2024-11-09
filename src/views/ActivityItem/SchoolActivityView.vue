<template>
  <el-collapse accordion @change="expandItem">
    <el-collapse-item
      v-for="(item, index) in activityList"
      :key="index"
      :name="index"
    >
      <template #title>
        <div class="activity-title">{{ item.name }}</div>
        <div v-if="item['signed-in']">
          <span class="activity-signed-in is-in">已参加</span>
        </div>
        <div v-if="!item['signed-in']">
          <span class="activity-signed-in not-in">未参加</span>
        </div>
        <div class="activity-time">{{ item.time }}</div>
      </template>
      <div class="activity-detail">
        {{ item.content }}
        <br />
        <el-button
          style="float: right"
          type="primary"
          round
          @click="joinActivity(index)"
          v-if="!item['signed-in']"
          >参加活动</el-button
        >
        <el-button
          style="float: right"
          type="danger"
          round
          @click="exitActivity(index)"
          v-if="item['signed-in']"
          >退出活动</el-button
        >
        <br />
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style scope>
.activity-title {
  padding-left: 18px;
  font-weight: 700;
  font-size: large;
}

.activity-time {
  padding-left: 5px;
  color: gray;
}

.activity-signed-in {
  padding: 2px;
  margin: 1px;
  border: solid 1px black;
  border-radius: 20%;
}

.not-in {
  color: red;
  border-color: red;
}

.is-in {
  color: green;
  border-color: green;
}
</style>

<script>
export default {
  name: "SchoolActivityView",
  data() {
    return {
      activityList: [],
    };
  },
  mounted() {
    this.updateList();
  },
  methods: {
    updateList() {
      this.$apis.getActivityList().then((response) => {
        // TODO: Error Handler
        this.activityList = response.data.activities;
        for (let i = 0; i < this.activityList.length; i++) {
          this.activityList[i].content = null;
        }
      });
    },
    expandItem(index) {
      if (index === "" || this.activityList[index].content != null) {
        return;
      }
      this.$apis
        .getActivityContent(this.activityList[index].id)
        .then((response) => {
          // TODO: Error Handler
          this.activityList[index].content = response.data.content;
        });
    },
    joinActivity(index) {
      console.log(
        `Joining Activity: ${index} With id=${this.activityList[index].id}`
      );
    },
    exitActivity(index) {
      console.log(
        `Exiting Activity: ${index} With id=${this.activityList[index].id}`
      );
    },
  },
};
</script>
