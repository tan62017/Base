<template>
  <div v-size-ob="handleSizeChange" class="scroll-contrain">
    <div class="v-scroll">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const size = reactive({
  w: 0,
  h: 0,
});

const handleSizeChange = (react: { width: number; height: number }) => {
  size.w = react.width;
  size.h = react.height;
};
</script>

<style lang="scss" scoped>
.scroll-contrain {
  width: 100%;
  height: 100%;

  .v-scroll {
    --w: calc(v-bind(size.w) * 1px);
    --h: calc(v-bind(size.h) * 1px);
    width: var(--h);
    height: var(--w);
    position: relative;
    transform-origin: left top;
    transform: translateY(var(--h)) rotate(-90deg);
    overflow: scroll;

    &::-webkit-scrollbar {
      display: none;
    }

    .content {
      width: var(--w);
      height: var(--h);
      position: absolute;
      left: var(--h);
      transform-origin: left top;
      transform: rotate(90deg);
    }
  }
}
</style>
