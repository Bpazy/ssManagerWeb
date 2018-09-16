<template>
  <div>
    <el-form :model="formData">
      <el-form-item label="端口号" label-width="120px" v-if="!editMode">
        <el-input v-model="formData.port" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="别名" label-width="120px">
        <el-input v-model="formData.alias" auto-complete="off"></el-input>
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
    editMode: false,
    form: {
      default() {
        return {
          port: "",
          alias: ""
        };
      }
    },
    cancel: Function,
    confirm: Function
  },
  data() {
    return {
      formData: {
        ...this.form
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
