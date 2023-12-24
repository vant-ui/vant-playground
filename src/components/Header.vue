<script setup lang="ts">
// import { packageVersion } from 'site-desktop-shared';
// import { getDefaultTheme, syncThemeToChild } from '../../common/iframe-sync';
import { ReplStore } from "@vue/repl";
import { gte } from "semver";
import VersionSelect from "./VersionSelect.vue";
import {
  watch,
  defineProps,
  computed,
  reactive,
  ref,
  unref,
  type Ref,
  inject,
} from "vue";
import type { MaybeRef } from "@vueuse/core";
import { useDark, useFetch, useToggle } from "@vueuse/core";
import { genCdnLink } from "@/utils";

interface Version {
  text: string;
  published: Ref<string[]>;
  active: string;
}

const store = inject("store") as ReplStore;

const onChangeVersion = (key: keyof typeof versions, version: string) => {
  switch (key) {
    case "vue":
      store.setVueVersion(version);
      break;
    default:
      const dep = {
        version: version,
        path: "/es/index.mjs",
      };

      const importMap = store.getImportMap();
      importMap.imports[key] = genCdnLink(key, dep.version, dep.path);

      store.setImportMap(importMap);
      break;
  }
};

const getVersions = (pkg: MaybeRef<string>) => {
  const url = computed(
    () => `https://data.jsdelivr.com/v1/package/npm/${unref(pkg)}`
  );
  return useFetch(url, {
    initialData: [],
    afterFetch: (ctx) => ((ctx.data = ctx.data.versions), ctx),
    refetch: true,
  }).json<string[]>().data as Ref<string[]>;
};

const getSupportedVueVersions = () => {
  const versions = getVersions("vue");
  return computed(() =>
    versions.value.filter((version) => gte(version, "3.2.0"))
  );
};

const getSupportedTSVersions = () => {
  const versions = getVersions("typescript");
  return computed(() =>
    versions.value.filter(
      (version) => !version.includes("dev") && !version.includes("insiders")
    )
  );
};

const versions = reactive<Record<string, Version>>({
  vant: {
    text: "Vant",
    published: getVersions("vant"),
    active: "",
  },
  vue: {
    text: "Vue",
    published: getSupportedVueVersions(),
    active: "",
  },
  typescript: {
    text: "TypeScript",
    published: getSupportedTSVersions(),
    active: "",
  },
});

const dark = useDark();
const _toggleTheme = useToggle(dark)
const toggleTheme = () => _toggleTheme()

const packageVersion = "v1.0.0";
const versionPopState = ref({
  isShow: false,
});
const showVersionPop = ref(false);

const props = defineProps<{
  lang: String;
  config: {
    logo: string;
    title: string;
    subtitle: string;
    links: Array<{
      url: string;
      logo: string;
      text?: string;
    }>;
  };
  langConfigs: string[];
}>();

// const langLink = computed(() => `#${this.$route.path.replace(this.lang, this.anotherLang.lang)}`)
const langLink = "";

const anotherLang: any = computed(() => {
  const items = props.langConfigs?.filter(
    (item: any) => item.lang !== props.lang
  );
  if (items?.length) {
    return items[0];
  }

  return {};
});

const langLabel = computed(() => anotherLang.label);

const themeImg = computed(() => {
  if (dark.value) {
    return "https://b.yzcdn.cn/vant/light-theme.svg";
  }
  return "https://b.yzcdn.cn/vant/dark-theme.svg";
});
</script>

<template>
  <div class="van-doc-header">
    <div class="van-doc-row">
      <div class="van-doc-header__top">
        <a class="van-doc-header__logo">
          <img :src="config.logo" />
          <span class="van-doc-header__title">{{ config.title }}</span>
          <span v-if="config.subtitle" class="van-doc-header__subtitle">
            {{ config.subtitle }}
          </span>
        </a>

        <ul class="van-doc-header__top-nav">
          <li
            v-for="(item, index) in config.links"
            :key="index"
            class="van-doc-header__top-nav-item"
          >
            <a class="van-doc-header__link" target="_blank" :href="item.url">
              <img v-if="item.logo" :src="item.logo" />
              <span v-else-if="item.text">
                {{ item.text }}
              </span>
            </a>
          </li>

          <li class="van-doc-header__top-nav-item">
            <a
              class="van-doc-header__link"
              target="_blank"
              @click="toggleTheme"
            >
              <img :src="themeImg" />
            </a>
          </li>

          <li
            ref="version"
            v-for="(v, key) of versions"
            :key="key"
            class="van-doc-header__top-nav-item"
          >
            <VersionSelect
              @change="(version) => onChangeVersion(key, version)"
              :label="v.text"
              :options="v.published"
            />
          </li>

          <li v-if="langLabel && langLink" class="van-doc-header__top-nav-item">
            <a class="van-doc-header__cube" :href="langLink">
              {{ langLabel }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.van-doc-header {
  width: 100%;
  background-color: var(--van-doc-header-background);
  user-select: none;
  position: relative;
  z-index: 2;

  &__top {
    display: flex;
    align-items: center;
    height: var(--van-doc-header-top-height);
    padding: 0 var(--van-doc-padding);

    &-nav {
      flex: 1;
      font-size: 0;
      text-align: right;

      > li {
        position: relative;
        display: inline-block;
        vertical-align: middle;
      }

      &-item {
        margin-left: 16px;
      }

      &-title {
        display: block;
        font-size: 15px;
      }
    }
  }

  &__logo {
    display: block;

    img {
      display: inline-block;
      width: 28px;
      margin-right: 12px;
      vertical-align: middle;
    }
  }

  &__title {
    display: inline-block;
    color: #fff;
    font-size: 22px;
    vertical-align: middle;
  }

  &__subtitle {
    display: inline-block;
    color: #999;
    margin-left: 4px;
    vertical-align: -4px;
    font-size: 13px;
  }

  &__link {
    cursor: pointer;

    span {
      color: #fff;
      font-size: 16px;
    }

    img {
      display: block;
      width: 30px;
      height: 30px;
      transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>
