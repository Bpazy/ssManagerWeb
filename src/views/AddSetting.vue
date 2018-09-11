<template>
  <div>
    <el-form :model="form">
      <el-form-item label="端口号" label-width="120px">
        <el-input v-model="form.port" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="别名" label-width="120px">
        <el-input v-model="form.alias" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      default() {
        return {
          port: "",
          alias: ""
        };
      }
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
