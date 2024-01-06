// custom repl's store
import { File, ReplStore, type StoreOptions } from '@vue/repl';
import { utoa, genCdnLink } from './utils';

import welcomeCode from './template/App.vue?raw';
import mainCode from './template/main.vue?raw';
import vantCode from './template/vant.ts?raw';
import tsconfigCode from './template/tsconfig.json?raw';

interface Dependency {
  pkg?: string;
  version?: string;
  path: string;
}

const MAIN_FILE = 'src/PlaygroundMain.vue';
const WELCOME_FILE = 'src/App.vue';
const VANT_FILE = 'src/vant.ts';
const TSCONFIG = 'tsconfig.json';
const IMPORT_MAP_FILE = 'import-map.json';

const genVantCode = () => {
  return vantCode.replace('#STYLE#', genCdnLink('vant', '', '/lib/index.css'));
};

const deps: Record<string, Dependency> = {
  vue: {
    pkg: '@vue/runtime-dom',
    version: '',
    path: '/dist/runtime-dom.esm-browser.js',
  },
  'vue/server-renderer': {
    pkg: '@vue/server-renderer',
    version: '',
    path: '/dist/server-renderer.esm-browser.js',
  },
  '@vue/shared': {
    pkg: '@vue/shared',
    version: '',
    path: '/dist/shared.esm-bundler.js',
  },
  'vant/lib/index.css': {
    version: '',
    path: '',
  },
  vant: {
    pkg: 'vant',
    version: '',
    path: '/es/index.mjs',
  },
  '@vant/use': {
    pkg: '@vant/use',
    version: '',
    path: '/dist/index.esm.mjs',
  },
  '@vant/popperjs': {
    pkg: '@vant/popperjs',
    version: '',
    path: '/dist/index.esm.mjs',
  },
};

const getImportMap = () => {
  const res = {
    imports: Object.fromEntries(
      Object.entries(deps).map(([key, dep]) => [
        key,
        genCdnLink(dep.pkg ?? key, dep.version, dep.path),
      ]),
    ),
  };
  return res;
};

const _files = {
  [WELCOME_FILE]: welcomeCode,
  [IMPORT_MAP_FILE]: JSON.stringify(getImportMap(), null, 2),
  [TSCONFIG]: tsconfigCode,
};

const userFiles = location.hash.slice(1);
// const userFiles = '';

export class VantReplStore extends ReplStore {
  constructor(storeOptions: StoreOptions = {}) {
    super(storeOptions);
    this.state.mainFile = MAIN_FILE;
    this.addFile(new File(MAIN_FILE, mainCode, true));
    this.addFile(new File(VANT_FILE, genVantCode(), true));
    this.setActive(WELCOME_FILE);
  }

  async setVueVersion(version: string) {
    super.setVueVersion(version);
    console.log('nemo set vue version', version);
    this.vueVersion = version;
  }

  _getVersion(pkg: string) {
    const json = this.getImportMap();
    const reg = new RegExp(`.*${deps[pkg].pkg}|${deps[pkg].path}|@`, 'g');
    const version = json.imports[pkg].replace(reg, '');
    return version || '';
  }

  getVueVersion() {
    // TODO: @vue/repl 初始化阶段就应该提供 getVueVersion，初始化时的 this.vueVersion 是无效的
    // ! 这种写法后续应该通过获取 this.vueVersion 替代
    return this._getVersion('vue');
  }

  getVantVersion() {
    return this._getVersion('vant');
  }
}
const store = new VantReplStore({
  serializedState: userFiles ? userFiles : utoa(JSON.stringify(_files)),
});

const SHOW_ERROR_KEY = 'repl_show_error';
localStorage.setItem(SHOW_ERROR_KEY, 'false');
export default store;
