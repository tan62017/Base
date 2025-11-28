<script lang="ts" setup>
import type { ObjType, ArrType } from '@/types';

interface ChartData {
  title?: string;
  tooltip?: {
    [name: string]: any;
  };
  color?: string[];
  legend?: ArrType | ObjType;
  grid?: ObjType;
  xAxis?: ArrType | ObjType;
  yAxis?: ArrType | ObjType;
  dataZoom?: ArrType;
  dataset?: {};
  series: {
    name?: string;
    data?: number[] | { value: number; name: string;[name: string]: any }[] | ArrType;
    radius?: string | string[]; // 饼图特有的属性
    [name: string]: any;
  }[];
}

const props = defineProps<{
  chartData: ChartData;
  chartStyle?: Record<string, string>;
  animateFlag?: boolean;
}>();

const chartOptions = ref({});
const refDom = ref(null);

watch(
  () => props.chartData,
  () => {
    updateChartOptions();
  },
  { immediate: true, deep: true },
);

function updateChartOptions() {
  const { title, grid, xAxis, yAxis, series, legend, tooltip, dataZoom, dataset } = props.chartData;

  chartOptions.value = {
    // title: { text: title },
    tooltip: {
      backgroundColor: 'rgba(4,45,36,0.9)',
      textStyle: {
        color: '#fff',
        fontSize: 16,
      },
      ...tooltip,
    },
    legend: legend,
    grid: grid,
    dataset,
    xAxis: xAxis || undefined,
    yAxis: yAxis || undefined,
    dataZoom: dataZoom,
    series: series.map((s) => ({
      ...s,
      ...(s.type === 'pie' ? { radius: s.radius } : {}), // 饼图特有
    })),
  };
}

function handleResize() {
  //@ts-ignore
  refDom?.value.resize();
}
onMounted(() => {
  window.addEventListener('resize', handleResize);
  const ecgartsDom = refDom.value;
});
onUnmounted(() => {
  animateUnmouted();
});


function animateUnmouted() {
  window.removeEventListener('resize', handleResize);
}


defineExpose({
  dom: refDom,
});
</script>

<template>

  <v-chart id="echarts" ref="refDom" auto-resize :option="chartOptions" :style="chartStyle" />

</template>
