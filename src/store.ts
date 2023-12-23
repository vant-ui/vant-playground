// custom repl's store
import { ReplStore } from '@vue/repl'
import { utoa, genCdnLink } from "./utils";

import welcomeCode from "./template/App.vue?raw";
import vantCode from "./template/vant.js?raw";
import tsconfigCode from "./template/tsconfig.json?raw";

interface Dependency {
  pkg?: string
  version?: string
  path: string
}

const WELCOME_FILE = "src/App.vue";
const VANT_FILE = "src/vant.js";
const TSCONFIG = "tsconfig.json";
const IMPORT_MAP_FILE = "import-map.json";

const genVantCode = () => {
  return vantCode.replace("#STYLE#", genCdnLink("vant", "", "/lib/index.css"));
};

const getImportMap = () => {
  const deps: Record<string, Dependency> = {
    vue: {
      pkg: "@vue/runtime-dom",
      version: "",
      path: "/dist/runtime-dom.esm-browser.js",
    },
    "vue/server-renderer": {
      pkg: "@vue/server-renderer",
      version: "",
      path: "/dist/server-renderer.esm-browser.js",
    },
    "@vue/shared": {
      version: "",
      path: "/dist/shared.esm-bundler.js",
    },
    "vant/lib/index.css": {
      version: "",
      path: "",
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
  console.log("nemo files", res);
  return res;
};

const files = {
  [WELCOME_FILE]: welcomeCode,
  [IMPORT_MAP_FILE]: JSON.stringify(getImportMap(), null, 2),
  [VANT_FILE]: genVantCode(),
  [TSCONFIG]: tsconfigCode,
};
const store = new ReplStore({
  serializedState: utoa(JSON.stringify(files)),
});

export default store