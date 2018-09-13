<template>
  <div class="home">
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addRule" :loading="addLoading"></el-button>
    </div>

    <div v-for="(rule, index) of rules" :key="rule.port" class="item">
      <span class="alias">{{rule.port}}({{rule.alias}}): </span>
      <span class="usage">{{rule.usage | readable}}</span>
      <div class="buttons">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRule(rule)">编辑</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini"  @click="resetRule(rule)">重置</el-button>
        <el-button type="primary" icon="el-icon-delete" size="mini" @click="deleteRule(rule, index)">删除</el-button>
      </div>
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
      addLoading: false,
      deleteLoading: false,
      addDialogFormVisible: false
    };
  },
  async created() {
    await this.load();
    setInterval(async () => {
      await this.load();
    }, 3000);
    this.rules.forEach(rule => (rule.loading = false));
  },
  methods: {
    async load() {
      this.rules = (await this.$http.get("/list")).data;
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
    async deleteRule(rule) {
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
        console.log(e);
      }
    },
    editRule(rule) {
      const self = this;
      this.$dialog.open({
        component: () => import("@/views/AddSetting"),
        props: {
          editMode: true,
          form: {
            port: rule.port,
            alias: rule.alias
          },
          async confirm(form) {
            const { code, msg } = (await self.$http.post("/edit", {
              port: parseInt(form.port),
              alias: form.alias
            })).data;
            await self.load();
            self.$dialog.close();
            if (code === "Ok") this.$message({ message: msg, type: "success" });
            else this.$message.error(msg);
          },
          cancel() {
            self.$dialog.close();
          }
        }
      });
    },
    async resetRule(rule) {
      try {
        await this.$confirm("此操作将清空历史记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { code, msg } = (await this.$http.get(
          `/reset/${rule.port}`
        )).data;
        if (code === "Ok") this.$message({ message: msg, type: "success" });
        else this.$message.error(msg);

        await this.load();
      } catch (e) {
        console.log(e);
      }
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
.home {
  width: 800px;
  margin: 0 auto;
}

.item {
  display: flex;
  height: 40px;
  line-height: 40px;
}
.alias {
  flex: none;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.usage {
  flex: none;
  width: 100px;
  margin-left: 10px;
}
.buttons {
  flex: 1;
}
</style>
