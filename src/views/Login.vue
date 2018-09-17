<template>
  <div>
    <el-form :model="form">
      <el-form-item label="用户名" label-width="120px">
        <el-input v-model="form.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="120px">
        <el-input v-model="form.password" type="password" auto-complete="off"
                  @keyup.enter.native="_confirm"></el-input>
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
    loginSuccess: Function,
    loginFailed: Function
  },
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async _confirm() {
      const result = (await this.$http.post("/login", {
        username: this.form.username,
        password: this.form.password
      })).data;
      if (result.code === "Ok") {
        this.$dialog.close();
        this.loginSuccess();
      } else {
        this.form.password = "";
        this.$message({
          message: result.msg,
          type: "info"
        });
        this.loginFailed();
      }
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>
