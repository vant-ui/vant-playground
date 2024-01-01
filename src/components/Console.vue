<script setup lang="ts">
import { ReplStore } from '@vue/repl';
import { inject } from 'vue';
import Message from './Message.vue';

const store = inject('store') as ReplStore;
</script>

<template>
  <div class="van-console">
    <div class="no-error" v-show="store.state.errors.length === 0">No error log :)</div>
    <block v-show="store.state.errors.length !== 0">
      <Message
        v-for="(error, index) in store.state.errors"
        :key="index"
        :error="error"
      />
    </block>
  </div>
</template>

<style>
.van-console {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #fff;
  .no-error {
    color: var(--van-doc-green);
    font-size: 28px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
