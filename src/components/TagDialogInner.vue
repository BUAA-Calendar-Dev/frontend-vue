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
      <div class="tag-button" @click="deleteTag(tag.id)"><Delete /></div>
    </el-col>
    <el-col :span="3" v-if="!tag.fixed">
      <div
        class="tag-button"
        @click="openModifyTag(tag.id, tag.title, tag.color)"
      >
        <Edit />
      </div>
    </el-col>
  </el-row>
  <el-dialog v-model="modifyDialogOpen" title="修改任务标签" width="600">
    <span style="margin-right: 8px; width: 40px">标题</span>
    <el-input style="width: 240px" v-model="inputTitle"></el-input>

    <span style="margin-left: 8px; width: 40px">色彩</span>
    <el-color-picker
      v-model="inputColor"
      size="small"
      color-format="hex"
      style="margin-right: 8px; width: 40px"
      @focus="setNoClear"
    />
    <span style="width: 180px">{{ inputColor.toUpperCase() }}</span>
    <br />
    <br />
    <el-button type="primary" @click="doTagModify">确认修改</el-button>
  </el-dialog>
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

.el-color-dropdown__link-btn-perform {
  display: none;
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
      modifyingTagId: -1,
      modifyDialogOpen: false,
      inputTitle: "",
      inputColor: "#000000",
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
        })
        .catch(this.$utils.handleHttpException);
    },
    deleteTag(id) {
      console.log(`Delete Tag: ${id}`);
      this.$apis
        .deleteTag(id)
        .then((response) => {
          if (response.data.code == 0) {
            this.$utils.popupMessage("success", "删除成功", "");
          } else {
            this.$utils.popupMessage(
              "error",
              "修改失败",
              `返回码：${response.data.code}，标签不存在或无法删除`,
              5000
            );
          }
          this.updateTagList();
        })
        .catch(this.$utils.handleHttpException);
    },
    openModifyTag(id, title, color) {
      console.log(`Open Dialog to Modify Tag: ${id}`);
      this.inputTitle = title;
      this.inputColor = color;
      this.modifyingTagId = id;
      this.modifyDialogOpen = true;
    },
    doTagModify() {
      this.inputColor = this.inputColor.toLowerCase();
      console.log(
        `Modify Tag: ${this.modifyingTagId}. Title: ${this.inputTitle}, Color: ${this.inputColor}`
      );
      this.$apis
        .modifyTag(this.modifyingTagId, this.inputTitle, this.inputColor)
        .then((response) => {
          if (response.data.code == 0) {
            this.$utils.popupMessage("success", "修改成功", "");
          } else {
            this.$utils.popupMessage(
              "error",
              "修改失败",
              `返回码：${response.data.code}，标签不存在或无法修改`,
              5000
            );
          }
          this.updateTagList();
        })
        .catch(this.$utils.handleHttpException);
      this.modifyingTagId = -1;
      this.modifyDialogOpen = false;
    },
    setNoClear() {
      var obj = document.querySelector(".el-color-dropdown__link-btn");
      if (obj) {
        obj.className = "el-color-dropdown__link-btn-perform";
      }
    },
  },
};
</script>
