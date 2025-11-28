<template>
  <el-tooltip :effect="effect" :content="content" :placement="placement" v-bind="$attrs">
    <slot></slot>

    <template #content>
      <div class="tip-main">
        <slot name="content"></slot>
      </div>
    </template>
  </el-tooltip>

  <!-- visible -->
</template>

<script setup lang="ts">
interface IProps {
  content?: string;
  placement?: string;
  effect?: string;
}

withDefaults(defineProps<IProps>(), {
  placement: 'top',
  effect: 'dark',
});
</script>

<style lang="scss" scoped>
.tip-main {
  animation-name: rotate180;
  animation-duration: 0.5s;
}
</style>
<style>
.el-popper.is-dark,
.el-popper.is-light {
  /* --el-text-color-primary: #00809d; */
  /* --el-color-white: #00809d; */
  /* --el-border-color-light: #00809d; */
  padding: 2px 8px;
  /* border-radius: 12px; */
  top: -50px;
  /* color: #fff; */
  /* background: #00809d; */
  /* box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.07); */
  /* transform: rotateY(-180deg); */
  background: transparent;
  box-shadow: none;
  background: url(../assets/images/dialog-hover.png) 100%/100% !important;
  /* background-size: 100% 100%; */
  padding: 0;
}
</style>
