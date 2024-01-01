<script setup lang="ts">
import { Repl, Preview, type SFCOptions } from '@vue/repl';
import Monaco from '@vue/repl/monaco-editor';
import Header from './components/Header.vue';
import { ref, provide, watchEffect, computed } from 'vue';
import { useDark } from '@vueuse/core';
import { Splitpanes, Pane } from 'splitpanes';
import { genCdnLink } from './utils';
import store from './store';
import 'vant/lib/index.css';

const sfcOptions: SFCOptions = {
  script: {
    reactivityTransform: true,
    defineModel: true,
  },
};

const handleKeydown = (evt: KeyboardEvent) => {
  if ((evt.ctrlKey || evt.metaKey) && evt.code === 'KeyS') {
    evt.preventDefault();
    return;
  }
};

const config = {
  logo: genCdnLink('@vant', '', '/assets/logo.png'),
  title: 'Vant Playground',
  subtitle: '',
  links: [
    {
      url: 'https://github.com/vant-ui/vant-playground',
      logo: genCdnLink('@vant', '', '/assets/github.svg'),
    },
  ],
};
const langConfigs: string[] = [];
const dark = useDark();
const theme = computed(() => (dark.value ? 'dark' : 'light'));

provide('store', store);
provide('preview-options', {});
provide('clear-console', false);
const previewRef = ref<InstanceType<typeof Preview>>();
function reload() {
  previewRef.value?.reload();
}

defineExpose({ reload });
watchEffect(() => history.replaceState({}, '', store.serialize()));
const panelSize = ref(20)
const onResizePanel = (event: { size: number }[]) => {
  panelSize.value = event[0].size
}
</script>

<template>
  <Header :config="config" :lang-configs="langConfigs" lang="zh-CN"> </Header>
  <div class="van-repl">
    <splitpanes class="default-theme" @resize="onResizePanel">
      <pane :size="panelSize" min-size="20">
        <div class="van-output">
          <Preview ref="previewRef" :show="true" :ssr="false" />
        </div>
      </pane>
      <pane :size="100 - panelSize" min-size="20">
        <div class="van-editor">
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
      </pane>
    </splitpanes>
  </div>
</template>

<style lang="scss">
body {
  --at-apply: m-none text-13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --base: #444;
  --nav-height: 50px;
}
.splitpanes__pane {
  // box-shadow: 0 0 3px rgba(0, 0, 0, .2) inset;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
  border-right: 1px solid var(--van-doc-border-color);
  border-left: 1px solid var(--van-doc-border-color);
}
.van-repl {
  height: calc(100vh - var(--van-doc-header-top-height)) !important;
}
.dark .vue-repl,
.vue-repl {
  height: 100%;
  flex: 1;
  --color-branding: var(--van-doc-link-color) !important;
  .right {
    flex: 1;
  }
  .left, .toggler {
    display: none;
  }
}
.van-output {
  width: 100%;
  height: 100%;
  .iframe-container {
    height: 100%;
  }
}
.van-editor {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
</style>
