<template>
  <div class="home">
    <div>
      <el-button type="success" icon="el-icon-refresh" circle @click="load" :loading="refreshLoading"></el-button>
      <el-button type="primary" icon="el-icon-plus" circle @click="add" :loading="addLoading"></el-button>
    </div>
    <p v-for="item of list" :key="item.port">{{item.port}}({{item.alias}}): {{item.usage | readable}}</p>
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
    add() {
      const self = this;
      this.$dialog.open({
        component: () => import("@/views/AddSetting"),
        props: {
          form: {
            port: "",
            alias: ""
          }
        },
        async confirm(props) {
          const form = props.form;
          await self.$http.post("/save", {
            port: parseInt(form.port),
            alias: form.alias
          });
          await self.load();
        },
        cancel() {}
      });
    }
  },
  filters: {
    readable(usage) {
      return `${(usage / 1024 / 1024).toFixed(2)}MB`;
    }
  }
};
</script>
