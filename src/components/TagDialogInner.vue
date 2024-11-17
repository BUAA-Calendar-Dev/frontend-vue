<template>
  <el-row v-for="(tag, index) in tags" :key="index" class="tag-row">
    <el-col :span="2">
      <div class="circle" :style="{ background: tag.color }"></div>
    </el-col>
    <el-col :span="14">
      <div class="tag-title">{{ tag.title }}</div>
    </el-col>
    <el-col :span="2">
      <div class="tag-button" style="visibility: hidden"><Delete /></div>
    </el-col>
    <el-col :span="6" v-if="tag.fixed">
      <div class="tag-hint">（固定标签）</div>
    </el-col>
    <el-col :span="3" v-if="!tag.fixed">
      <div class="tag-button"><Delete /></div>
    </el-col>
    <el-col :span="3" v-if="!tag.fixed">
      <div class="tag-button"><Edit /></div>
    </el-col>
  </el-row>
</template>

<style>
.circle {
  clip-path: circle(50%);
  height: 1.3em;
  width: 1.3em;
}

.tag-title {
  margin-left: 0.5em;
  font-weight: bold;
  font-size: 1.3em;
  text-align: left;
}

.tag-hint {
  color: gray;
  text-align: center;
}

.tag-row {
  margin-bottom: 5px;
  height: 100%;
  align-items: center;
}

.tag-button {
  text-align: center;
  clip-path: circle(50%);
  width: 1.3em;
  height: 1.3em;
  padding: 0.3em;
  margin: auto;
}

.tag-button:hover {
  background-color: antiquewhite;
}
</style>

<script setup>
import { Delete, Edit } from "@element-plus/icons-vue";
</script>

<script>
export default {
  name: "TagDialogInner",
  props: {},
  data() {
    return {
      tags: [],
    };
  },
  mounted() {
    this.updateTagList();
  },
  methods: {
    updateTagList() {
      this.$apis
        .getTagList()
        .then((response) => {
          this.tags = response.data.tags;
          console.log(this.tags);
        })
        .catch(this.$utils.handleHttpException);
    },
  },
};
</script>
