<script setup lang="ts">
import { ref } from "vue";

const msg = ref("Hello World!");
</script>
<template>
  <h1>{{ msg }}</h1>
  <van-field v-model="msg" />
  <van-button>Click</van-button>
</template>
