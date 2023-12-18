<script setup lang="ts">
import { Repl, type SFCOptions } from "@vue/repl";
import Monaco from "@vue/repl/monaco-editor";

const sfcOptions: SFCOptions = {
  script: {
    reactivityTransform: true,
    defineModel: true,
  },
};

const initialUserOptions = {};

const handleKeydown = (evt: KeyboardEvent) => {
  if ((evt.ctrlKey || evt.metaKey) && evt.code === "KeyS") {
    evt.preventDefault();
    return;
  }
};
</script>

<template>
  <Repl
    ref="replRef"
    :editor="Monaco"
    show-compile-output
    auto-resize
    :sfc-options="sfcOptions"
    :clear-console="false"
    @keydown="handleKeydown"
  />
</template>

<style>
body {
  --at-apply: m-none text-13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  height: calc(100vh - var(--nav-height)) !important;
}
</style>
