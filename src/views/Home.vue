<template>
  <div class="home">
    <div>
      <el-button type="success" icon="el-icon-refresh" circle @click="load" :loading="refreshLoading"></el-button>
      <el-button type="primary" icon="el-icon-plus" circle @click="showDialog" :loading="addLoading"></el-button>
    </div>
    <p v-for="item of list" :key="item.port">{{item.port}}({{item.alias}}): {{item.usage | readable}}</p>

    <el-dialog title="SS流量监控配置" :visible.sync="addDialogFormVisible">
      <el-form :model="form">
        <el-form-item label="端口号" label-width="120px">
          <el-input v-model="form.port" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="别名" label-width="120px">
          <el-input v-model="form.alias" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      list: [],
      form: {
        port: "",
        alias: ""
      },
      refreshLoading: false,
      addLoading: false,
      addDialogFormVisible: false
    };
  },
  async created() {
    await this.load();
  },
  methods: {
    async load() {
      this.refreshLoading = true;
      this.list = (await this.$http.get("/list")).data;
      this.refreshLoading = false;
    },
    async add() {
      await this.$http.post("/save", {
        port: parseInt(this.form.port),
        alias: this.form.alias
      });
      await this.load();
    },
    async confirm() {
      this.add();
      this.hideDialog();
    },
    hideDialog() {
      this.addDialogFormVisible = false;
      this.addLoading = false;
    },
    showDialog() {
      this.addLoading = true;
      this.addDialogFormVisible = true;
    }
  },
  filters: {
    readable(usage) {
      return `${(usage / 1024 / 1024).toFixed(2)}MB`;
    }
  }
};
</script>
