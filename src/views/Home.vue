<template>
  <div class="home">
    <p v-for="item of list" :key="item.port">{{item.port}}: {{item.usage | readable}}</p>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      list: []
    };
  },
  created() {
    this.list.push({
      port: 6666,
      usage: 115343360
    });
  },
  filters: {
    readable(usage) {
      return `${usage / 1024 / 1024}MB`;
    }
  }
};
</script>
