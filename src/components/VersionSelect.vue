<script setup lang="ts">
import {
  ref,
  defineProps,
  type Ref,
} from "vue";
const emit = defineEmits(["update:modelValue"]);
const showVersionPop = ref(false);
defineProps<{
  modelValue: string;
  options: Ref<string[]>;
  label: string;
}>();
const toggleVersionPop = () => {
  showVersionPop.value = !showVersionPop.value;
};
const onSwitchVersion = (version: any) => {
  emit('update:modelValue', version);
};
</script>

<template>
  <div class="van-doc-header__select">
    <span
      class="van-doc-header__cube van-doc-header__version"
      @click="toggleVersionPop"
    >
      {{ label }}: {{ modelValue || 'latest' }}
      <transition name="van-doc-dropdown">
        <div v-if="showVersionPop" class="van-doc-header__version-pop">
          <div
            v-for="(item, index) in options"
            :key="index"
            class="van-doc-header__version-pop-item"
            @click="onSwitchVersion(item)"
          >
            {{ item }}
          </div>
        </div>
      </transition>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.van-doc-header {
  &__cube {
    position: relative;
    display: block;
    padding: 0 12px;
    color: #001938;
    background: #f7f8fa;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }

  &__version {
    padding-right: 20px;

    &::after {
      position: absolute;
      top: 10px;
      right: 9px;
      width: 5px;
      height: 5px;
      color: #001938;
      border: 1px solid;
      border-color: transparent transparent currentColor currentColor;
      transform: rotate(-45deg);
      content: "";
    }

    &-pop {
      position: absolute;
      top: 34px;
      left: 0;
      width: 100%;
      z-index: 99;
      color: #333;
      line-height: 36px;
      text-align: left;
      overflow: hidden;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px #ebedf0;
      transform-origin: top;
      transition: 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
      height: 500px;
      overflow-y: scroll;

      &-item {
        padding-left: 12px;
        transition: 0.2s;

        &:hover {
          color: var(--van-doc-link-color);
          background-color: #f7f8fa;
        }
      }
    }
  }
}

.van-doc-dropdown {
  &-enter,
  &-leave-active {
    transform: scaleY(0);
    opacity: 0;
  }
}
</style>
