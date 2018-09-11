<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" :show-close="false">
      <component :is="currComponent" v-bind="props"></component>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {
      visible: false,
      currComponent: "",
      props: "",
      title: ""
    };
  },
  beforeCreate() {
    Object.defineProperty(Vue.prototype, "$dialog", {
      value: this,
      readable: true,
      writable: false
    });
  },
  methods: {
    open(opt) {
      this.visible = true;
      this.currComponent = opt.component;
      this.props = opt.props;
      this.title = opt.title;
    },
    close() {
      this.visible = false;
    }
  }
};
</script>
