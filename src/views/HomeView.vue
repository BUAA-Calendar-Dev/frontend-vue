<template>
  <div class="calendar-view">
    <el-container>
      <el-aside width="200px" style="background-color: cyan">
        <!-- Sidebar: Logo -->
        <el-row justify="center" style="margin-top: 20px">
          <el-col :span="18">
            <el-text size="large" style="font-weight: 800"
              >BUAA Calendar</el-text
            >
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-header style="background-color: antiquewhite">Header</el-header>
        <el-main style="background-color: honeydew">Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scope>
.calendar-view,
.el-container,
#app,
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>
