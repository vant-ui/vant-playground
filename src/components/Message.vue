<script setup lang="ts">
import { withDefaults, computed, defineProps } from 'vue';
import { type CompilerError } from 'vue/compiler-sfc';
const props = withDefaults(
  defineProps<{
    error: string | Error;
  }>(),
  { error: '' },
);

const formatMessage = (err: string | Error): string => {
  if (typeof err === 'string') {
    return err;
  } else {
    let msg = err.message;
    const { loc } = err as CompilerError;
    if (loc && loc.start) {
      msg = `(${loc.start.line}:${loc.start.column}) ` + msg;
    }
    return msg;
  }
};
const error = computed(() => formatMessage(props.error));
</script>
<template>
  <div class="van-message">{{ error }}</div>
</template>

<style lang="scss">
.van-message {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #f56c6c;
  margin-bottom: 10px;
  border-radius: 4px;
  width: 100%;
  padding: 10px;
}
</style>
