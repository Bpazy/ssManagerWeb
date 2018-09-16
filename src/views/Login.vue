<template>
  <div>
    <el-form :model="formData">
      <el-form-item label="用户名" label-width="120px">
        <el-input v-model="formData.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="120px">
        <el-input v-model="formData.password" type="password" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="_confirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cancel: Function,
    confirm: Function
  },
  data() {
    return {
      formData: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    _confirm() {
      this.confirm(this.formData);
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>
