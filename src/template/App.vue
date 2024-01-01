<script setup lang="ts">
import { ref } from 'vue';

const msg = ref('Hello World!');
</script>
<template>
  <h1 style="text-align: center;">{{ msg }}</h1>
  <van-form>
    <van-cell-group inset>
      <van-field
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>
