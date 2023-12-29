<script setup lang="ts">
import { Repl, Preview, type SFCOptions } from "@vue/repl";
import Monaco from "@vue/repl/monaco-editor";
import Header from "./components/Header.vue";
import { ref, provide, watchEffect, computed } from "vue";
import { useDark } from "@vueuse/core";
import { genCdnLink } from "./utils";
import store from "./store";
import 'vant/lib/index.css';

const sfcOptions: SFCOptions = {
  script: {
    reactivityTransform: true,
    defineModel: true,
  },
};

const handleKeydown = (evt: KeyboardEvent) => {
  if ((evt.ctrlKey || evt.metaKey) && evt.code === "KeyS") {
    evt.preventDefault();
    return;
  }
};

const config = {
  logo: genCdnLink("@vant", "", "/assets/logo.png"),
  title: "Vant Playground",
  subtitle: "",
  links: [
    {
      url: "https://github.com/vant-ui/vant-playground",
      logo: genCdnLink("@vant", "", "/assets/github.svg"),
    },
  ],
};
const langConfigs: string[] = [];
const dark = useDark()
const theme = computed(() => dark.value ? "dark" : "light")

provide("store", store);
provide("preview-options", {});
provide("clear-console", false);
const previewRef = ref<InstanceType<typeof Preview>>();
function reload() {
  previewRef.value?.reload();
}

defineExpose({ reload });
watchEffect(() => history.replaceState({}, "", store.serialize()));
</script>

<template>
  <Header :config="config" :lang-configs="langConfigs" lang="zh-CN">
    </Header>
  <div class="van-repl">
    <div class="van-output">
      <Preview ref="previewRef" :show="true" :ssr="false" />
    </div>
    <Repl
      ref="replRef"
      :store="store"
      :theme="theme"
      :editor="Monaco"
      :show-compile-output="false"
      auto-resize
      :layout-reverse="true"
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
.van-repl {
  height: calc(100vh - var(--van-doc-header-top-height)) !important;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
}
.dark .vue-repl,
.vue-repl {
  flex: 1;
  --color-branding: var(--van-doc-link-color) !important;
  .right {
  flex: 1;
  }
  .left {
  display: none;
  }
}
.van-output {
  width: 390px;
  border-right: 1px solid #e5e7eb;
  height: calc(100vh - var(--van-doc-header-top-height)) !important;
  .iframe-container {
    height: 100%;
  }
}
</style>
