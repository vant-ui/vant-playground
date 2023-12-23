<script setup lang="ts">
// import { packageVersion } from 'site-desktop-shared';
// import { getDefaultTheme, syncThemeToChild } from '../../common/iframe-sync';
import { gte } from 'semver'
import VersionSelect from './VersionSelect.vue';
import {
  watch,
  defineProps,
  toRefs,
  computed,
  reactive,
  ref,
  unref,
  type Ref,
} from "vue";
import type { MaybeRef } from "@vueuse/core";
import { useFetch } from "@vueuse/core";

interface Version {
  text: string;
  published: Ref<string[]>;
  active: string;
}

const onChangeVersion = (item) => {
  console.log("onchangeversion", item);
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
  const versions = getVersions('vue')
  return computed(() =>
    versions.value.filter((version) => gte(version, '3.2.0'))
  )
}

const getSupportedTSVersions = () => {
  const versions = getVersions('typescript')
  return computed(() =>
    versions.value.filter(
      (version) => !version.includes('dev') && !version.includes('insiders')
    )
  )
}

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

const packageVersion = "v1.0.0";
const versionPopState = ref({
  isShow: false,
});
const showVersionPop = ref(false);
const currentTheme = ref("light");

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
  if (currentTheme.value === "light") {
    return "https://b.yzcdn.cn/vant/dark-theme.svg";
  }
  return "https://b.yzcdn.cn/vant/light-theme.svg";
});

watch(
  currentTheme,
  (newVal, oldVal) => {
    window.localStorage.setItem("vantTheme", newVal);
    document.documentElement.classList.remove(`van-doc-theme-${oldVal}`);
    document.documentElement.classList.add(`van-doc-theme-${newVal}`);
  },
  { immediate: true }
);

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}
const toggleVersionPop = () => {
  const val = !showVersionPop.value;
  const action = val ? "add" : "remove";
  document.body[`${action}EventListener`]("click", checkHideVersionPop);
  showVersionPop.value = val;
};

const checkHideVersionPop = (event) => {
  // if (!this.$refs.version.contains(event.target)) {
  //       this.showVersionPop = false;
  //     }
};
const onSwitchLang = (lang) => {
  // this.$router.push(this.$route.path.replace(lang.from, lang.to));
};

const onSwitchVersion = (version) => {
  if (version.link) {
    location.href = version.link;
  }
};
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
            <VersionSelect @change="onChangeVersion" :label="v.text" :options="v.published" />
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
