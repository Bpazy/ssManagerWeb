<template>
  <div id="app">
    <router-view/>
    <my-dialog></my-dialog>
  </div>
</template>

<script>
import MyDialog from "@/views/MyDialog";
export default {
  components: {
    MyDialog
  }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
