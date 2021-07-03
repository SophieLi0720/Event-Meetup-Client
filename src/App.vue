<template>
  <div id="app">
    <el-affix>
      <nav-bar></nav-bar>
    </el-affix>

    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
export default {
  name: "App",
  components: {
    NavBar,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
