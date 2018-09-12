<template>
  <div class="home">
    <div>
      <el-button type="success" icon="el-icon-refresh" @click="load" :loading="refreshLoading"></el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addRule" :loading="addLoading"></el-button>
    </div>

    <div v-for="(rule, index) of rules" :key="rule.port" class="item">
      <span class="itemDesc">{{rule.port}}({{rule.alias}}): {{rule.usage | readable}}</span>
      <el-button type="primary" icon="el-icon-delete" size="mini">编辑</el-button>
      <el-button type="primary" icon="el-icon-search" size="mini">重置</el-button>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="deleteRule(rule, index)">删除</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      rules: [],
      form: {
        port: "",
        alias: ""
      },
      refreshLoading: false,
      addLoading: false,
      deleteLoading: false,
      addDialogFormVisible: false
    };
  },
  async created() {
    await this.load();
    this.rules.forEach(rule => (rule.loading = false));
  },
  methods: {
    async load() {
      this.refreshLoading = true;
      this.rules = (await this.$http.get("/list")).data;
      this.refreshLoading = false;
    },
    addRule() {
      this.addLoading = true;
      const self = this;
      this.$dialog.open({
        component: () => import("@/views/AddSetting"),
        props: {
          form: {
            port: "",
            alias: ""
          },
          async confirm(form) {
            await self.$http.post("/save", {
              port: parseInt(form.port),
              alias: form.alias
            });
            await self.load();
            self.$dialog.close();
            self.addLoading = false;
          },
          cancel() {
            self.$dialog.close();
            self.addLoading = false;
          }
        }
      });
    },
    async deleteRule(rule, index) {
      this.setRuleLoadingState(index, true);

      try {
        await this.$confirm("此操作将导致历史记录被清空, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { code, msg } = (await this.$http.get(
          `/delete/${rule.port}`
        )).data;
        if (code === "Ok") this.$message({ message: msg, type: "success" });
        else this.$message.error(msg);

        await this.load();
      } catch (e) {
        this.setRuleLoadingState(index, false);
      }
    },
    setRuleLoadingState(index, loadingState) {
      const rule = this.rules[index];
      rule.loading = loadingState;
      this.$set(this.rules, index, rule);
    }
  },
  filters: {
    readable(usage) {
      return `${(usage / 1024 / 1024).toFixed(2)}MB`;
    }
  }
};
</script>
<style scoped>
.item {
  margin: 5px;
}
.itemDesc {
  margin: 0 5px 0 5px;
}
</style>
