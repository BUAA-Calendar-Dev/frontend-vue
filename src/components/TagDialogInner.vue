<template>
  <el-row v-for="(tag, index) in tags" :key="index" class="tag-row">
    <el-tooltip
      :content="tag.content || '暂无描述'"
      placement="top"
      :hide-after="0"
      :show-after="500"
    >
      <div class="tag-content-wrapper">
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
            @click="openModifyTag(tag.id, tag.title, tag.color, tag.content)"
          >
            <Edit />
          </div>
        </el-col>
      </div>
    </el-tooltip>
  </el-row>
  <el-row>
    <el-col :span="6" :offset="18">
      <el-button type="primary" @click="openNewTag">新增标签</el-button>
    </el-col>
  </el-row>
  <el-dialog v-model="modifyDialogOpen" title="修改任务标签" width="600">
    <el-row class="dialog-row">
      <el-col :span="4">
        <span class="field-label">标题</span>
      </el-col>
      <el-col :span="20">
        <el-input v-model="inputTitle" placeholder="请输入标签标题"></el-input>
      </el-col>
    </el-row>

    <el-row class="dialog-row">
      <el-col :span="4">
        <span class="field-label">色彩</span>
      </el-col>
      <el-col :span="20">
        <div class="color-picker-container">
          <el-color-picker
            v-model="inputColor"
            size="default"
            color-format="hex"
            @focus="setNoClear"
          />
          <span class="color-value">{{ inputColor.toUpperCase() }}</span>
        </div>
      </el-col>
    </el-row>

    <el-row class="dialog-row">
      <el-col :span="4">
        <span class="field-label">描述</span>
      </el-col>
      <el-col :span="20">
        <el-input
          type="textarea"
          :rows="3"
          v-model="inputContent"
          placeholder="请输入标签描述"
        ></el-input>
      </el-col>
    </el-row>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-if="modifyType == 'modify'"
          type="primary"
          @click="doTagModify"
          >确认修改</el-button
        >
        <el-button v-if="modifyType == 'new'" type="primary" @click="doTagNew"
          >确认新建</el-button
        >
        <el-button @click="modifyDialogOpen = false">取消</el-button>
      </div>
    </template>
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

.dialog-row {
  margin-bottom: 20px;
}

.field-label {
  line-height: 32px;
  font-size: 14px;
  color: #606266;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-value {
  font-size: 14px;
  color: #606266;
}

.dialog-footer {
  text-align: right;
}

:deep(.el-dialog__body) {
  padding: 30px;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

:deep(.el-color-picker__trigger) {
  width: 40px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.el-textarea__inner) {
  font-family: inherit;
}

:deep(.el-dialog__footer) {
  padding: 0 30px 30px;
  border-top: none;
}

.tag-content-wrapper {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 8px 0;
  cursor: help;
}

:deep(.el-tooltip__trigger) {
  width: 100%;
}

:deep(.el-tooltip__popper) {
  max-width: 300px;
  word-break: break-all;
  line-height: 1.5;
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
      inputContent: "",
      modifyType: "modify",
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
              "删除失败",
              `返回码：${response.data.code}，标签不存在或无法删除`,
              5000
            );
          }
          this.updateTagList();
        })
        .catch(this.$utils.handleHttpException);
    },
    openModifyTag(id, title, color, content) {
      console.log(`Open Dialog to Modify Tag: ${id}`);
      this.inputTitle = title;
      this.inputColor = color;
      this.inputContent = content || "";
      this.modifyingTagId = id;
      this.modifyDialogOpen = true;
      this.modifyType = "modify";
    },
    openNewTag() {
      this.inputTitle = "";
      this.inputColor = "#000000";
      this.inputContent = "";
      this.modifyDialogOpen = true;
      this.modifyType = "new";
    },
    doTagModify() {
      this.inputColor = this.inputColor.toLowerCase();
      console.log(
        `Modify Tag: ${this.modifyingTagId}. Title: ${this.inputTitle}, Color: ${this.inputColor}, Content: ${this.inputContent}`
      );
      this.$apis
        .modifyTag(
          this.modifyingTagId,
          this.inputTitle,
          this.inputColor,
          this.inputContent
        )
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
    doTagNew() {
      this.inputColor = this.inputColor.toLowerCase();
      console.log(
        `New Tag. Title: ${this.inputTitle}, Color: ${this.inputColor}, Content: ${this.inputContent}`
      );
      this.$apis
        .newTag(this.inputTitle, this.inputColor, this.inputContent)
        .then((response) => {
          if (response.data.code == 0) {
            this.$utils.popupMessage("success", "新增成功", "");
          } else {
            this.$utils.popupMessage(
              "error",
              "新增失败",
              `返回码：${response.data.code}，未知错误`,
              5000
            );
          }
          this.updateTagList();
        })
        .catch(this.$utils.handleHttpException);
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
