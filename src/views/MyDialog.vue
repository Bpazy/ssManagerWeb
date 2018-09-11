<template>
  <div>
    <el-dialog :title="opt.title" :visible.sync="visible" :before-close="_cancel">
      <component :is="currComponent" v-bind.sync="props"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="_cancel">取 消</el-button>
        <el-button type="primary" @click="_confirm">确 定</el-button>
      </div>
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
      opt: {
        title: "",
        confirm: Function,
        cancel: Function
      }
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
      this.opt = opt;
      this.props = opt.props;
    },
    _confirm() {
      this.visible = false;
      this.opt.confirm(this.props);
    },
    _cancel() {
      this.visible = false;
      this.opt.cancel();
    }
  }
};
</script>
