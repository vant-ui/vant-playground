<script setup lang="ts">
import {
  File,
  Repl,
  ReplStore,
  compileFile,
  type Store,
  type SFCOptions,
  type StoreState,
} from "@vue/repl";
import Monaco from "@vue/repl/monaco-editor";
import Header from "./components/Header.vue";
import { watchEffect } from "vue";
import { URLSearchParams } from "url";
import mainCode from "./template/main.vue?raw";
import welcomeCode from "./template/welcome.vue?raw";
import { shallowRef, reactive } from "vue";
const defaultMainFile = "src/App.vue";

const genCdnLink = (pkg: string, version: string | undefined, path: string) => {
  version = version ? `@${version}` : "";
  switch ("jsdelivr") {
    case "jsdelivr":
      return `https://cdn.jsdelivr.net/npm/${pkg}${version}${path}`;
    // case 'jsdelivr-fastly':
    //   return `https://fastly.jsdelivr.net/npm/${pkg}${version}${path}`
    // case 'unpkg':
    //   return `https://unpkg.com/${pkg}${version}${path}`
  }
};

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
  title: "Vant Playground",
  links: [
    {
      url: "https://github.com/vant-ui/vant-playground",
      logo: cdnURL("github.svg"),
    },
  ],
};
const versions = [];
const langConfigs = [];
const MAIN_FILE = "src/PlaygroundMain.vue";
const APP_FILE = "src/App.vue";

// const query = new URLSearchParams(location.search)
const _files = {
  [APP_FILE]: new File(APP_FILE, welcomeCode),
  [MAIN_FILE]: new File(MAIN_FILE, mainCode, false),
};
console.log("_files", _files);

const compiler = shallowRef<typeof import("vue/compiler-sfc")>();
const state: StoreState = reactive({
  mainFile: MAIN_FILE,
  files: _files,
  activeFile: _files[APP_FILE],
  errors: [],
  vueRuntimeURL: "",
  vueServerRendererURL: "",
  typescriptVersion: "latest",
  typescriptLocale: undefined,
  resetFlip: true,
});
const IMPORT_MAP = "import-map.json";
const genVueLink = (version: string) => {
  const compilerSfc = genCdnLink(
    '@vue/compiler-sfc',
    version,
    '/dist/compiler-sfc.esm-browser.js'
  )
  const runtimeDom = genCdnLink(
    '@vue/runtime-dom',
    version,
    '/dist/runtime-dom.esm-browser.js'
  )
  return {
    compilerSfc,
    runtimeDom,
  }
}
async function setVueVersion(version: string) {
  const { compilerSfc, runtimeDom } = genVueLink(version);

  compiler.value = await import(/* @vite-ignore */ compilerSfc);
  state.vueRuntimeURL = runtimeDom;

  // eslint-disable-next-line no-console
  console.info(`[@vue/repl] Now using Vue version: ${version}`);
}
// TODO: 目前有一个undefined的报错，需要修复，大概率是左侧编辑器的问题
const store = reactive<Store>({
  state,
  compiler: compiler as any,
  initialShowOutput: false,
  initialOutputMode: "preview",
  init: async () => {
    await setVueVersion('latest')
    state.errors = []
    for (const file of Object.values(state.files)) {
      compileFile(store, file).then((errs) => state.errors.push(...errs))
    }
    watchEffect(() =>
      compileFile(store, state.activeFile).then((errs) => (state.errors = errs))
    )
  },
  setActive: (filename: string) => {},
  addFile: (filename: string | File) => {},
  deleteFile: (filename: string) => {},
  renameFile: (oldFilename: string, newFilename: string) => {},
  getImportMap: () => {
    const deps: Record<string, Dependency> = {
      vue: {
        pkg: "@vue/runtime-dom",
        version: "",
        path: "/dist/runtime-dom.esm-browser.js",
      },
      "@vue/shared": {
        version: "",
        path: "/dist/shared.esm-bundler.js",
      },
      vant: {
        version: "",
        path: "/es/index.mjs",
        //     vant: "https://fastly.jsdelivr.net/npm/vant@4.8.1",
      },
      "@vant/use": {
        version: "",
        path: "/dist/index.esm.mjs",
        //     "@vant/use": "https://fastly.jsdelivr.net/npm/@vant/use/dist/index.esm.mjs",
      },
      "@vant/popperjs": {
        version: "",
        path: "/dist/index.esm.mjs",
        // "https://fastly.jsdelivr.net/npm/@vue/shared/dist/index.esm.mjs",
      },
    };

    const res = {
      imports: Object.fromEntries(
        Object.entries(deps).map(([key, dep]) => [
          key,
          genCdnLink(dep.pkg ?? key, dep.version, dep.path),
        ])
      ),
    };
    console.log("nemo res", res);
    return res;
  },
  customElement: false,
});
// watchEffect(() => history.replaceState({}, "", store.serialize()));
// store.userOptions.styleSource = `https://preview-${store.pr}-element-plus.surge.sh/bundle/index.css`
</script>

<template>
  <div>
    <Header :config="config" :lang-configs="langConfigs" lang="zh-CN" />
    <Repl
      ref="replRef"
      :store="store"
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
