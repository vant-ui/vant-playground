<script setup lang="ts">
import { Repl, type SFCOptions } from "@vue/repl";
import Monaco from "@vue/repl/monaco-editor";
import Header from "./components/Header.vue";

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
const cdnURL = (path: string) =>
  `https://fastly.jsdelivr.net/npm/@vant/assets/${path}`;

const config = {
  logo: cdnURL("logo.png"),
  title: 'Vant Playground',
  links: [{
    url: 'https://github.com/vant-ui/vant-playground',
    logo: cdnURL('github.svg'),
  }],
};
const versions = []
const langConfigs = []
</script>

<template>
  <div>
    <Header :config="config" :lang-configs="langConfigs" lang="zh-CN" />
    <Repl
      ref="replRef"
      :editor="Monaco"
      show-compile-output
      auto-resize
      :sfc-options="sfcOptions"
      :clear-console="false"
      @keydown="handleKeydown"
    />
  </div>
</template>

<style lang="scss">
body {
  --at-apply: m-none text-13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  height: calc(100vh - var(--nav-height)) !important;
}
</style>
