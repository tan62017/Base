<template>
  <BaseTable stripe :data="tableData" :columns="tableColumns" />
  <div class="test-contrain">
    <div class="div color-orange font-size-40px text-center">
      <div class="div-1 flex justify-around" v-for="(i, index) in list" :key="index">
        <div class="div-2 flex justify-center text-white font-600 font-size-30px" v-for="(it, ind) in i.children"
          :key="ind">
          {{ it.label }}
        </div>
      </div>
    </div>
    <BaseEchart v-for="(chart, index) in charts" :key="index" :chart-data="chart.data"
      :chart-style="{ width: '100%', height: '400px' }" />
  </div>
</template>

<script lang="ts" setup>
import BaseEchart from '@/components/BaseEchart.vue';
import BaseTable from '@/components/BaseTable.vue';
import { getLastDate } from '@/api/indexHome';

for (let i = 0; i < 100; i++) {
  getLastDate({ id: i }).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.error("err:", err);
  });

}

const list = [
  {
    name: 1,
    label: 'a',
    children: [
      {
        name: '1-1',
        label: 'a-1',
      },
      {
        name: '1-2',
        label: 'a-2',
      },
      {
        name: '1-3',
        label: 'a-3',
      },

    ],
  },
  {
    name: 1,
    label: 'b',
    children: [
      {
        name: '1-1',
        label: 'b-1',
      },
      {
        name: '1-2',
        label: 'b-2',
      },
      {
        name: '1-3',
        label: 'b-3',
      },
      {
        name: '1-4',
        label: 'b-4',
      },
    ],
  },
  {
    name: 1,
    label: 'c',
    children: [
      {
        name: '1-1',
        label: 'c-1',
      },
      {
        name: '1-2',
        label: 'c-2',
      },
      {
        name: '1-3',
        label: 'c-3',
      },
      {
        name: '1-4',
        label: 'c-4',
      },
    ],
  },
];

const page = {
  // currentPage: 1,
  // pageSize: 10,
  // total: 40,
  // pageCount: 4,
  // layout: 'prev, pager, next',
};
// 示例数据DD
const tableData = [
  {
    id: '12987122',
    name: 'Tom1',
    amount1: '2351254',
    amount2: '35135.2',
    amount3: 104123425,
  },
  {
    id: '12987123',
    name: 'Tom2',
    amount1: '161432515',
    amount2: '4413244.43',
    amount3: 15323512,
  },
  {
    id: '12987124',
    name: 'Tom3',
    amount1: '35213524',
    amount2: '11235.9',
    amount3: 95135,
  },
  {
    id: '12987125',
    name: 'Tom4',
    amount1: '6512521',
    amount2: '24134.2',
    amount3: 153217,
  },
  {
    id: '12987126',
    name: 'Tom5',
    amount1: '53324129',
    amount2: '4.4121',
    amount3: 14321435,
  },
];

// 动态列定义
const tableColumns = [
  { label: '名称', prop: 'name' },
  { label: '值1', prop: 'amount1', sortType: 'custom' },
  { label: '值2', prop: 'amount2', textAlign: 'center' },
  { label: '值3', prop: 'amount3', textAlign: 'center' },
];

// 图表数据集合
const charts = [
  {
    data: {
      title: '折线图示例',
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [{ type: 'category', data: ['一月', '二月', '三月', '四月', '五月', '六月'] }],
      yAxis: [{ type: 'value' }],
      series: [{ type: 'line', name: '销量', data: [120, 200, 150, 80, 70, 110] }],
    },
  },
  {
    data: {
      title: '柱状图示例',
      xAxis: [{ type: 'category', data: ['一月', '二月', '三月', '四月', '五月', '六月'] }],
      yAxis: [{ type: 'value' }],
      series: [{ type: 'bar', name: '销量', data: [120, 200, 150, 80, 70, 110] }],
    },
  },
  {
    data: {
      title: '柱状图示例',
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [{ type: 'category', data: ['一月', '二月', '三月', '四月', '五月', '六月'] }],
      yAxis: [
        { name: '柱状系列', type: 'value', position: 'left' },
        { name: '折线系列', type: 'value', position: 'right', alignTicks: true },
      ],
      series: [
        { name: '系列1', type: 'bar', stack: '同系列', data: [120, 132, 101, 134, 90, 43] },
        { name: '系列2', type: 'bar', stack: '同系列', data: [220, 182, 191, 234, 290, 542] },
        { name: '系列3', type: 'bar', stack: '同系列', data: [150, 232, 201, 154, 190, 324] },
        { name: '系列4', type: 'line', yAxisIndex: 1, data: [0.3, 0.6, 0.5, 0.7, 0.9, 0.78] },
        { name: '系列5', type: 'line', yAxisIndex: 1, data: [0.63, 0.16, 0.95, 0.27, 0.79, 0.33] },
      ],
    },
  },
  {
    type: 'pie',
    data: {
      title: '饼图示例',
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' },
          ],
        },
      ],
    },
  },
  {
    type: 'pie',
    data: {
      title: '饼图示例',
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['30%', '50%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' },
          ],
        },
      ],
    },
  },
];

const rowClick = (data: any) => {
  console.log(data);
};
</script>

<style scoped>
/* 样式根据需要添加 */
.test-contrain {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}

.div {
  width: 100%;

  div {
    white-space: nowrap;
    margin: 20px;
  }

  .div-1 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
