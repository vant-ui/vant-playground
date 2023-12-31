<script setup lang="ts">
import { gte } from 'semver';
import VersionSelect from './VersionSelect.vue';
import { defineProps, computed, reactive, unref, type Ref, inject } from 'vue';
import type { MaybeRef } from '@vueuse/core';
import {
  useDark,
  useFetch,
  useToggle,
  usePreferredDark,
  useClipboard,
} from '@vueuse/core';
import { showToast } from 'vant';
import { genCdnLink } from '@/utils';
import type { VantReplStore } from '@/store';

interface Version {
  text: string;
  published: Ref<string[]>;
  active: string;
}

const store = inject('store') as VantReplStore;

const onChangeVersion = (key: keyof typeof versions, version: string) => {
  versions[key].active = version;
  let importMap;
  switch (key) {
    case 'vue':
      store.setVueVersion(version);
      break;
    case 'vant':
      importMap = store.getImportMap();
      importMap.imports[key] = genCdnLink(key, version, '/es/index.mjs');
      importMap.imports['vant/lib/index.css'] = genCdnLink(
        'vant',
        version,
        '/lib/index.css',
      );

      store.setImportMap(importMap);
      break;
  }
};

const getVersions = (pkg: MaybeRef<string>) => {
  const url = computed(
    () => `https://data.jsdelivr.com/v1/package/npm/${unref(pkg)}`,
  );
  return useFetch(url, {
    initialData: [],
    afterFetch: (ctx) => ((ctx.data = ctx.data.versions), ctx),
    refetch: true,
  }).json<string[]>().data as Ref<string[]>;
};

const getSupportedVueVersions = () => {
  const versions = getVersions('vue');
  return computed(() =>
    versions.value.filter((version) => gte(version, '3.2.0')),
  );
};

const getVersionActive = (pkg: 'vue' | 'vant') => {
  switch (pkg) {
    case 'vue':
      return store.getVueVersion();
    case 'vant':
      return store.getVantVersion();
  }
};
const versions = reactive<Record<string, Version>>({
  vant: {
    text: 'Vant',
    published: getVersions('vant'),
    active: getVersionActive('vant'),
  },
  vue: {
    text: 'Vue',
    published: getSupportedVueVersions(),
    active: getVersionActive('vue'),
  },
});

const dark = useDark();
const isDark = usePreferredDark();
const _toggleTheme = useToggle(dark);
const toggleTheme = () => _toggleTheme();

if (isDark.value !== dark.value) {
  toggleTheme();
}

const { copy } = useClipboard();
const onSharePage = () => {
  copy(location.href)
    .then(() => showToast('分享链接已复制到剪贴板'))
    .catch(() => showToast('复制失败，请手动复制链接'));
};

const props = defineProps<{
  lang: string;
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
const langLink = '';

const anotherLang: any = computed(() => {
  const items = props.langConfigs?.filter(
    (item: any) => item.lang !== props.lang,
  );
  if (items?.length) {
    return items[0];
  }

  return {};
});

const langLabel = computed(() => anotherLang.value.label);

const themeImg = computed(() => {
  if (dark.value) {
    return 'https://b.yzcdn.cn/vant/light-theme.svg';
  }
  return 'https://b.yzcdn.cn/vant/dark-theme.svg';
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
            <a class="van-doc-header__link" @click="onSharePage">
              <span>
                <van-icon name="share" />
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
              :model-value="v.active"
              @update:model-value="onChangeVersion(key, $event)"
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
      width: 30px;
      height: 30px;
      background-color: #fff;
      font-size: 22px;
      border-radius: 30px;
      display: block;
      text-align: center;
      line-height: 30px;
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
