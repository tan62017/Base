<template>
  <div class="time-pick-box">
    <el-date-picker v-bind="$attrs" v-model="value" :type="type" :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder" :default-time="defaultTime" :format="format" :value-format="valueFormat"
      :teleported="false" @change="change">
      <template #default="cell">
        <slot name="default" :data="cell"></slot>
      </template>
    </el-date-picker>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import dayjs from 'dayjs';

interface IProps {
  defaultTime?: string | Array<Date | string | number>;
  type?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  format?: string;
  valueFormat?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'daterange',
  startPlaceholder: '请选择起始时间',
  endPlaceholder: '请选择结束时间',
  format: 'YYYY年MM月DD日',
  valueFormat: 'YYYY-MM-DD',
  //   defaultTime: new Date('2022-2-2'),
  // defaultTime: [new Date('2024-01-01'), new Date('2024-11-01')],
});

const emits = defineEmits(['change']);

const value = ref<string | string[]>('');
const change = () => {
  if (Array.isArray(value.value)) {
    value.value = value.value.map((i) => {
      if (new Date(i) > new Date()) return dayjs(new Date()).format('YYYY-MM-DD');
      else return dayjs(new Date(i)).format('YYYY-MM-DD');
    });
  } else {
    value.value = dayjs(value.value).format('YYYY-MM-DD');
  }
  emits('change', value.value);
};

watch(
  () => props.defaultTime,
  (val) => {
    if (val) {
      if (Array.isArray(val)) {
        value.value = val.map((i) => {
          if (new Date(i) > new Date()) return dayjs(new Date()).format('YYYY-MM-DD');
          else return dayjs(new Date(i)).format('YYYY-MM-DD');
        });
      } else {
        value.value = dayjs(val).format('YYYY-MM-DD');
      }
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.time-pick-box {
  width: 330px;

  border-radius: 10px;
  overflow: hidden;

  :deep(.el-date-editor) {
    width: 100%;
    // padding: 10px;
    height: 40px;
    font-size: 20px;
    background-color: rgb(27, 42, 65);
    box-shadow: none;
    border-color: transparent;

    .el-input__wrapper {
      background-color: rgb(27, 42, 65);
      box-shadow: none;
    }

    .el-range__icon,
    .el-range-separator,
    .el-range-input,
    .el-input__inner,
    .el-input__icon {
      color: #fff;
      font-size: 20px;
    }

    .el-range__icon {
      margin-right: 8px;
    }

    .el-range-input::placeholder {
      font-size: 14px;
    }
  }

  :deep(.el-range-editor.is-disabled input) {
    background-color: rgb(27, 42, 65);
  }

  // :deep(.el-date-range-picker__header div) {
  //     font-size: 20px !important;
  // }
}
</style>
<style>
.el-date-range-picker__header div {
  font-size: 20px !important;
}

/* .el-picker-panel {
  background: transparent;
} */
</style>
