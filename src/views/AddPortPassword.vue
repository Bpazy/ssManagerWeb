<template>
  <div>
    <el-form :model="formData">
      <el-form-item label="端口号" label-width="120px">
        <el-input v-model="formData.port" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="120px">
        <el-input v-model="formData.password" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["success", "fail"],
  data() {
    return {
      formData: {
        port: "",
        password: ""
      }
    };
  },
  methods: {
    async confirm() {
      const { code, msg } = (await this.$http.post("/addPortPassword", {
        port: this.formData.port,
        password: this.formData.password
      })).data;

      if (code === "Ok") {
        this.$message({ message: msg, type: "success" });
        this.success();
      } else {
        this.$message.error(msg);
        this.fail();
      }
    },
    cancel() {
      this.$dialog.close();
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>
