<template>
  <el-collapse accordion v-model="opened" @change="expandItem">
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
          @click="interactActivity(index, 'join')"
          v-if="!item['signed-in']"
          >参加活动</el-button
        >
        <el-button
          style="float: right"
          type="danger"
          round
          @click="interactActivity(index, 'exit')"
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
      opened: null,
    };
  },
  mounted() {
    this.updateList();
  },
  methods: {
    updateList() {
      this.opened = null;
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
    interactActivity(index, operator) {
      console.log(
        `${operator}ing activity: ${index} With id=${this.activityList[index].id}`
      );
      this.$apis
        .updateActivityJoining(this.activityList[index].id, operator)
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
          // TODO: Error Handler
          this.updateList();
        });
    },
  },
};
</script>
