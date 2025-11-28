<!-- 小屏 -->
<template>
  <div class="is-mask" v-show="_show" @click="closeDialog"></div>
  <div class="min-dialog my-dialog" v-show="_show" :append-to-body="true" v-bind="$attrs">
    <div class="header-title">
      <div class="left">
        {{ title }}
        <slot name="unit" :data="unit">
          <span class="unit" v-if="unit">{{ unit ?? '' }}</span>
        </slot>
      </div>
      <div class="right" @click="closeDialog">X</div>
    </div>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['update:show']);
interface IProps {
  title: string;
  show: boolean;
  top?: string;
  unit?: string;
}
const props = withDefaults(defineProps<IProps>(), {
  show: false,
  top: '20%',
});
const _show = computed(() => {
  return props.show;
});
const closeDialog = () => {
  emits('update:show', false);
};
</script>

<style lang="scss" scoped>
.is-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--dialog-mask-bg-color);
  // filter: blur(20px);
  backdrop-filter: blur(2px);
  z-index: 999999;
}

.min-dialog {
  z-index: 999999;
  position: fixed;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 10px;
  background-color: var(--dialog-bg-color);
  // background: url('') no-repeat;
  // background-size: 100% 100% !important;
}

.header-title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px 0;
  font-size: 24px;
  color: var(--text-default-color);

  .left {
    padding: 0 50px 0 50px;
    text-align: center;

    .unit {
      margin-left: 16px;
      font-size: 16px;
      color: var(--vt-c-text-light-2);
    }
  }

  .right {
    position: absolute;
    top: 50% !important;
    right: 10px !important;
    transform: translateY(-50%) !important;
    width: 33px !important;
    height: 33px !important;
    color: var(--vt-c-text-light-2);
    cursor: pointer !important;
    // margin-top: 16px;
    // margin-right: 16px;
  }
}

main {
  height: calc(100% - 60px);
}
</style>
