<script setup lang="ts">
import { ref } from "vue";
import { setupVant } from './vant.js'

setupVant();

const msg = ref("Hello World!");
</script>

<template>
  <h1>{{ msg }}</h1>
  <van-field v-model="msg" />
  <van-button>button</van-button>
</template>
